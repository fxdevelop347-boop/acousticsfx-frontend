"use client";

import { FadeIn } from "@/components/animations";

export default function ContactHero() {
  return (
    <section
      className="relative w-full min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/assets/contacts/1d173913fbb7b4adf7587f36d280e8edcf59765a.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <FadeIn
        direction="up"
        duration={0.7}
        className="
          relative z-10
          px-[16px] sm:px-[40px] lg:px-[100px]
          py-[60px] sm:py-[80px] lg:py-[100px]
          h-full
          flex flex-col justify-center
          text-white
        "
      >
        {/* Breadcrumb */}
        <p className="text-sm text-white/80 mb-6">
          Home <span className="mx-2">•</span>{" "}
          <span className="text-orange-400">Contact Us</span>
        </p>

        {/* Heading */}
        <h2 className="text-[28px] sm:text-[32px] lg:text-4xl font-light mb-2">
          Have a Question or confusion:
        </h2>

        <h1 className="text-[36px] sm:text-[44px] lg:text-5xl font-semibold mb-12">
          Contact Us
        </h1>
      </FadeIn>
    </section>
  );
}
