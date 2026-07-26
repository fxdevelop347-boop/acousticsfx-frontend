"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "@/components/shared/SmartImage";
import {
  submitContactForm,
  CONTACT_SUBJECTS,
  type ContactSubject,
} from "@/lib/contact-api";
import { FadeIn, SlideIn } from "@/components/animations";

const inputClassName =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#1F6775] focus:outline-none focus:ring-2 focus:ring-[#1F6775]/20";

export default function ContactFormSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<ContactSubject>("General Inquiry");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitContactForm({ name, email, phone, subject, message });
      toast.success("Message sent! We'll get back to you shortly.");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("General Inquiry");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-[#f0f4f5] px-4 sm:px-[40px] lg:px-[100px] py-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Single surface: illustration + form read as one block */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_12px_48px_-16px_rgba(15,23,42,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:min-h-[min(100%,520px)]">
            {/* Illustration — shared panel with form */}
            <SlideIn
              direction="left"
              className="relative flex items-center justify-center border-b border-[#1F6775]/10 bg-linear-to-br from-[#eaf4f6] via-[#f4f9fa] to-white px-6 py-6 sm:py-8 lg:border-b-0 lg:border-r lg:py-10"
            >
              <div
                className="pointer-events-none absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#1F6775]/10 blur-3xl lg:block"
                aria-hidden
              />
              <Image
                src="/assets/contacts/8690678_3969584 1.svg"
                alt="Contact us illustration — person sending messages"
                width={400}
                height={400}
                className="relative z-10 w-full max-w-[200px] sm:max-w-[260px] lg:max-w-[300px] h-auto drop-shadow-sm"
              />
            </SlideIn>

            {/* Form */}
            <FadeIn direction="up" className="flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-[1.375rem] sm:text-3xl lg:text-[2.25rem] font-bold text-[#111] poppins-font leading-tight">
                  Contact Us
                </h2>
                <p className="mt-1.5 text-sm sm:text-base text-gray-600 poppins-font">
                  Any question or remarks? Just write us a message!
                </p>
                <div
                  className="mt-3 h-px w-12 rounded-full bg-[#1F6775]"
                  aria-hidden
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600 poppins-font sm:text-[13px]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputClassName}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600 sm:text-sm">
                      Business Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600 poppins-font sm:text-[13px]">
                      Business Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 012 3456 789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-700 poppins-font">
                    Select Subject?
                  </p>
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                    {CONTACT_SUBJECTS.map((s) => (
                      <label
                        key={s}
                        className="flex cursor-pointer items-center gap-2.5 text-xs text-gray-700 sm:text-[13px]"
                      >
                        <input
                          type="radio"
                          name="subject"
                          value={s}
                          checked={subject === s}
                          onChange={() => setSubject(s)}
                          className="h-4 w-4 border-gray-300 accent-[#1F6775] focus:ring-[#1F6775]"
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600 poppins-font sm:text-[13px]">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className={`${inputClassName} resize-none`}
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-lg bg-[#EA8E39] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#d97a28] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {sending ? "Sending…" : "Send Message"}
                  </button>
                </div>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
