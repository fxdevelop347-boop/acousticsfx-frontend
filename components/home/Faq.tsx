"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getFaqs, type FaqItem } from "@/lib/api/faqs-api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const FALLBACK_FAQS: FaqItem[] = [
  {
    _id: "f1",
    question: "What kind of clients do you work with?",
    answer:
      "We work with architects, interior designers, corporate offices, hospitality projects, educational institutions, and healthcare facilities. Our acoustic solutions are tailored to meet the unique requirements of each space and client.",
    order: 1,
  },
  {
    _id: "f2",
    question: "What services do you offer?",
    answer:
      "We offer a comprehensive range of acoustic solutions including acoustic panels, ceiling baffles, wall treatments, flooring solutions, and custom acoustic design consultation.",
    order: 2,
  },
  {
    _id: "f3",
    question: "How do you price your projects?",
    answer:
      "Pricing depends on the scope, materials, and complexity of the project. We provide detailed quotes after an initial site assessment or consultation. Contact us for a free estimate.",
    order: 3,
  },
  {
    _id: "f4",
    question: "What is your typical project timeline?",
    answer:
      "Timelines vary based on project size and complexity. Standard installations take 2–4 weeks from order confirmation. Custom solutions may require 4–8 weeks.",
    order: 4,
  },
  {
    _id: "f5",
    question: "Can we collaborate remotely?",
    answer:
      "Absolutely. We support remote consultations via video call and can work from architectural drawings, photos, and measurements.",
    order: 5,
  },
  {
    _id: "f6",
    question: "Do you accept one-off architect tasks or only full projects?",
    answer:
      "We welcome both. Whether you need a single acoustic panel for a conference room or a full building-wide acoustic treatment, we are happy to help.",
    order: 6,
  },
  {
    _id: "f7",
    question: "How many concepts or revisions are included?",
    answer:
      "Our standard consultation includes up to 3 design concepts with 2 rounds of revisions. Additional iterations can be accommodated.",
    order: 7,
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>(FALLBACK_FAQS);

  useEffect(() => {
    let cancelled = false;
    getFaqs()
      .then((data) => {
        if (!cancelled && data.length > 0) setFaqs(data);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-6 sm:px-10 lg:px-[100px] py-[80px] lg:py-[100px] bg-white">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        {/* LEFT CONTENT */}
        <FadeIn direction="left" className="w-full lg:w-1/2">
          <p className="text-[16px] mb-3 inter-font font-[500]">FAQs</p>

          <h2 className="text-[34px] sm:text-[44px] lg:text-[54px] font-bold mb-4 inter-font font-[500]">
            Wondering How We Work?
          </h2>

          <p className="text-[16px] text-gray-600 mb-6 max-w-md inter-font font-[500]">
            Answers to common questions about our process, services, and how we
            work.
          </p>

          <Link href="/contactus">
            <button className="bg-[#EA8E39] text-white px-6 py-3 text-[20px] mb-10 worksans-font cursor-pointer">
              Contact Us
            </button>
          </Link>

          {/* IMAGE */}
          <div className="relative overflow-hidden w-full max-w-[551.55px] aspect-[551.55/443.52]">
            <Image
              src="/assets/home/Design.png"
              alt="FAQ Visual"
              fill
              className="object-cover"
              priority
            />
          </div>
        </FadeIn>

        {/* RIGHT ACCORDION */}
        <div className="w-full lg:w-1/2">
          <StaggerContainer className="space-y-4">
            {faqs.map((item, index) => (
              <StaggerItem key={item._id} direction="up">
                <div className="border rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex justify-between items-center p-4 sm:p-5 text-left cursor-pointer"
                  >
                    <span className="font-medium inter-font text-[16px] sm:text-[18px] lg:text-[20px]">
                      {index + 1}. {item.question}
                    </span>
                    <span className="text-xl">
                      {openIndex === index ? "—" : "+"}
                    </span>
                  </button>

                  {openIndex === index && (
                    <div className="px-5 pb-5 text-[16px] sm:text-[17px] lg:text-[18px] axiforma text-gray-600">
                      {item.answer}
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
