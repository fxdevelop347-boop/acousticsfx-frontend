"use client";

/**
 * 3D acoustic panel preview.
 *
 * Temporary GLB preview mode: the backend texture wrapping path is left in this
 * file but bypassed while we render the local pannel.glb model.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type {
  VisualizerTexture,
  VisualizerDimensions,
  VisualizerHoleProfile,
} from "@/lib/products-api";
import { getVisualizerTextureLoadUrl } from "@/lib/texture-proxy-url";

export { hasVisualizerTextures } from "@/lib/products-api";

const RES = 1024;
const PANEL_GLB_URL = "/assets/3d/pannel.glb";
const DRACO_DECODER_PATH = "/assets/3d/draco/";
const USE_BACKEND_TEXTURE_VISUALIZER = false;

function generateNormalMap(holeMm: number, spacingMm: number) {
  const canvas = document.createElement("canvas");
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgb(128, 128, 255)";
  ctx.fillRect(0, 0, RES, RES);

  const scale = RES / 300;
  const r = (holeMm / 2) * scale;
  const sp = spacingMm * scale;

  const imgData = ctx.getImageData(0, 0, RES, RES);
  const data = imgData.data;

  for (let cx = sp / 2; cx < RES; cx += sp) {
    for (let cy = sp / 2; cy < RES; cy += sp) {
      const outerR = r * 1.15;
      const minX = Math.max(0, Math.floor(cx - outerR));
      const maxX = Math.min(RES - 1, Math.ceil(cx + outerR));
      const minY = Math.max(0, Math.floor(cy - outerR));
      const maxY = Math.min(RES - 1, Math.ceil(cy + outerR));

      for (let py = minY; py <= maxY; py++) {
        for (let px = minX; px <= maxX; px++) {
          const dx = px - cx;
          const dy = py - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < r) {
            const idx = (py * RES + px) * 4;
            const edgeFactor = dist / r;
            const nx = (dx / r) * edgeFactor * 0.7;
            const ny = (dy / r) * edgeFactor * 0.7;
            const nz = 0.3 + (1 - edgeFactor) * 0.2;
            data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
            data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
            data[idx + 2] = Math.round(nz * 255);
          } else if (dist < outerR) {
            const t = (dist - r) / (outerR - r);
            const rimNx = (dx / dist) * (1 - t) * 0.5;
            const rimNy = (dy / dist) * (1 - t) * 0.5;
            const rimNz = 0.7 + t * 0.3;
            const idx = (py * RES + px) * 4;
            data[idx] = Math.round((rimNx * 0.5 + 0.5) * 255);
            data[idx + 1] = Math.round((rimNy * 0.5 + 0.5) * 255);
            data[idx + 2] = Math.round(rimNz * 255);
          }
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

function compositeHolesOnTexture(
  img: HTMLImageElement | HTMLCanvasElement,
  holeMm: number,
  spacingMm: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, RES, RES);

  const scale = RES / 300;
  const r = (holeMm / 2) * scale;
  const sp = spacingMm * scale;

  const lightAngle = -Math.PI * 0.7;
  const lx = Math.cos(lightAngle);
  const ly = Math.sin(lightAngle);

  for (let cx = sp / 2; cx < RES; cx += sp) {
    for (let cy = sp / 2; cy < RES; cy += sp) {
      const shOff = r * 0.35;
      const shX = cx - lx * shOff;
      const shY = cy - ly * shOff;
      const shG = ctx.createRadialGradient(shX, shY, r * 0.5, shX, shY, r * 1.6);
      shG.addColorStop(0, "rgba(0,0,0,0.35)");
      shG.addColorStop(0.6, "rgba(0,0,0,0.1)");
      shG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shG;
      ctx.beginPath();
      ctx.arc(shX, shY, r * 1.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
      ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2, true);
      ctx.clip();
      const chamG = ctx.createRadialGradient(
        cx + lx * r * 0.3,
        cy + ly * r * 0.3,
        0,
        cx,
        cy,
        r * 1.2,
      );
      // Keep perforation edge shading neutral so uploaded textures don't get a brown cast.
      chamG.addColorStop(0, "rgba(70,70,70,0.08)");
      chamG.addColorStop(0.5, "rgba(25,25,25,0.55)");
      chamG.addColorStop(1, "rgba(10,10,10,0.75)");
      ctx.fillStyle = chamG;
      ctx.fillRect(cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = "rgb(10,10,10)";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      const wallLitX = cx - lx * r * 0.4;
      const wallLitY = cy - ly * r * 0.4;
      const wallG = ctx.createRadialGradient(wallLitX, wallLitY, 0, wallLitX, wallLitY, r * 0.9);
      wallG.addColorStop(0, "rgba(90,90,90,0.35)");
      wallG.addColorStop(0.5, "rgba(45,45,45,0.18)");
      wallG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = wallG;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      const depG = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      depG.addColorStop(0, "rgba(0,0,0,0.5)");
      depG.addColorStop(0.7, "rgba(0,0,0,0.15)");
      depG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = depG;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
      ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2, true);
      ctx.clip();

      const hlX = cx + lx * r * 0.5;
      const hlY = cy + ly * r * 0.5;
      const hlG = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, r * 0.9);
      hlG.addColorStop(0, "rgba(255,255,255,0.48)");
      hlG.addColorStop(0.3, "rgba(255,255,255,0.16)");
      hlG.addColorStop(0.7, "rgba(255,255,255,0)");
      hlG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hlG;
      ctx.fillRect(cx - r * 1.5, cy - r * 1.5, r * 3, r * 3);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.arc(cx, cy, r * 0.93, 0, Math.PI * 2, true);
      ctx.clip();
      ctx.fillStyle = "rgba(5,5,5,0.68)";
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    }
  }
  return canvas;
}

// Keep the legacy backend texture helpers referenced while GLB preview mode is active.
void generateNormalMap;
void compositeHolesOnTexture;

/** Procedural profile preview so each profile looks unique by hole/spacing. */
function buildProfilePreviewDataUrl(profile: VisualizerHoleProfile): string {
  if (typeof document === "undefined") return "";
  const size = 72;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(0, 0, size, size);

  const hole = Math.max(0.5, profile.hole);
  const spacing = Math.max(2, profile.spacing);
  const ratio = hole / spacing;
  const radius = Math.max(1.2, Math.min(8.5, ratio * 20));
  const step = Math.max(radius * 2 + 2, Math.min(22, spacing * 0.9));

  ctx.fillStyle = "#9c9c9c";
  for (let x = step / 2; x < size; x += step) {
    for (let y = step / 2; y < size; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return canvas.toDataURL("image/png");
}

function PanelViewer({
  dimensionsCm,
  controlsRef,
}: {
  dimensionsCm: { width: number; height: number; depth: number };
  controlsRef: MutableRefObject<InstanceType<typeof OrbitControls> | null>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const gltfLoaderRef = useRef(new GLTFLoader());
  const dracoLoaderRef = useRef<DRACOLoader | null>(null);
  const animFrameRef = useRef<number>(0);

  const disposeModel = useCallback((object: THREE.Object3D | null) => {
    if (!object) return;
    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      const material = mesh.material;
      const materials = Array.isArray(material) ? material : material ? [material] : [];
      materials.forEach((mat) => {
        Object.values(mat).forEach((value) => {
          if (value instanceof THREE.Texture) {
            value.dispose();
          }
        });
        mat.dispose();
      });
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3d3d3d);
    sceneRef.current = scene;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    dracoLoader.setDecoderConfig({ type: "wasm" });
    gltfLoaderRef.current.setDRACOLoader(dracoLoader);
    dracoLoaderRef.current = dracoLoader;

    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(1.6, 1.2, 1.6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x2b2b2b, 1));
    scene.add(new THREE.AmbientLight(0xfff5e8, 0.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(-4, 8, 4);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xc8d4e8, 0.4);
    fillLight.position.set(5, 3, -2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffe0c0, 0.3);
    rimLight.position.set(0, -1, 5);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      controls.dispose();
      controlsRef.current = null;
      disposeModel(modelRef.current);
      dracoLoaderRef.current?.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      modelRef.current = null;
      dracoLoaderRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, [controlsRef, disposeModel]);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !renderer || !controls) return;

    let cancelled = false;

    if (modelRef.current) {
      scene.remove(modelRef.current);
      disposeModel(modelRef.current);
      modelRef.current = null;
    }

    gltfLoaderRef.current.load(
      PANEL_GLB_URL,
      (gltf) => {
        if (cancelled) {
          disposeModel(gltf.scene);
          return;
        }

        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material) => {
              material.side = THREE.DoubleSide;
              material.needsUpdate = true;
            });
          }
        });

        const sourceBox = new THREE.Box3().setFromObject(model);
        const sourceCenter = sourceBox.getCenter(new THREE.Vector3());
        const sourceSize = sourceBox.getSize(new THREE.Vector3());
        const sourceMax = Math.max(sourceSize.x, sourceSize.y, sourceSize.z, 0.01);
        const targetMax = Math.max(
          dimensionsCm.width / 100,
          dimensionsCm.height / 100,
          dimensionsCm.depth / 100,
          1,
        );

        model.position.sub(sourceCenter);

        const wrapper = new THREE.Group();
        wrapper.add(model);
        wrapper.scale.setScalar(targetMax / sourceMax);
        wrapper.rotation.set(-Math.PI / 18, -Math.PI / 8, 0);
        scene.add(wrapper);
        modelRef.current = wrapper;

        const fittedBox = new THREE.Box3().setFromObject(wrapper);
        const fittedSize = fittedBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(fittedSize.x, fittedSize.y, fittedSize.z, 0.01);
        const distance = (maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2))) * 1.55;
        camera.position.set(distance * 0.55, distance * 0.35, distance * 1.35);
        camera.near = Math.max(0.01, maxDim / 100);
        camera.far = Math.max(100, maxDim * 100);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();

        controls.target.set(0, 0, 0);
        controls.minDistance = Math.max(0.15, maxDim * 0.45);
        controls.maxDistance = Math.max(controls.minDistance + 1, maxDim * 8);
        controls.update();
      },
      undefined,
      (error) => {
        console.error("Unable to load pannel.glb", error);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [controlsRef, dimensionsCm.width, dimensionsCm.height, dimensionsCm.depth, disposeModel]);

  return (
    <div
      ref={mountRef}
      className="aspect-[643/552] w-full max-h-[480px] cursor-grab overflow-hidden rounded-lg bg-[#3d3d3d] active:cursor-grabbing"
    />
  );
}

