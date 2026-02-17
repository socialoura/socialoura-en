"use client";

import { Zap, Shield, UserCheck, Award, Users, TrendingUp, Star } from "lucide-react";

const kpis = [
  { value: "+100M", label: "Interactions Delivered", icon: <TrendingUp className="w-5 h-5" /> },
  { value: "4.9/5", label: "Average Rating", icon: <Star className="w-5 h-5" /> },
  { value: "78K+", label: "Campaigns Launched", icon: <Users className="w-5 h-5" /> },
];

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Delivery",
    description:
      "Our smart system processes and delivers all orders with gradual, organic-style pacing that keeps your account safe.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Lifetime Guarantee",
    description:
      "All services are backed by a lifetime retention guarantee. If anything drops, we’ll replenish it — free of charge.",
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Real & Active Engagement",
    description:
      "We deliver real, active profiles and engagement. Our methods are safe, transparent, and fully policy-compliant.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Trusted by 50K+ Creators",
    description:
      "From solo creators to established brands, thousands trust SocialNovaly for safe, professional social media growth.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-[#FFF7FA] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#FFE4EC] text-[#FF4B6A] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Why Thousands Trust SocialNovaly
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight">
            AI-powered <span className="text-[#FF4B6A]">social growth</span> you
            can actually trust
          </h2>
          <p className="text-[#111827]/50 mt-4 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Safe, transparent promotion services trusted by 50K+ creators and brands worldwide.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-14">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="text-center bg-white rounded-2xl py-6 px-4 border border-[#F1E4EA] shadow-sm">
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#FFE4EC] flex items-center justify-center text-[#FF4B6A]">
                {kpi.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#111827] mb-1">{kpi.value}</div>
              <div className="text-xs text-[#111827]/40 font-medium">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-7 flex flex-col gap-4 border border-[#F1E4EA] shadow-sm md:hover:shadow-md md:hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFE4EC] flex items-center justify-center text-[#FF4B6A] md:group-hover:scale-105 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#111827]">{feature.title}</h3>
              <p className="text-[#111827]/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
