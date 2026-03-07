"use client";

import {
  ShieldCheck,
  Rocket,
  Users,
  HeartHandshake,
  Leaf,
  Star,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";

export default function ValuesSection() {
  return (
    <section className="px-[16px] sm:px-[40px] lg:px-[100px] py-[60px] sm:py-[80px] lg:py-[100px] bg-white">

      {/* ================= Heading ================= */}
      <FadeIn direction="up" className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
        <p className="text-[16px] font-bold mb-4 worksans-font">
          Our Values
        </p>

        <h2 className="text-[26px] sm:text-[30px] lg:text-[35px] axiforma font-bold leading-tight">
          We Build Values That Are Timeless, Thoughtful & Impactful.
        </h2>
      </FadeIn>

      {/* ================= Values Grid ================= */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-14 sm:gap-y-16 lg:gap-y-20 gap-x-8 sm:gap-x-12 lg:gap-x-16">
        {/* Card 1 */}
        <StaggerItem>
          <HoverScale>
            <ValueCard
              icon={<ShieldCheck size={28} />}
              title="Integrity"
              text="We uphold the highest standards of honesty and transparency, ensuring trust in every solution we deliver."
            />
          </HoverScale>
        </StaggerItem>

        {/* Card 2 */}
        <StaggerItem>
          <HoverScale>
            <ValueCard
              icon={<Rocket size={28} />}
              title="Innovation"
              text="We constantly push boundaries, blending advanced acoustics with design thinking to deliver future-ready solutions."
            />
          </HoverScale>
        </StaggerItem>

        {/* Card 3 */}
        <StaggerItem>
          <HoverScale>
            <ValueCard
              icon={<Users size={28} />}
              title="Collaboration"
              text="We work hand-in-hand with architects, designers, and clients, creating solutions that thrive on shared vision."
            />
          </HoverScale>
        </StaggerItem>

        {/* Card 4 */}
        <StaggerItem>
          <HoverScale>
            <ValueCard
              icon={<HeartHandshake size={28} />}
              title="Customer-centric"
              text="We place our clients at the heart of every solution, designing experiences that reflect their needs and aspirations."
            />
          </HoverScale>
        </StaggerItem>

        {/* Card 5 */}
        <StaggerItem>
          <HoverScale>
            <ValueCard
              icon={<Leaf size={28} />}
              title="Sustainability"
              text="We design solutions that respect the environment, balancing performance with responsibility for a greener future."
            />
          </HoverScale>
        </StaggerItem>

        {/* Card 6 */}
        <StaggerItem>
          <HoverScale>
            <ValueCard
              icon={<Star size={28} />}
              title="Excellence"
              text="We strive for the highest standards in every detail, delivering acoustic solutions that set benchmarks in quality and design."
            />
          </HoverScale>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}

/* ================= Reusable Card ================= */
function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center px-6">
      <div className="text-orange-500 mb-4">
        {icon}
      </div>

      <h3 className="text-[24px] sm:text-[25px] lg:text-[26px] font-[500] inter-font text-[#1B152B] mb-3">
        {title}
      </h3>

      <p className="text-[16px] sm:text-[16px] lg:text-[17px] manrope font-[400] text-[#1F6775] leading-relaxed max-w-xs">
        {text}
      </p>
    </div>
  );
}
