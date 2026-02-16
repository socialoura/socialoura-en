import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Mail, Users } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <section className="py-16 bg-gradient-to-b from-[#F9FAFB] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with contact image */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/contactIcons.webp"
                alt="Contact our team"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mb-4">
              Contact Us
            </h1>
            <p className="text-[#4B5563] text-base sm:text-lg max-w-2xl mx-auto">
              Our team is here to help you with anything you need.
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Chat 24/7 */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#FF4B6A] rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                Live Chat 24/7
              </h3>
              <p className="text-[#4B5563] text-sm mb-4">
                Chat with our support team online.
              </p>
              <button className="text-[#FF4B6A] font-semibold text-sm hover:text-[#E8435F] transition-colors">
                Start a Chat →
              </button>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#FF4B6A] rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">Email</h3>
              <p className="text-[#4B5563] text-sm mb-2">
                Reach us at{" "}
                <span className="font-semibold text-[#111827]">
                  support@socialnovaly.com
                </span>{" "}
                or use the form below
              </p>
              <button className="text-[#FF4B6A] font-semibold text-sm hover:text-[#E8435F] transition-colors">
                Send an Email →
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
            <h2 className="text-2xl font-bold text-[#111827] mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[#111827] mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#FF4B6A]/20 focus:border-[#FF4B6A] transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#111827] mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#FF4B6A]/20 focus:border-[#FF4B6A] transition-all"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-[#111827] mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#FF4B6A]/20 focus:border-[#FF4B6A] transition-all"
                  placeholder="How can we help you?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-[#111827] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#FF4B6A]/20 focus:border-[#FF4B6A] transition-all resize-none"
                  placeholder="Describe your request in detail..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF4B6A] hover:bg-[#E8435F] text-white font-bold py-3 px-6 rounded-full transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                All services are fully operational
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
