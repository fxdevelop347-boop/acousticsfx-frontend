"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { SubProductProfile, SubProductProfilesSection } from "@/lib/products-api";

const TATTOO_CANVAS_SIZE = 256;

/** 1×1 PNG — placeholder so `useTexture` never receives empty URLs during SSR. */
const PLACEHOLDER_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

/** Procedural “tattoo” artwork (exported as PNG data URLs for thumbnails; same art on CanvasTexture for the mesh). */
const TATTOO_DRAWERS: Array<(ctx: CanvasRenderingContext2D, size: number) => void> = [
  (ctx, s) => {
    const cx = s * 0.5;
    const cy = s * 0.45;
    ctx.strokeStyle = "rgba(40, 30, 20, 0.92)";
    ctx.lineWidth = s * 0.035;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.22, Math.PI * 0.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.18, cy + s * 0.12);
    ctx.quadraticCurveTo(cx, cy + s * 0.32, cx + s * 0.2, cy + s * 0.1);
    ctx.stroke();
    ctx.fillStyle = "rgba(180, 120, 60, 0.35)";
    ctx.beginPath();
    ctx.arc(cx - s * 0.08, cy - s * 0.05, s * 0.04, 0, Math.PI * 2);
    ctx.arc(cx + s * 0.1, cy - s * 0.02, s * 0.035, 0, Math.PI * 2);
    ctx.fill();
  },
  (ctx, s) => {
    ctx.strokeStyle = "rgba(25, 45, 55, 0.9)";
    ctx.lineWidth = s * 0.028;
    const g = s / 5;
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(g * i, g * 0.8);
      ctx.lineTo(g * i, s - g * 0.8);
      ctx.stroke();
    }
    for (let j = 1; j < 5; j++) {
      ctx.beginPath();
      ctx.moveTo(g * 0.8, g * j);
      ctx.lineTo(s - g * 0.8, g * j);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(234, 142, 57, 0.45)";
    ctx.fillRect(s * 0.35, s * 0.35, s * 0.3, s * 0.3);
  },
  (ctx, s) => {
    ctx.strokeStyle = "rgba(90, 62, 43, 0.88)";
    ctx.lineWidth = s * 0.022;
    const cx = s * 0.5;
    const cy = s * 0.5;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * s * 0.42, cy + Math.sin(a) * s * 0.42);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(31, 103, 117, 0.4)";
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.12, 0, Math.PI * 2);
    ctx.fill();
  },
];

function buildTattooThumbDataUrls(size = 48): string[] {
  if (typeof document === "undefined") {
    return [PLACEHOLDER_PNG, PLACEHOLDER_PNG, PLACEHOLDER_PNG];
  }
  return TATTOO_DRAWERS.map((draw) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return PLACEHOLDER_PNG;
    ctx.clearRect(0, 0, size, size);
    draw(ctx, size);
    return canvas.toDataURL("image/png");
  });
}

function AcousticPanelMeshes({
  scale,
  color,
  tattooIndex,
}: {
  scale: number;
  color: string;
  tattooIndex: number | null;
}) {
  const tattooUrls = useMemo(
    () => buildTattooThumbDataUrls(TATTOO_CANVAS_SIZE),
    [],
  );
  const tattooTextures = useTexture(tattooUrls) as THREE.Texture[];

  useEffect(() => {
    tattooTextures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.needsUpdate = true;
    });
  }, [tattooTextures]);

  const overlayMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    const m = overlayMatRef.current;
    if (!m) return;
    if (tattooIndex === null) {
      m.map = null;
    } else {
      const tex = tattooTextures[tattooIndex];
      if (tex) m.map = tex;
    }
    m.needsUpdate = true;
  }, [tattooIndex, tattooTextures]);

  useFrame((_, delta) => {
    const m = overlayMatRef.current;
    if (!m) return;
    const target = tattooIndex === null ? 0 : 1;
    m.opacity = THREE.MathUtils.damp(m.opacity, target, 10, delta);
  });

  return (
    <group scale={[scale, 1, scale]}>
      <mesh>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial
          ref={overlayMatRef}
          color="#ffffff"
          transparent
          opacity={0}
          alphaTest={0.04}
          depthWrite={false}
          metalness={0}
          roughness={0.82}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    </group>
  );
}

// Scene Component (3D Canvas)
function Scene({
  scale,
  color,
  tattooIndex,
}: {
  scale: number;
  color: string;
  tattooIndex: number | null;
}) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [3, 2, 5] }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} />

        <AcousticPanelMeshes scale={scale} color={color} tattooIndex={tattooIndex} />

        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}

