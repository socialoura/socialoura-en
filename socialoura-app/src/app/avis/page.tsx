"use client";

import { Star, TrendingUp, Users, Shield, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const testimonials = [
  {
    name: "Sarah M.",
    platform: "Instagram",
    rating: 5,
    comment: "Amazing service! The delivery was smooth and gradual. My profile visibility improved significantly. Highly recommend for anyone looking to grow their audience.",
    growth: "+2.5K",
    date: "2 days ago",
  },
  {
    name: "James L.",
    platform: "TikTok",
    rating: 5,
    comment: "Best quality I've found. Real profiles that actually engage with my content. The growth felt natural and my analytics improved across the board.",
    growth: "+5K",
    date: "5 days ago",
  },
  {
    name: "Emily D.",
    platform: "YouTube",
    rating: 5,
    comment: "Fast delivery and excellent support team. Had a small question and they responded within minutes. Very professional growth service!",
    growth: "+1K",
    date: "1 week ago",
  },
  {
    name: "Michael B.",
    platform: "Instagram",
    rating: 5,
    comment: "Was skeptical at first but the results speak for themselves. Real engagement, safe for my account, and great customer support. Will use again!",
    growth: "+3K",
    date: "1 week ago",
  },
  {
    name: "Rachel F.",
    platform: "TikTok",
    rating: 5,
    comment: "Reliable and trustworthy service. I've ordered multiple times and it's been perfect every time. Fair pricing and consistent quality.",
    growth: "+4.2K",
    date: "2 weeks ago",
  },
  {
    name: "Alex P.",
    platform: "YouTube",
    rating: 5,
    comment: "Excellent promotion service! My channel gained serious visibility and my subscriber count grew steadily. Thank you for the professionalism.",
    growth: "+800",
    date: "3 weeks ago",
  },
];

const stats = [
  { icon: <Users className="w-5 h-5" />, value: "50K+", label: "Happy Customers" },
  { icon: <TrendingUp className="w-5 h-5" />, value: "5M+", label: "Orders Delivered" },
  { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Average Rating" },
  { icon: <Shield className="w-5 h-5" />, value: "100%", label: "Safe & Secure" },
];

export default function AvisPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      {/* Rating banner */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FBBF24] text-[#FBBF24]" />
              ))}
            </div>
            <span className="text-[15px] font-bold text-[#111827]">Rated 4.9/5 by 3,000+ creators</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF4B6A]/10 text-[#FF4B6A] text-xs font-bold uppercase tracking-wider rounded-full mb-6">
            <Award className="w-3.5 h-3.5" />
            Customer Reviews
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] leading-tight mb-4">
            What Our Customers Say
          </h1>
          
          <p className="text-[#4B5563] text-lg max-w-3xl mx-auto mb-12">
            Thousands of creators and businesses trust our social media growth services.
            Read their honest feedback below.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#FF4B6A]/10 flex items-center justify-center text-[#FF4B6A]">
                  {stat.icon}
                </div>
                <div className="text-2xl font-extrabold text-[#111827] mb-0.5">{stat.value}</div>
                <div className="text-xs text-[#4B5563] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF4B6A]/10 flex items-center justify-center text-[#FF4B6A] font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111827] text-[15px]">{testimonial.name}</h3>
                      <span className="text-xs text-[#4B5563] font-medium">{testimonial.platform}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#FF4B6A]">{testimonial.growth}</span>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-[#4B5563] text-sm leading-relaxed mb-4 flex-grow">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>

                {/* Footer */}
                <div className="pt-3 border-t border-[#E5E7EB]">
                  <span className="text-xs text-[#4B5563]/60">{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-[#FF4B6A] p-10 sm:p-14 shadow-[0_20px_60px_-20px_rgba(255,75,106,0.4)]">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />
            
            <div className="relative text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                Join thousands of satisfied creators
              </h2>
              <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto">
                Start growing your social media presence today with safe, professional promotion services.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-[#FF4B6A] font-bold px-8 py-4 rounded-full md:hover:bg-gray-50 transition-all duration-300 shadow-lg md:hover:shadow-xl md:hover:scale-105 active:scale-95"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
