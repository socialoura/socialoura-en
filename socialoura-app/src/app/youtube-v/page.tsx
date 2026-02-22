"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function YouTubeViewersRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/products/youtube-views");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#FF0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#4B5563]">Redirecting to YouTube Views...</p>
      </div>
    </div>
  );
}
