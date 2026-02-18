"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, CheckCircle } from "lucide-react";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function ChatForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sendError, setSendError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => emailRef.current?.focus(), 120);
  }, []);

  const handleSend = async () => {
    setEmailError("");
    setMessageError("");
    setSendError("");

    let valid = true;
    if (!email.trim() || !isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }
    if (!message.trim()) {
      setMessageError("Please describe your question");
      valid = false;
    }
    if (!valid) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSuccess(true);
      setTimeout(() => onClose(), 2500);
    } catch {
      setSendError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <p className="font-bold text-[#111827] text-base">Message sent!</p>
        <p className="text-sm text-[#4B5563]">
          Thanks! We&apos;ll reply to your email within 24h.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-[#111827] mb-1.5">
          Your Email <span className="text-[#FF4B6A]">*</span>
        </label>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
          placeholder="you@email.com"
          className={`w-full h-11 px-4 rounded-xl border text-[#111827] text-sm font-medium outline-none transition-all ${
            emailError
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-[#E5E7EB] focus:border-[#FF4B6A] focus:ring-2 focus:ring-[#FF4B6A]/20"
          }`}
          autoComplete="email"
        />
        {emailError && (
          <p className="text-xs text-red-500 mt-1 font-medium">{emailError}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-[#111827] mb-1.5">
          Message <span className="text-[#FF4B6A]">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value); setMessageError(""); }}
          placeholder="How can we help you?"
          rows={4}
          className={`w-full px-4 py-3 rounded-xl border text-[#111827] text-sm font-medium outline-none transition-all resize-none ${
            messageError
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-[#E5E7EB] focus:border-[#FF4B6A] focus:ring-2 focus:ring-[#FF4B6A]/20"
          }`}
        />
        {messageError && (
          <p className="text-xs text-red-500 mt-1 font-medium">{messageError}</p>
        )}
      </div>

      {sendError && (
        <p className="text-xs text-red-500 font-medium text-center">{sendError}</p>
      )}

      <button
        onClick={handleSend}
        disabled={isLoading}
        className="w-full h-11 bg-[#FF4B6A] hover:bg-[#E8435F] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* ── DESKTOP: bottom-right, 60px, pulse ── */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col items-end gap-3">
        {/* Desktop overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />
        )}

        {/* Desktop modal */}
        {isOpen && (
          <div
            className="relative z-50 w-[360px] bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] border border-[#E5E7EB] overflow-hidden"
            style={{ animation: "chatSlideUp 0.25s ease-out" }}
          >
            <div className="flex items-center justify-between px-5 py-4 bg-[#FF4B6A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Chat with Support</p>
                  <p className="text-white/70 text-xs">We reply within 24h</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div className="p-5">
              <ChatForm onClose={handleClose} />
            </div>
          </div>
        )}

        {/* Desktop trigger — 60px, pulse */}
        <button
          onClick={isOpen ? handleClose : handleOpen}
          aria-label="Open support chat"
          className="relative z-50 w-[60px] h-[60px] rounded-full bg-[#FF4B6A] text-white flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(255,75,106,0.5)] hover:shadow-[0_12px_32px_-4px_rgba(255,75,106,0.65)] hover:scale-110 active:scale-95 transition-all duration-200"
          style={{ animation: isOpen ? "none" : "chatPulse 3s ease-in-out infinite" }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
}
