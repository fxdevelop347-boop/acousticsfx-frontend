"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { VisualizerTexture, VisualizerDimensions } from "@/lib/products-api";


// ─── Build Three.js texture from image URL ────────────────────────────────────
function buildThreeTexture(src: string): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      resolve(tex);
    };
    img.src = src;
  });
}

interface Product3DViewerProps {
  visualizerTextures?: VisualizerTexture[];
  visualizerDimensions?: VisualizerDimensions;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Product3DViewer({ 
  visualizerTextures, 
  visualizerDimensions 
}: Product3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeRef  = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    mesh?: THREE.Mesh;
    geo?: THREE.BoxGeometry;
    animId?: number;
  }>({});

  const [isMounted, setIsMounted] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const textureCache = useRef<Record<string, THREE.Texture>>({});

  const [activeSlot, setActiveSlot] = useState(0);
  const [dims, setDims] = useState({
    w: visualizerDimensions?.width || 120,
    h: visualizerDimensions?.height || 60,
    d: visualizerDimensions?.depth || 4
  });

  // ── Initialise slots on client only ────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true);
    if (visualizerTextures && visualizerTextures.length > 0) {
      setSlots(visualizerTextures.map(vt => ({
        name: vt.name,
        thumb: vt.image,
        texSrc: vt.image
      })));
    } else {
      setSlots([]);
    }
  }, [visualizerTextures]);

  // ── Build / rebuild the panel mesh ─────────────────────────────────────────
  const buildPanel = useCallback(async (scene: THREE.Scene, w: number, h: number, d: number, slotList: any[], slotIdx: number) => {
    if (slotList.length === 0) return;
    
    const slot = slotList[slotIdx];
    if (!slot) return;

    const imgSrc = slot.texSrc || slot.thumb;
    let baseTex = textureCache.current[imgSrc];

    if (!baseTex) {
      baseTex = await buildThreeTexture(imgSrc);
      textureCache.current[imgSrc] = baseTex;
    }

    const { mesh: oldMesh, geo: oldGeo } = threeRef.current;
    
    const newGeo = new THREE.BoxGeometry(w / 100, h / 100, d / 100);
    
    function cloneFor(repeatX: number, repeatY: number) {
      const t = baseTex.clone();
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeatX, repeatY);
      t.needsUpdate = true;
      return t;
    }

    const mats = [
      new THREE.MeshStandardMaterial({ map: cloneFor(Math.max(0.05, d / h), 1), roughness: 0.75, metalness: 0.02 }),
      new THREE.MeshStandardMaterial({ map: cloneFor(Math.max(0.05, d / h), 1), roughness: 0.75, metalness: 0.02 }),
      new THREE.MeshStandardMaterial({ map: cloneFor(1, Math.max(0.05, d / w)), roughness: 0.75, metalness: 0.02 }),
      new THREE.MeshStandardMaterial({ map: cloneFor(1, Math.max(0.05, d / w)), roughness: 0.75, metalness: 0.02 }),
      new THREE.MeshStandardMaterial({ map: cloneFor(1, 1), roughness: 0.7, metalness: 0.02 }),
      new THREE.MeshStandardMaterial({ map: cloneFor(1, 1), roughness: 0.7, metalness: 0.02 }),
    ];

    const newMesh = new THREE.Mesh(newGeo, mats);
    const edges   = new THREE.EdgesGeometry(newGeo, 15);
    newMesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })));

    // restore rotation
    if (oldMesh) { 
      newMesh.rotation.copy(oldMesh.rotation);
      scene.remove(oldMesh);
    }
    
    if (oldGeo) oldGeo.dispose();
    if (oldMesh) {
      if (Array.isArray(oldMesh.material)) {
        oldMesh.material.forEach(m => m.dispose());
      } else {
        oldMesh.material.dispose();
      }
    }

    threeRef.current.geo = newGeo;
    threeRef.current.mesh = newMesh;
    scene.add(newMesh);
  }, []);

  // ── Three.js initialisation ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas   = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 2, 2));

    const scene  = new THREE.Scene();
    // scene.background = new THREE.Color(0x1a1a2e); // Make it transparent to fit parent BG

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    camera.position.set(1.8, 1.1, 2.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dl  = new THREE.DirectionalLight(0xffffff, 1.2); dl.position.set(3, 5, 4); scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0xffeedd, 0.5); dl2.position.set(-3, -2, -2); scene.add(dl2);

    threeRef.current = { renderer, scene, camera, mesh: threeRef.current.mesh, geo: threeRef.current.geo };

    function resize() {
      if (!canvas || !renderer || !camera) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // Interaction state
    let drag = false, lastX = 0, lastY = 0, rotX = 0.3, rotY = 0.6;
    
    const onMouseDown = (e: MouseEvent) => { drag = true; lastX = e.clientX; lastY = e.clientY; };
    const onMouseUp = () => { drag = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!drag) return;
      rotY += (e.clientX - lastX) * 0.008;
      rotX += (e.clientY - lastY) * 0.008;
      rotX = Math.max(-1.3, Math.min(1.3, rotX));
      lastX = e.clientX; lastY = e.clientY;
    };

    const onTouchStart = (e: TouchEvent) => { drag = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; };
    const onTouchEnd = () => { drag = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (!drag) return;
      rotY += (e.touches[0].clientX - lastX) * 0.008;
      rotX += (e.touches[0].clientY - lastY) * 0.008;
      rotX = Math.max(-1.3, Math.min(1.3, rotX));
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    };

    const onWheel = (e: WheelEvent) => {
      if (camera) {
        camera.position.multiplyScalar(1 + e.deltaY * 0.001);
        e.preventDefault();
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // Animation loop
    function animate() {
      threeRef.current.animId = requestAnimationFrame(animate);
      if (!drag) rotY += 0.003;
      const m = threeRef.current.mesh;
      if (m) { m.rotation.x = rotX; m.rotation.y = rotY; }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      if (threeRef.current.animId) cancelAnimationFrame(threeRef.current.animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("wheel", onWheel);
      renderer.dispose();
    };
  }, []);

  // ── Re-build when slot / dims change ───────────────────────────────────────
  useEffect(() => {
    const { scene } = threeRef.current;
    if (!scene) return;
    buildPanel(scene, dims.w, dims.h, dims.d, slots, activeSlot);
  }, [activeSlot, dims, slots, buildPanel]);

  const area = ((dims.w * dims.h) / 10000).toFixed(2);

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (!isMounted) {
    return (
      <section className="w-full bg-[#111] px-6 py-16 sm:py-20 lg:py-24 min-h-[600px] flex items-center justify-center">
        <div className="text-white/20 axiforma font-bold text-2xl animate-pulse">Loading Visualizer...</div>
      </section>
    );
  }

  // If there are no slots defined by the backend, do not render the 3D Viewer
  if (slots.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#111] px-6 py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: UI Controls */}
          <div className="lg:col-span-5 flex flex-col gap-8 order-2 lg:order-1">
            
            {/* Header */}
            <div>
              <h2 className="text-3xl sm:text-4xl axiforma font-bold text-white mb-4">3D Panel Visualizer</h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Configure your acoustic panel dimensions and apply custom textures to preview how it looks in a 3D environment.
              </p>
            </div>

            {/* Texture Slots */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Material Finish</p>
              <div className="flex flex-wrap gap-4">
                {slots.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => setActiveSlot(i)}
                      className={`group relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        i === activeSlot ? "border-orange-500 scale-110 shadow-lg shadow-orange-500/20" : "border-white/10 hover:border-white/30"
                      }`}
                      title={s.name}
                    >
                      <div 
                        className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-110"
                        style={{ backgroundImage: `url(${s.thumb})` }}
                      />
                      {i === activeSlot && (
                        <div className="absolute inset-0 bg-orange-500/10 pointer-events-none" />
                      )}
                    </button>
                    <span className={`text-[10px] font-medium truncate max-w-[64px] ${i === activeSlot ? "text-orange-500" : "text-gray-500"}`}>
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dimension Sliders */}
            <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
              {[
                { key: "w" as const, label: "Width",  min: 40,  max: 240, unit: "cm" },
                { key: "h" as const, label: "Height", min: 20,  max: 160, unit: "cm" },
                { key: "d" as const, label: "Depth",  min: 1,   max: 20,  unit: "cm" },
              ].map(({ key, label, min, max, unit }) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
                    <span className="text-lg font-mono text-white leading-none">
                      {dims[key]} <small className="text-[10px] text-gray-400 align-top uppercase">{unit}</small>
                    </span>
                  </div>
                  <input
                    type="range" min={min} max={max} step={1} value={dims[key]}
                    onChange={(e) => setDims((prev) => ({ ...prev, [key]: parseInt(e.target.value) }))}
                    className="w-full accent-orange-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Surface Area</p>
                <p className="text-2xl font-mono text-white">{area} <span className="text-xs text-gray-500">m²</span></p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Volume</p>
                <p className="text-2xl font-mono text-white">{((dims.w * dims.h * dims.d) / 1000).toFixed(1)} <span className="text-xs text-gray-500">L</span></p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Canvas */}
          <div className="lg:col-span-7 order-1 lg:order-2">
             <div className="relative aspect-square sm:aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] shadow-2xl">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      Live Preview engine
                   </div>
                   <p className="text-[10px] text-white/30 uppercase tracking-widest">
                      Drag to rotate • Scroll to zoom
                   </p>
                </div>

                {/* Aesthetic corner accents */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-white/20 rounded-tl-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-white/20 rounded-br-3xl pointer-events-none" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
