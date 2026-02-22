"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Are the profiles real and active?",
    preview: "Verified, active users filtered by our quality-control AI.",
    answer:
      "We utilize a network of verified, active users filtered by our multi-layer quality-control AI. Every profile passes automated authenticity checks before being included in any campaign — ensuring premium-grade, high-retention engagement.",
  },
  {
    question: "Is it safe for my account?",
    preview: "Yes. Our delivery engine triggers zero platform flags.",
    answer:
      "Yes. Our SocialNovaly™ delivery engine strictly adheres to platform velocity limits and mimics organic behavior patterns to ensure 100% safety. Your account is never put at risk at any stage of the process.",
  },
  {
    question: "How does Smart-Paced Delivery work?",
    preview: "Gradual, organic-style distribution — no sudden spikes.",
    answer:
      "Our AI-driven delivery system distributes engagement incrementally over time, replicating the natural growth curve of an organically growing account. This approach avoids anomalous activity spikes and ensures stable, long-term results.",
  },
  {
    question: "Do you need my password or login credentials?",
    preview: "Never. Public URL or username only.",
    answer:
      "No login credentials are ever required. Our platform operates via Non-Intrusive Integration — we only need your public profile URL or username. Your account security is fully preserved throughout the entire process.",
  },
  {
    question: "What is the High-Retention Guarantee?",
    preview: "Lifetime stability — we auto-replenish any variance.",
    answer:
      "Every campaign is backed by a lifetime stability guarantee. Our quality-control AI continuously monitors your results post-delivery. If any variance is detected, we automatically replenish it at no additional cost to you.",
  },
  {
    question: "Is there a subscription or recurring charge?",
    preview: "No — one-time payment, no hidden fees.",
    answer:
      "No. All plans are one-time purchases with no hidden subscriptions or recurring charges. You select your growth campaign, pay once, and our platform handles the rest. No surprises, ever.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-[#FAFAFA] via-[#FFF7FA] to-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#FFE4EC] text-[#FF4B6A] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827]">
            Frequently Asked Questions
          </h2>
          <p className="text-[#111827]/40 mt-3 text-sm sm:text-base font-medium">
            Answers to the most common questions from our customers.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                openIndex === idx
                  ? "bg-white border-[#FF4B6A]/20 shadow-md"
                  : "bg-[#FFF7FA] border-[#F1E4EA] md:hover:border-[#FF4B6A]/20 md:hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <div className="pr-4">
                  <span className="font-semibold text-[#111827] text-sm sm:text-base block">
                    {faq.question}
                  </span>
                  {openIndex !== idx && (
                    <span className="text-[#111827]/35 text-xs mt-1 block">{faq.preview}</span>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                    openIndex === idx ? "rotate-180 text-[#FF4B6A]" : "text-[#111827]/30"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 text-[#111827]/50 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
