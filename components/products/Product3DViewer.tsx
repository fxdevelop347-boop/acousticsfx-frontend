"use client";

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
import type { VisualizerItem, VisualizerItemProfile } from "@/lib/products-api";
import { getVisualizerModelLoadUrl } from "@/lib/model-proxy-url";

export { hasVisualizerItems } from "@/lib/products-api";

const PANEL_GLB_URL = "/assets/3d/pannel.glb";
const DRACO_DECODER_PATH = "/assets/3d/draco/";

function PanelViewer({
  glbUrl,
  controlsRef,
}: {
  glbUrl: string;
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
      if (mesh.geometry) mesh.geometry.dispose();
      const material = mesh.material;
      const materials = Array.isArray(material) ? material : material ? [material] : [];
      materials.forEach((mat) => {
        Object.values(mat).forEach((value) => {
          if (value instanceof THREE.Texture) value.dispose();
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
      glbUrl,
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
        model.position.sub(sourceCenter);

        const wrapper = new THREE.Group();
        wrapper.add(model);
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
        console.error("Unable to load 3D model", glbUrl, error);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [controlsRef, disposeModel, glbUrl]);

  return (
    <div
      ref={mountRef}
      className="aspect-[643/552] w-full max-h-[480px] cursor-grab overflow-hidden rounded-lg bg-[#3d3d3d] active:cursor-grabbing"
    />
  );
}

function ProfileImageView({ imageUrl, name }: { imageUrl: string; name: string }) {
  return (
    <div className="flex aspect-[643/552] w-full max-h-[480px] items-center justify-center overflow-hidden rounded-lg bg-[#3d3d3d] p-4 sm:p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={name}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}

function ProfilePicker({
  profiles,
  activeProfileIndex,
  onSelect,
}: {
  profiles: VisualizerItemProfile[];
  /** Index of profile currently shown in the main panel; hidden from this list. */
  activeProfileIndex: number | null;
  onSelect: (index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  const visible = profiles
    .map((profile, originalIndex) => ({ profile, originalIndex }))
    .filter(({ originalIndex }) => activeProfileIndex === null || originalIndex !== activeProfileIndex);

  if (visible.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-3 border-t border-[#484848] pt-4">
      <p className="m-0 font-['Axiforma:Regular',sans-serif] text-[16px] leading-normal text-white sm:text-[18px]">
        Profiles
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#484848] bg-transparent transition-colors hover:border-[#ee641c]"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M12 5L7 10L12 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex flex-1 gap-3 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visible.map(({ profile, originalIndex }) => (
            <button
              key={`${profile.name}-${originalIndex}`}
              type="button"
              onClick={() => onSelect(originalIndex)}
              className="flex shrink-0 cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-0"
            >
              <div className="relative size-[52px] overflow-hidden rounded-sm border-2 border-solid border-[#3e3e3e] bg-[#282828] transition-colors hover:border-[#ee641c] sm:size-[60px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.image} alt="" className="size-full object-cover" />
              </div>
              <span className="max-w-[80px] truncate font-['Axiforma:Regular',sans-serif] text-[12px] text-white sm:text-[13px]">
                {profile.name}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#484848] bg-transparent transition-colors hover:border-[#ee641c]"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M8 5L13 10L8 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ItemPicker({
  items,
  selectedIndex,
  onSelect,
}: {
  items: VisualizerItem[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="m-0 font-['Axiforma:Regular',sans-serif] text-[18px] leading-normal text-white sm:text-[20px]">
        Finishes & Shades
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#484848] bg-transparent transition-colors hover:border-[#ee641c] sm:size-12"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 5L7 10L12 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex flex-1 gap-3 overflow-x-auto py-1 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => {
            const selected = selectedIndex === i;
            return (
              <button
                key={`${item.name}-${i}`}
                type="button"
                onClick={() => onSelect(i)}
                className="flex shrink-0 cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-0"
              >
                <div
                  className={`relative size-[60px] overflow-hidden rounded-sm border-2 border-solid bg-[#282828] transition-colors sm:size-[72px] ${selected ? "border-[#ee641c]" : "border-[#3e3e3e]"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumbnail} alt="" className="size-full object-cover" />
                </div>
                <span
                  className={`max-w-[92px] truncate font-['Axiforma:Regular',sans-serif] text-[13px] transition-colors sm:text-[15px] ${selected ? "text-[#ee641c]" : "text-white"}`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#484848] bg-transparent transition-colors hover:border-[#ee641c] sm:size-12"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 5L13 10L8 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {items[selectedIndex]?.description ? (
        <p className="m-0 font-['Axiforma:Regular',sans-serif] text-[13px] leading-snug text-[#b4aba8] sm:text-[14px]">
          {items[selectedIndex].description}
        </p>
      ) : null}
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
  visualizerItems: VisualizerItem[];
  sectionTitle?: string;
  sectionDescription?: string;
}

function normalizeItems(raw: VisualizerItem[]): VisualizerItem[] {
  return raw
    .filter((i) => i.name?.trim() && i.thumbnail?.trim() && i.glb?.trim())
    .map((i) => ({
      ...i,
      profiles: (i.profiles ?? []).filter((p) => p.name?.trim() && p.image?.trim()),
    }));
}

export default function Product3DViewer({
  visualizerItems,
  sectionTitle = "Product Profiles",
  sectionDescription = "Explore finishes in 3D.",
}: Product3DViewerProps) {
  const items = useMemo(() => normalizeItems(visualizerItems ?? []), [visualizerItems]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  /** null = 3D view (finish selected); number = profile 2D image in main panel */
  const [profileIndex, setProfileIndex] = useState<number | null>(null);
  const controlsRef = useRef<InstanceType<typeof OrbitControls> | null>(null);

  const idx = Math.min(selectedIndex, Math.max(0, items.length - 1));
  const current = items[idx];
  const profiles = current?.profiles ?? [];
  const activeProfile =
    profileIndex !== null && profiles[profileIndex] ? profiles[profileIndex] : null;
  const showProfileView = activeProfile !== null;

  const handleSelectItem = useCallback((i: number) => {
    setSelectedIndex(i);
    setProfileIndex(null);
  }, []);

  const handleSelectProfile = useCallback((i: number) => {
    setProfileIndex(i);
  }, []);

  const activeGlbUrl = useMemo(() => {
    const raw = current?.glb?.trim();
    if (raw) return getVisualizerModelLoadUrl(raw);
    return PANEL_GLB_URL;
  }, [current?.glb]);

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

  if (items.length === 0) return null;

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
          {showProfileView && activeProfile ? (
            <ProfileImageView imageUrl={activeProfile.image} name={activeProfile.name} />
          ) : (
            <PanelViewer glbUrl={activeGlbUrl} controlsRef={controlsRef} />
          )}

          <div className="flex items-center justify-between gap-3">
            {showProfileView ? (
              <span className="text-[11px] text-white/55 sm:text-[12px]">Profile preview</span>
            ) : (
              <ZoomButtons handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
            )}
            <span className="font-['Neue_Haas_Grotesk_Text_Pro:Regular',sans-serif] text-[12px] text-white sm:text-[13px]">
              {activeProfile?.name ?? current?.name ?? "3D MODEL"}
            </span>
          </div>
          {!showProfileView ? (
            <p className="m-0 text-right text-[11px] text-white/55 sm:text-[12px]">
              Drag to rotate · scroll or +/- to zoom
            </p>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="w-full shrink-0 lg:w-[380px] xl:w-[420px]">
            <div
              className="flex max-h-[calc(100vh-120px)] flex-col gap-5 overflow-y-auto rounded-xl bg-[#1c1c1c] p-5 sm:p-7"
              style={{ scrollbarWidth: "thin" }}
            >
              <ItemPicker items={items} selectedIndex={idx} onSelect={handleSelectItem} />
              {profiles.length > 0 ? (
                <ProfilePicker
                  profiles={profiles}
                  activeProfileIndex={profileIndex}
                  onSelect={handleSelectProfile}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
