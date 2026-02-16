"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Are the profiles real and active?",
    preview: "Yes, 100% real and active — no bots.",
    answer:
      "Yes, all profiles are 100% real and active. We never deliver bots or fake accounts. Every profile is verified to ensure the highest quality possible.",
  },
  {
    question: "Is it safe to use your services?",
    preview: "Completely safe — compliant with platform guidelines.",
    answer:
      "Absolutely. Our promotion methods are safe and comply with social media platform guidelines. Your account will never be put at risk. We use organic-style delivery methods.",
  },
  {
    question: "How fast is the delivery?",
    preview: "Most orders start within minutes.",
    answer:
      "Most orders begin processing within minutes of payment. Delivery is gradual and natural-looking to ensure the best results and safety for your account.",
  },
  {
    question: "Is there a subscription or recurring charge?",
    preview: "No, one-time payment only.",
    answer:
      "No, there are no hidden subscriptions. You pay once for the service you order. No recurring fees, no surprises.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
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
