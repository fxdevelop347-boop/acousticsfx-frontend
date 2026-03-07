"use client";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  submitContactForm,
  CONTACT_SUBJECTS,
  type ContactSubject,
} from "@/lib/contact-api";
import { FadeIn, SlideIn } from "@/components/animations";

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
    <section className="px-[16px] sm:px-[40px] lg:px-[100px] py-[30px] sm:py-[40px] lg:py-[50px] bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
        {/* ================= Left Illustration ================= */}
        <SlideIn direction="left" className="flex justify-center">
          <Image
            src="/assets/contacts/8690678_3969584 1.svg"
            alt="Contact us illustration — person sending messages"
            width={400}
            height={400}
            className="max-w-xs sm:max-w-sm md:max-w-md w-full h-auto"
          />
        </SlideIn>

        {/* ================= Right Form ================= */}
        <FadeIn direction="up">
          <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-[#111] mb-2 poppins-font">
            Contact Us
          </h2>

          <p className="text-gray-500 mb-8 sm:mb-10 poppins-font font-[500] text-[16px] sm:text-[18px] lg:text-[20px]">
            Any question or remarks? Just write us a message!
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Full Name */}
            <div>
              <label className="block text-[13px] font-[500] poppins-font text-gray-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-b border-gray-300 focus:outline-none focus:border-orange-500 py-2"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-[13px] font-[500] poppins-font">
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Business Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-orange-500 py-2"
                />
              </div>

              <div>
                <label className="block text-[13px] font-[500] poppins-font text-gray-500 mb-2">
                  Business Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 012 3456 789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-orange-500 py-2"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <p className="text-[15px] font-[600] poppins-font text-gray-600 mb-3">
                Select Subject?
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-[13px] font-[400] poppins-font text-gray-600">
                {CONTACT_SUBJECTS.map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="subject"
                      value={s}
                      checked={subject === s}
                      onChange={() => setSubject(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-[13px] font-[500] poppins-font text-gray-500 mb-0">
                Message
              </label>
              <textarea
                rows={3}
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-orange-500 py-2 resize-none"
              />
            </div>

            {/* Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={sending}
                className="bg-orange-500 text-white px-8 py-3 rounded shadow hover:bg-orange-600 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sending ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