function HoleProfileItem({
  profile,
  selected,
  onClick,
  textureThumb,
}: {
  profile: VisualizerHoleProfile;
  selected: boolean;
  onClick: () => void;
  textureThumb?: string;
}) {
  const holeFrac = Math.min(12, Math.max(0.5, profile.hole)) / 12;
  const dotR = 3 + holeFrac * 8;
  const spaceFrac = Math.min(48, Math.max(4, profile.spacing)) / 32;
  const gap = 12 + spaceFrac * 10;
  const [generatedThumb, setGeneratedThumb] = useState<string>("");

  useEffect(() => {
    setGeneratedThumb(buildProfilePreviewDataUrl(profile));
  }, [profile]);

  const thumb =
    (profile.thumbnail?.trim() ? getVisualizerTextureLoadUrl(profile.thumbnail.trim()) : "") ||
    generatedThumb ||
    textureThumb;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-0"
    >
      <div
        className={`relative flex size-[60px] items-center justify-center rounded-sm border-2 border-solid bg-[#282828] transition-colors sm:size-[72px] ${selected ? "border-[#ee641c]" : "border-[#3e3e3e]"}`}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="size-full rounded-sm object-cover" />
        ) : (
          <svg width="48" height="48" viewBox="0 0 48 48">
            {Array.from({ length: Math.ceil(48 / gap) }).map((_, ix) =>
              Array.from({ length: Math.ceil(48 / gap) }).map((_, iy) => {
                const cx = gap / 2 + ix * gap;
                const cy = gap / 2 + iy * gap;
                return cx < 48 && cy < 48 ? (
                  <circle
                    key={`${ix}-${iy}`}
                    cx={cx}
                    cy={cy}
                    r={dotR}
                    fill={selected ? "#ee641c" : "#979290"}
                    opacity="0.8"
                  />
                ) : null;
              }),
            )}
          </svg>
        )}
      </div>
      <span
        className={`max-w-[92px] truncate font-['Axiforma:Regular',sans-serif] text-[13px] transition-colors sm:text-[15px] ${selected ? "text-[#ee641c]" : "text-white"}`}
      >
        {profile.name}
      </span>
    </button>
  );
}

