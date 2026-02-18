"use client";

import { Zap, Shield, UserCheck, Award, Users, TrendingUp, Star, ScanSearch, Target, Rocket } from "lucide-react";

const kpis = [
  { value: "+100M", label: "Engagement Events Processed", icon: <TrendingUp className="w-5 h-5" /> },
  { value: "4.9/5", label: "Platform Satisfaction Score", icon: <Star className="w-5 h-5" /> },
  { value: "78K+", label: "Growth Campaigns Deployed", icon: <Users className="w-5 h-5" /> },
];

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Algorithmic Reach Optimization",
    description:
      "Our SocialNovaly™ Engine distributes engagement using organic-style pacing algorithms, ensuring your growth curve mirrors natural audience behavior — zero flags, maximum reach.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "High-Retention Guarantee",
    description:
      "Every campaign is backed by a lifetime stability guarantee. Our quality-control AI continuously monitors retention and auto-replenishes any variance — at no additional cost.",
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Audience Filtering Technology",
    description:
      "We source engagement exclusively from verified, active profiles filtered through our multi-layer quality-control AI. Premium-grade interactions, fully policy-compliant.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Non-Intrusive Integration",
    description:
      "No login credentials required. Our platform operates entirely via public profile URLs — your account security is never compromised at any stage of the process.",
  },
];

const steps = [
  {
    icon: <ScanSearch className="w-6 h-6" />,
    step: "01",
    title: "Analyze",
    description: "Our AI scans your profile niche, content style, and audience signals to build a precision targeting profile.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    step: "02",
    title: "Target",
    description: "We identify high-affinity audience clusters aligned with your content vertical and engagement patterns.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    step: "03",
    title: "Deploy",
    description: "Our smart delivery system distributes engagement with organic pacing, respecting platform velocity limits.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-[#FFF7FA] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#FFE4EC] text-[#FF4B6A] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Enterprise-Grade Growth Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight">
            Smart Growth Algorithms <span className="text-[#FF4B6A]">built for scale</span>
          </h2>
          <p className="text-[#111827]/50 mt-4 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Data-backed engagement technology trusted by 50K+ creators and brands worldwide.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
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

        {/* How It Works */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#FFE4EC] text-[#FF4B6A] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            The Tech Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] leading-tight">
            How the <span className="text-[#FF4B6A]">SocialNovaly™ Engine</span> works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, idx) => (
            <div key={idx} className="relative bg-white rounded-2xl p-7 border border-[#F1E4EA] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFE4EC] flex items-center justify-center text-[#FF4B6A]">
                  {s.icon}
                </div>
                <span className="text-3xl font-black text-[#FF4B6A]/20">{s.step}</span>
              </div>
              <h3 className="text-lg font-bold text-[#111827]">{s.title}</h3>
              <p className="text-[#111827]/50 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