// UI Component (Slider and Controls)
function UI({
  setColor,
  profiles,
  active,
  setActive,
  activeTattoo,
  setActiveTattoo,
  tattooThumbs,
}: {
  setColor: (color: string) => void;
  profiles: Array<Pick<SubProductProfile, "name">>;
  active: number;
  setActive: (i: number) => void;
  activeTattoo: number | null;
  setActiveTattoo: (i: number | null) => void;
  tattooThumbs: string[] | null;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: dir === "left" ? -120 : 120,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-[#111] p-6 rounded-2xl text-white">
      <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] axiforma font-bold mb-6">Select Profiles</h2>

      {/* SLIDER + BUTTONS */}
      <div className="flex items-center justify-between mb-6">
        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto no-scrollbar"
          style={{ maxWidth: "280px" }}
        >
          {profiles.map((p, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`min-w-[56px] h-14 border ${active === i ? "border-orange-500" : "border-gray-600"
                } flex items-center justify-center cursor-pointer`}
            >
              <span className="text-[11px] text-gray-300 px-1 text-center leading-tight">
                {p.name}
              </span>
            </div>
          ))}
        </div>

        {/* BUTTON GROUP (RIGHT SIDE) */}
        <div className="flex gap-2 ml-3">
          <button
            onClick={() => scroll("left")}
            className="px-3 py-1 bg-gray-800 rounded text-[14px] sm:text-[15px] inter-font font-[400] hover:bg-gray-700 transition"
          >
            ◀
          </button>

          <button
            onClick={() => scroll("right")}
            className="px-3 py-1 bg-gray-800 rounded text-[14px] sm:text-[15px] inter-font font-[400] hover:bg-gray-700 transition"
          >
            ▶
          </button>
        </div>
      </div>

      <hr className="border-gray-700 mb-6" />

      {/* FRONT + SELECT */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] inter-font font-[400]">Front</h3>

        <select className="bg-black border border-gray-600 px-2 rounded w-[150px] h-[40px] text-[14px] sm:text-[15px] inter-font font-[400] text-white">
          <option>veneered</option>
        </select>
      </div>

      {/* COLORS */}
      <div className="flex gap-4">
        <div
          onClick={() => setColor("#c19a6b")}
          className="w-12 h-12 rounded-full border-2 border-orange-500 cursor-pointer"
          style={{ background: "#c19a6b" }}
        ></div>

        <div
          onClick={() => setColor("#5a3e2b")}
          className="w-12 h-12 rounded-full cursor-pointer"
          style={{ background: "#5a3e2b" }}
        ></div>

        <div
          onClick={() => setColor("#e6d3b3")}
          className="w-12 h-12 rounded-full cursor-pointer"
          style={{ background: "#e6d3b3" }}
        ></div>
      </div>

      {/* TATTOO TEXTURES — same row rhythm as colors (flex gap-4) */}
      <div className="flex gap-4 mt-4" aria-label="Tattoo textures">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveTattoo(activeTattoo === i ? null : i)}
            className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 cursor-pointer transition-[border-color,box-shadow] duration-200 ease-out ${activeTattoo === i ? "border-orange-500 shadow-[0_0_0_1px_rgba(234,142,57,0.35)]" : "border-gray-600"
              }`}
          >
            {tattooThumbs?.[i] ? (
              <Image
                src={tattooThumbs[i]}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="block w-full h-full bg-gray-700" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function Product3DViewer({
  profilesSection,
}: {
  profilesSection?: SubProductProfilesSection | null;
}) {
  const [scale, setScale] = useState(1);
  const [color, setColor] = useState("#c19a6b");
  const [activeProfile, setActiveProfile] = useState(0);
  const [activeTattoo, setActiveTattoo] = useState<number | null>(null);
  const [tattooThumbs, setTattooThumbs] = useState<string[] | null>(null);

  useEffect(() => {
    setTattooThumbs(buildTattooThumbDataUrls(48));
  }, []);

  const profiles: Array<Pick<SubProductProfile, "name" | "size" | "description">> =
    profilesSection?.profiles?.length
      ? profilesSection.profiles.map((p) => ({
        name: p.name,
        size: p.size,
        description: p.description,
      }))
      : [
        { name: "1.5/8x8", size: "30 x 30 cm" },
        { name: "3/8x8", size: "30 x 30 cm" },
        { name: "3/16x16", size: "30 x 30 cm" },
        { name: "6/16x16", size: "30 x 30 cm" },
        { name: "8/16", size: "30 x 30 cm" },
        { name: "10/16", size: "30 x 30 cm" },
      ];

  const title = profilesSection?.title ?? "Product Profiles";
  const description =
    profilesSection?.description ??
    "A linear grooved acoustic panel is one of the most commonly used multi-groove panels. Suitable for auditoriums, lecture halls, conference rooms, and public buildings.";
  const selected = profiles[Math.min(activeProfile, profiles.length - 1)];

  return (
    <section className="w-full bg-[#3D3D3D] px-[24px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[48px] sm:py-[64px] lg:py-[80px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[35px] axiforma font-bold mb-3 text-white">
            {title}
          </h2>
          <p className="text-[14px] sm:text-[15px] inter-font font-[400] text-gray-300 leading-relaxed max-w-md">
            {description}
          </p>
          {selected?.size && (
            <div className="mt-4 text-[14px] sm:text-[15px] inter-font font-[400] text-gray-400">
              📏 {selected.size}
            </div>
          )}
          {selected?.description && (
            <p className="mt-2 text-[13px] sm:text-[14px] inter-font font-[400] text-gray-300 max-w-xl">
              {selected.description}
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT SIDE - 3D View */}
          <div className="w-full h-[400px] sm:h-[450px] lg:h-[500px] bg-transparent relative">
            <Scene scale={scale} color={color} tattooIndex={activeTattoo} />

            {/* ZOOM BUTTONS */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.2))}
                className="w-10 h-10 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition text-[18px] sm:text-[20px] inter-font font-bold"
              >
                -
              </button>

              <button
                onClick={() => setScale((prev) => Math.min(prev + 0.2, 2))}
                className="w-10 h-10 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition text-[18px] sm:text-[20px] inter-font font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - UI Controls */}
          <div className="w-full">
            <UI
              setColor={setColor}
              profiles={profiles}
              active={activeProfile}
              setActive={setActiveProfile}
              activeTattoo={activeTattoo}
              setActiveTattoo={setActiveTattoo}
              tattooThumbs={tattooThumbs}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
