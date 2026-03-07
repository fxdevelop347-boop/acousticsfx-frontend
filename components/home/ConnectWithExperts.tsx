"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/lib/newsletter-api";
import { submitContactForm } from "@/lib/contact-api";
import { fetchContent, type ContentMap } from "@/lib/content-api";
import { FadeIn, SlideIn } from "@/components/animations";

const CMS_KEYS = ["home.connectExperts.image"];
const DEFAULT_EXPERT_IMAGE = "/assets/about/glassimg.jpg";

export default function ConnectWithExperts() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const nameInputDesktopRef = useRef<HTMLInputElement>(null);
  const nameInputMobileRef = useRef<HTMLInputElement>(null);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [cmsContent, setCmsContent] = useState<ContentMap>({});

  useEffect(() => {
    fetchContent(CMS_KEYS).then(setCmsContent).catch(console.error);
  }, []);

  const expertImage = cmsContent["home.connectExperts.image"]?.value ?? DEFAULT_EXPERT_IMAGE;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    try {
      await submitContactForm({
        name: contactName,
        email: contactEmail,
        phone: contactPhone || undefined,
        subject: "General Inquiry",
        message: contactCompany
          ? `[Company: ${contactCompany}] ${contactMessage}`
          : contactMessage,
      });
      toast.success("Message sent! We'll get back to you shortly.");
      setContactName("");
      setContactEmail("");
      setContactCompany("");
      setContactPhone("");
      setContactMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setContactSending(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await subscribeNewsletter(email);
      toast.success("You're subscribed! Thanks for joining our newsletter.");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative bg-[#1f2528] py-10 text-white overflow-hidden">
      {/* ================= TOP AREA ================= */}
      <div className="relative flex min-h-[300px] flex-col lg:flex-row">
        {/* LEFT CONTENT */}
        <FadeIn
          direction="left"
          duration={0.7}
          className="pl-6 sm:pl-10 lg:pl-[100px] pr-6 lg:pr-12 flex flex-col justify-center max-w-[720px] z-10 text-left"
        >
          <h2 className="text-[32px] sm:text-[38px] lg:text-[45px] inter-font font-[600] mb-4 text-left">
            Connect with experts
          </h2>

          <div className="flex flex-wrap justify-start gap-4 text-[14px] inter-font font-[400] text-white/70 mb-4">
            <span>🏆 NRC Certified</span>
            <span>👨‍💼 Acoustic Experts</span>
            <span>📈 500+ Projects</span>
          </div>

          <p className="text-[14px] inter-font font-[400] text-white/80 mb-8 leading-relaxed text-left">
            Reach out to our expert team for tailored acoustic solutions,
            consultations, and unparalleled support. Your journey to perfect
            sound starts with a conversation at FX Acoustics.
          </p>

          <button
            type="button"
            onClick={() => {
              const isDesktop =
                window.matchMedia("(min-width: 1024px)").matches;
              const target = isDesktop
                ? nameInputDesktopRef.current
                : nameInputMobileRef.current;
              target?.scrollIntoView({ behavior: "smooth", block: "center" });
              setTimeout(() => target?.focus(), 400);
            }}
            className="bg-white text-black px-6 py-3 w-fit text-sm font-medium cursor-pointer"
          >
            Get in touch →
          </button>
        </FadeIn>

        {/* RIGHT IMAGE */}
        <SlideIn
          direction="right"
          className="relative lg:absolute right-0 top-1/2 lg:-translate-y-1/2 mt-10 lg:mt-0"
        >
          <div className="relative w-full lg:w-[600px] h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden">
            <Image
              src={expertImage}
              alt="Expert"
              fill
              className="object-cover"
              priority
            />

            {/* LEFT FADE */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(31,37,40,1), rgba(31,37,40,0.9), rgba(31,37,40,0.75), rgba(31,37,40,0.55), rgba(31,37,40,0.35), rgba(31,37,40,0.15), rgba(31,37,40,0))",
              }}
            />
          </div>
        </SlideIn>

        {/* FORM CARD — DESKTOP ONLY */}
        <FadeIn
          direction="up"
          delay={0.15}
          className="absolute right-[200px] top-1/2 -translate-y-1/2 z-20 hidden lg:block"
        >
          <form
            onSubmit={handleContactSubmit}
            className="bg-white/40 backdrop-blur-[0px] text-black rounded-2xl p-8 w-[550px] shadow-xl"
          >
            <p className="text-xs mb-6 text-gray-800">
              Fill out this form and our team will get back to you.
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
              <input
                ref={nameInputDesktopRef}
                className="bg-transparent border-b border-black/60 outline-none pb-2 placeholder:text-gray-800"
                placeholder="Your Name*"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
              <input
                type="email"
                className="bg-transparent border-b border-black/60 outline-none pb-2 placeholder:text-gray-800"
                placeholder="Your Email Address*"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
              <input
                className="bg-transparent border-b border-black/60 outline-none pb-2 placeholder:text-gray-800"
                placeholder="Company name"
                value={contactCompany}
                onChange={(e) => setContactCompany(e.target.value)}
              />
              <input
                className="bg-transparent border-b border-black/60 outline-none pb-2 placeholder:text-gray-800"
                placeholder="Your Phone number*"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
              <textarea
                className="col-span-2 bg-transparent border-b border-black/60 outline-none resize-none pb-2 placeholder:text-gray-800"
                placeholder="Your message*"
                rows={2}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={contactSending}
              className="mt-6 bg-[#1f2528] text-white px-8 py-3 text-sm font-medium cursor-pointer hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {contactSending ? "Sending…" : "Submit →"}
            </button>
          </form>
        </FadeIn>
      </div>

      {/* ================= MOBILE CONTACT FORM ================= */}
      <div className="px-6 sm:px-10 py-8 lg:hidden">
        <form
          onSubmit={handleContactSubmit}
          className="bg-white/10 backdrop-blur-sm text-white rounded-2xl p-6 sm:p-8 w-full"
        >
          <p className="text-xs mb-6 text-white/70">
            Fill out this form and our team will get back to you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 text-sm">
            <input
              ref={nameInputMobileRef}
              className="bg-transparent border-b border-white/40 outline-none pb-2 placeholder:text-white/60"
              placeholder="Your Name*"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <input
              type="email"
              className="bg-transparent border-b border-white/40 outline-none pb-2 placeholder:text-white/60"
              placeholder="Your Email Address*"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
            <input
              className="bg-transparent border-b border-white/40 outline-none pb-2 placeholder:text-white/60"
              placeholder="Company name"
              value={contactCompany}
              onChange={(e) => setContactCompany(e.target.value)}
            />
            <input
              className="bg-transparent border-b border-white/40 outline-none pb-2 placeholder:text-white/60"
              placeholder="Your Phone number*"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
            <textarea
              className="sm:col-span-2 bg-transparent border-b border-white/40 outline-none resize-none pb-2 placeholder:text-white/60"
              placeholder="Your message*"
              rows={2}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={contactSending}
            className="mt-6 bg-white text-[#1f2528] px-8 py-3 text-sm font-medium cursor-pointer hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {contactSending ? "Sending…" : "Submit →"}
          </button>
        </form>
      </div>

      {/* ================= BOTTOM SUBSCRIBE ================= */}
      <div className="px-6 sm:px-10 lg:px-[100px] py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="text-left">
          <h3 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold mb-2 inter-font text-left">
            Subscribe to our Latest News
          </h3>
          <p className="text-[14px] inter-font font-[400] text-white/70 max-w-md leading-relaxed text-left">
            Join our mailing list and get the latest FX Acoustics news, insights,
            updates, and exclusive articles delivered to your inbox.
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="px-5 py-3 bg-white text-black text-[14px] w-full md:w-[280px] outline-none inter-font font-[400] border border-white/40 placeholder:text-[#EA8E39]"
          />

          <button
            type="submit"
            disabled={sending}
            className="bg-white text-[#097F98] px-6 py-3 text-[14px] inter-font font-bold whitespace-nowrap cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {sending ? "Subscribing…" : "Subscribe Now →"}
          </button>
        </form>
      </div>
    </section>
  );
}
