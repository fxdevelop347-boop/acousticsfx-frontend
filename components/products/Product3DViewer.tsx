"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import type { VisualizerTexture, VisualizerDimensions } from "@/lib/products-api";
import { getVisualizerTextureLoadUrl } from "@/lib/texture-proxy-url";

export { hasVisualizerTextures } from "@/lib/products-api";

type TextureSlot = {
  name: string;
  thumb: string;
  image: HTMLImageElement;
};

async function loadTextureSlotFromUrl(name: string, imageUrl: string): Promise<TextureSlot> {
  const loadUrl = getVisualizerTextureLoadUrl(imageUrl);
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${loadUrl}`));
    img.src = loadUrl;
  });
  return {
    name,
    thumb: loadUrl,
    image: img,
  };
}

export interface Product3DViewerProps {
  visualizerTextures?: VisualizerTexture[];
  visualizerDimensions?: VisualizerDimensions;
}

export default function Product3DViewer({
  visualizerTextures,
  visualizerDimensions,
}: Product3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const geoRef = useRef<THREE.BoxGeometry | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const drag = useRef({ active: false, lastX: 0, lastY: 0, rotX: 0.3, rotY: 0.6 });
  const threeInitializedRef = useRef(false);
  const buildPanelRef = useRef<() => void>(() => {});
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  const [clientReady, setClientReady] = useState(false);
  const [slots, setSlots] = useState<TextureSlot[]>([]);
  const [texturesLoading, setTexturesLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const [dims, setDims] = useState({
    W: visualizerDimensions?.width ?? 120,
    H: visualizerDimensions?.height ?? 60,
    D: visualizerDimensions?.depth ?? 4,
  });

  const texturesKey = useMemo(
    () => JSON.stringify(visualizerTextures ?? []),
    [visualizerTextures]
  );

  const slotsRef = useRef(slots);
  const activeSlotRef = useRef(activeSlot);
  const dimsRef = useRef(dims);

  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);
  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);
  useEffect(() => {
    dimsRef.current = dims;
  }, [dims]);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!visualizerDimensions) return;
    setDims((d) => ({
      W: visualizerDimensions.width ?? d.W,
      H: visualizerDimensions.height ?? d.H,
      D: visualizerDimensions.depth ?? d.D,
    }));
  }, [visualizerDimensions?.width, visualizerDimensions?.height, visualizerDimensions?.depth]);

  useEffect(() => {
    if (!clientReady) return;
    let cancelled = false;
    setTexturesLoading(true);
    setLoadError(false);

    const run = async () => {
      try {
        const list = visualizerTextures?.filter((t) => t.image?.trim()) ?? [];
        if (list.length === 0) {
          if (!cancelled) setSlots([]);
          return;
        }
        const out: TextureSlot[] = [];
        for (const vt of list) {
          if (cancelled) return;
          try {
            out.push(await loadTextureSlotFromUrl(vt.name?.trim() || "Finish", vt.image.trim()));
          } catch (e) {
            console.warn("Product3DViewer: texture load failed", vt.image, e);
          }
        }
        if (cancelled) return;
        if (out.length === 0) {
          setLoadError(true);
          setSlots([]);
        } else {
          setSlots(out);
          setActiveSlot(0);
        }
      } finally {
        if (!cancelled) setTexturesLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [clientReady, texturesKey]);

  const buildTexture = useCallback((slot: TextureSlot) => {
    const tex = new THREE.Texture(slot.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const buildPanel = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const slot = slotsRef.current[activeSlotRef.current];
    if (!slot) return;

    if (meshRef.current) scene.remove(meshRef.current);
    if (geoRef.current) geoRef.current.dispose();

    const { W, H, D } = dimsRef.current;
    const w = W / 100;
    const h = H / 100;
    const d = D / 100;

    const geo = new THREE.BoxGeometry(w, h, d);
    geoRef.current = geo;

    const baseTex = buildTexture(slot);

    const makeMat = (repX: number, repY: number, roughness = 0.75) => {
      const t = baseTex.clone();
      t.needsUpdate = true;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repX, repY);
      return new THREE.MeshStandardMaterial({ map: t, roughness, metalness: 0.02 });
    };

    const mats = [
      makeMat(Math.max(0.1, d / h), 1),
      makeMat(Math.max(0.1, d / h), 1),
      makeMat(1, Math.max(0.1, d / w)),
      makeMat(1, Math.max(0.1, d / w)),
      makeMat(1, 1, 0.7),
      makeMat(1, 1, 0.7),
    ];

    const mesh = new THREE.Mesh(geo, mats);
    scene.add(mesh);

    const edges = new THREE.EdgesGeometry(geo, 15);
    mesh.add(
      new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
      )
    );

    meshRef.current = mesh;
  }, [buildTexture]);

  buildPanelRef.current = buildPanel;

  useEffect(() => {
    if (!clientReady) return;
    if (threeInitializedRef.current) return;

    let cancelled = false;

    const start = () => {
      if (cancelled || threeInitializedRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) {
        requestAnimationFrame(start);
        return;
      }

      threeInitializedRef.current = true;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0e0e12);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
      camera.position.set(1.8, 1.1, 2.2);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const dl = new THREE.DirectionalLight(0xffffff, 1.1);
      dl.position.set(3, 5, 4);
      scene.add(dl);
      const dl2 = new THREE.DirectionalLight(0xffeedd, 0.35);
      dl2.position.set(-3, -2, -2);
      scene.add(dl2);

      const onResize = () => {
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        renderer.setSize(cw, ch, false);
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
      };
      resizeHandlerRef.current = onResize;
      onResize();
      window.addEventListener("resize", onResize);

      buildPanelRef.current();

      const animate = () => {
        if (cancelled) return;
        animFrameRef.current = requestAnimationFrame(animate);
        const dr = drag.current;
        if (!dr.active) dr.rotY += 0.003;
        if (meshRef.current) {
          meshRef.current.rotation.x = dr.rotX;
          meshRef.current.rotation.y = dr.rotY;
        }
        renderer.render(scene, camera);
      };
      animate();
    };

    requestAnimationFrame(start);

    return () => {
      cancelled = true;
      threeInitializedRef.current = false;
      if (animFrameRef.current != null) cancelAnimationFrame(animFrameRef.current);
      const onResize = resizeHandlerRef.current;
      if (onResize) window.removeEventListener("resize", onResize);
      resizeHandlerRef.current = null;
      const r = rendererRef.current;
      if (r) r.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      meshRef.current = null;
      geoRef.current = null;
    };
  }, [clientReady]);

  useEffect(() => {
    if (!clientReady || slots.length === 0) return;
    if (!sceneRef.current) return;
    buildPanelRef.current();
  }, [clientReady, dims.W, dims.H, dims.D, activeSlot, slots]);

  useEffect(() => {
    if (!clientReady || slots.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = cameraRef.current;
      if (cam) cam.position.multiplyScalar(1 + e.deltaY * 0.001);
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [clientReady, slots.length]);

  const onMouseDown = (e: React.MouseEvent) => {
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  };
  const onMouseUp = () => {
    drag.current.active = false;
  };
  const onMouseLeave = () => {
    drag.current.active = false;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const dr = drag.current;
    if (!dr.active) return;
    dr.rotY += (e.clientX - dr.lastX) * 0.008;
    dr.rotX += (e.clientY - dr.lastY) * 0.008;
    dr.rotX = Math.max(-1.3, Math.min(1.3, dr.rotX));
    dr.lastX = e.clientX;
    dr.lastY = e.clientY;
  };
  const onTouchStart = (e: React.TouchEvent) => {
    drag.current.active = true;
    drag.current.lastX = e.touches[0].clientX;
    drag.current.lastY = e.touches[0].clientY;
  };
  const onTouchEnd = () => {
    drag.current.active = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const dr = drag.current;
    if (!dr.active) return;
    dr.rotY += (e.touches[0].clientX - dr.lastX) * 0.008;
    dr.rotX += (e.touches[0].clientY - dr.lastY) * 0.008;
    dr.rotX = Math.max(-1.3, Math.min(1.3, dr.rotX));
    dr.lastX = e.touches[0].clientX;
    dr.lastY = e.touches[0].clientY;
  };

  const area = ((dims.W / 100) * (dims.H / 100)).toFixed(2);

  if (!clientReady || texturesLoading) {
    return (
      <section className="w-full bg-[#faf7f2] px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[48px] sm:py-[64px] lg:py-[80px]">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 rounded-lg bg-gray-200/80 animate-pulse mb-6" />
          <div className="min-h-[280px] sm:min-h-[360px] rounded-3xl bg-gray-200/60 animate-pulse" />
        </div>
      </section>
    );
  }

  if (loadError || slots.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#faf7f2] px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[48px] sm:py-[64px] lg:py-[80px] text-[#1c1c1c]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-[26px] sm:text-[28px] lg:text-[32px] inter-font font-medium mb-2">
            Interactive 3D preview
          </h2>
          <p className="max-w-2xl text-[14px] sm:text-[15px] poppins-font text-gray-600 leading-relaxed">
            Pick a finish, adjust panel size, and explore the panel in 3D. Drag to rotate, scroll to zoom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col gap-8 order-2 lg:order-1">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-3">
                Material finish
              </p>
              <div className="flex flex-wrap gap-3">
                {slots.map((slot, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlot(i)}
                    title={slot.name}
                    className={`group relative flex flex-col items-center gap-2 rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c9a227] ${
                      i === activeSlot
                        ? "ring-2 ring-[#c9a227] ring-offset-2 ring-offset-[#faf7f2] scale-[1.02]"
                        : "ring-1 ring-gray-200/80 hover:ring-gray-300"
                    }`}
                  >
                    <span
                      className="block w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-xl bg-cover bg-center overflow-hidden shadow-sm"
                      style={{ backgroundImage: `url(${slot.thumb})` }}
                    />
                    <span
                      className={`text-[11px] font-medium max-w-[72px] truncate ${
                        i === activeSlot ? "text-[#8b6914]" : "text-gray-500"
                      }`}
                    >
                      {slot.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white/60 backdrop-blur-sm p-5 sm:p-6 space-y-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 m-0">
                Panel dimensions
              </p>
              {(
                [
                  { key: "W" as const, label: "Width", min: 40, max: 240 },
                  { key: "H" as const, label: "Height", min: 20, max: 160 },
                  { key: "D" as const, label: "Depth", min: 1, max: 20 },
                ] as const
              ).map(({ key, label, min, max }) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[13px] font-medium text-gray-700">{label}</span>
                    <span className="text-[15px] tabular-nums font-semibold text-[#1c1c1c]">
                      {dims[key]}
                      <span className="text-[11px] font-normal text-gray-500 ml-1">cm</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={dims[key]}
                    onChange={(e) =>
                      setDims((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                    }
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-[#c9a227]"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {(
                [
                  { label: "Width", value: `${dims.W} cm` },
                  { label: "Height", value: `${dims.H} cm` },
                  { label: "Depth", value: `${dims.D} cm` },
                  { label: "Surface area", value: `${area} m²` },
                ] as const
              ).map((row) => (
                <div
                  key={row.label}
                  className="rounded-2xl border border-gray-200/80 bg-white/50 px-4 py-3 text-center shadow-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1 m-0">
                    {row.label}
                  </p>
                  <p className="text-lg sm:text-xl font-semibold tabular-nums text-[#1c1c1c] m-0 inter-font">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden border border-gray-200/90 bg-linear-to-br from-[#12121a] via-[#0e0e14] to-[#0a0a0f] shadow-xl min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]">
              <canvas
                ref={canvasRef}
                className="block w-full h-[min(52vh,420px)] cursor-grab active:cursor-grabbing"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35 m-0">
                  Live preview
                </p>
                <p className="text-[11px] text-white/40 m-0">Drag to rotate · Scroll to zoom</p>
              </div>
              <div className="pointer-events-none absolute top-0 left-0 w-20 h-20 border-t border-l border-white/10 rounded-tl-3xl" />
              <div className="pointer-events-none absolute bottom-0 right-0 w-20 h-20 border-b border-r border-white/10 rounded-br-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