function HoleProfileSelector({
  profiles,
  selectedIndex,
  onSelect,
  textureThumb,
}: {
  profiles: VisualizerHoleProfile[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  textureThumb?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="m-0 font-['Axiforma:Regular',sans-serif] text-[18px] leading-normal text-white sm:text-[20px]">
        Available Profiles
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#484848] bg-transparent transition-colors hover:border-[#ee641c] sm:size-12"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 5L7 10L12 15"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex flex-1 gap-3 overflow-x-auto py-1 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {profiles.map((p, i) => (
            <HoleProfileItem
              key={`${p.name}-${i}`}
              profile={p}
              selected={selectedIndex === i}
              onClick={() => onSelect(i)}
              textureThumb={textureThumb}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#484848] bg-transparent transition-colors hover:border-[#ee641c] sm:size-12"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M8 5L13 10L8 15"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function MaterialSelector({
  textures,
  selectedIndex,
  onSelect,
}: {
  textures: VisualizerTexture[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="m-0 font-['Axiforma:Regular',sans-serif] text-[18px] leading-normal text-white sm:text-[20px]">
          Front
        </p>
        <span className="font-['Axiforma:Regular',sans-serif] text-[14px] text-[#b4aba8]">
          Material
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {textures.map((m, i) => {
          const url = m.image?.trim() ? getVisualizerTextureLoadUrl(m.image.trim()) : "";
          const on = selectedIndex === i;
          return (
            <button
              key={`${m.name}-${i}`}
              type="button"
              onClick={() => onSelect(i)}
              className="relative size-[48px] shrink-0 cursor-pointer overflow-hidden rounded-full border-0 bg-transparent p-0 sm:size-[56px]"
            >
              <div
                className={`absolute inset-0 z-10 rounded-full border-[2.5px] border-solid transition-colors ${on ? "border-[#ee641c]" : "border-transparent"}`}
              />
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={m.name} className="size-full rounded-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center rounded-full bg-zinc-700 text-[10px] text-white/70">
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="m-0 font-['Axiforma:Regular',sans-serif] text-[12px] text-[#b4aba8]">
        {textures[selectedIndex]?.name ?? ""}
      </p>
    </div>
  );
}

function ZoomButtons({
  handleZoomIn,
  handleZoomOut,
}: {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleZoomOut}
        className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-[#ea8e39] bg-transparent transition-all hover:bg-[#ea8e39]/15 active:scale-95 sm:size-12"
      >
        <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
          <path d="M15 1H1" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={handleZoomIn}
        className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-[#ea8e39] bg-transparent transition-all hover:bg-[#ea8e39]/15 active:scale-95 sm:size-12"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M15 8H1M8 1v14" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export interface Product3DViewerProps {
  visualizerTextures: VisualizerTexture[];
  visualizerDimensions?: VisualizerDimensions;
  sectionTitle?: string;
  sectionDescription?: string;
  technicalCaption?: string;
}

function normalizeTextures(raw: VisualizerTexture[]): VisualizerTexture[] {
  return raw.filter(
    (t) =>
      t.image?.trim() &&
      Array.isArray(t.profiles) &&
      t.profiles.some((p) => p.name?.trim() && p.hole > 0 && p.spacing > 0),
  ).map((t) => ({
    ...t,
    profiles: t.profiles.filter((p) => p.name?.trim() && p.hole > 0 && p.spacing > 0),
  })).filter((t) => t.profiles.length > 0);
}

export default function Product3DViewer({
  visualizerTextures,
  visualizerDimensions,
  sectionTitle = "Product Profiles",
  sectionDescription = "Explore the panel in 3D.",
  technicalCaption,
}: Product3DViewerProps) {
  const textures = useMemo(() => normalizeTextures(visualizerTextures ?? []), [visualizerTextures]);
  const [textureIdx, setTextureIdx] = useState(0);
  const [holeIdx, setHoleIdx] = useState(0);
  const controlsRef = useRef<InstanceType<typeof OrbitControls> | null>(null);

  const dims = useMemo(
    () => ({
      width: visualizerDimensions?.width ?? 120,
      height: visualizerDimensions?.height ?? 60,
      depth: visualizerDimensions?.depth ?? 4,
    }),
    [visualizerDimensions],
  );

  const sizeLabel = `${dims.width} × ${dims.height} cm`;

  const ti = Math.min(textureIdx, Math.max(0, textures.length - 1));
  const current = textures[ti];
  const profiles = current?.profiles ?? [];
  const hi = Math.min(holeIdx, Math.max(0, profiles.length - 1));
  const hole = profiles[hi] ?? profiles[0];
  const holeMm = hole?.hole > 0 ? hole.hole : 8;
  const spacingMm = hole?.spacing > 0 ? hole.spacing : 16;

  const imageLoadUrl = current?.image?.trim()
    ? getVisualizerTextureLoadUrl(current.image.trim())
    : "";
  const textureThumb = imageLoadUrl || undefined;

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object as THREE.PerspectiveCamera;
      const dir = new THREE.Vector3();
      cam.getWorldDirection(dir);
      cam.position.add(dir.multiplyScalar(0.8));
      controlsRef.current.update();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object as THREE.PerspectiveCamera;
      const dir = new THREE.Vector3();
      cam.getWorldDirection(dir);
      cam.position.sub(dir.multiplyScalar(0.8));
      controlsRef.current.update();
    }
  }, []);

  const tech = technicalCaption?.trim() || "Drag to rotate · scroll or +/- to zoom";
  const showBackendControls = USE_BACKEND_TEXTURE_VISUALIZER && textures.length > 0 && current;

  return (
    <div className="flex min-h-0 w-full flex-col bg-[#3d3d3d] font-sans antialiased">
      <div className="px-4 pb-2 pt-4 sm:px-8 sm:pt-6 lg:px-16">
        <h2 className="m-0 font-['Axiforma:Medium',sans-serif] text-[22px] leading-normal tracking-[-0.5px] text-white sm:text-[28px]">
          {sectionTitle}
        </h2>
        <p className="m-0 mt-2 max-w-[600px] font-['Poppins:Regular',sans-serif] text-[13px] leading-normal text-white/80 sm:text-[15px]">
          {sectionDescription}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 sm:gap-4 sm:px-8 sm:pb-6 lg:flex-row lg:items-center lg:px-16">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-2 text-white">
            <svg
              width="22"
              height="26"
              viewBox="0 0 22.7651 26.624"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M17.1698 6.55833H7.52345C6.9907 6.55833 6.55881 6.99021 6.55881 7.52296V24.8863C6.55881 25.419 6.9907 25.851 7.52345 25.851H21.0283C21.561 25.851 21.9929 25.419 21.9929 24.8863V11.3815L17.1698 6.55833Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path d="M0.77 6.56H2.7" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
              <path d="M0.77 25.85H2.7" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
              <path d="M1.74 6.56V25.85" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
              <path d="M6.56 2.7V0.77" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
              <path d="M21.99 2.7V0.77" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
              <path d="M6.56 1.74H21.99" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
            <span className="font-['Arial:Narrow',sans-serif] text-[14px] sm:text-[15px]">
              {sizeLabel}
            </span>
          </div>

          <PanelViewer
            dimensionsCm={dims}
            controlsRef={controlsRef}
          />

          <div className="flex items-center justify-between gap-3">
            <ZoomButtons handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
            {showBackendControls ? (
              <div className="flex flex-col text-right">
                <span className="font-['Neue_Haas_Grotesk_Text_Pro:Regular',sans-serif] text-[12px] text-white sm:text-[13px]">
                  SQUARE CENTRES - {spacingMm}MM
                </span>
                <span className="font-['Neue_Haas_Grotesk_Text_Pro:Regular',sans-serif] text-[12px] text-white sm:text-[13px]">
                  HOLE DIAMETER - {holeMm}mm
                </span>
              </div>
            ) : (
              <span className="font-['Neue_Haas_Grotesk_Text_Pro:Regular',sans-serif] text-[12px] text-white sm:text-[13px]">
                3D PANEL MODEL
              </span>
            )}
          </div>
          <p className="m-0 text-right text-[11px] text-white/55 sm:text-[12px]">{tech}</p>
        </div>

        {showBackendControls ? (
          <div className="w-full shrink-0 lg:w-[380px] xl:w-[420px]">
            <div
              className="flex max-h-[calc(100vh-120px)] flex-col gap-5 overflow-y-auto rounded-xl bg-[#1c1c1c] p-5 sm:p-7"
              style={{ scrollbarWidth: "thin" }}
            >
              <MaterialSelector
                textures={textures}
                selectedIndex={ti}
                onSelect={(index) => {
                  setTextureIdx(index);
                  setHoleIdx(0);
                }}
              />
              <HoleProfileSelector
                profiles={profiles}
                selectedIndex={hi}
                onSelect={setHoleIdx}
                textureThumb={textureThumb}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
