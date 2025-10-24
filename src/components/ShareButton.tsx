"use client";
import { useState, useEffect } from "react";

interface ShareButtonProps {
  creativeId: string;
  displayName?: string;
}

export default function ShareButton({ creativeId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateProfessionalUrl = () => {
    if (!isClient) return ""; // Return empty string during SSR

    // Get the current path without query parameters
    const currentPath = window.location.pathname;

    // Remove any trailing slashes and get the clean path
    const cleanPath = currentPath.replace(/\/$/, "");

    // Create the share URL with creatorId as query parameter
    return `${
      window.location.origin
    }${cleanPath}?creatorId=${encodeURIComponent(creativeId)}`;
  };

  const handleShare = async () => {
    if (!isClient) return;

    try {
      const professionalUrl = generateProfessionalUrl();
      console.log("ShareButton: Generated URL:", professionalUrl);

      // Always use clipboard copy (remove Web Share API)
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(professionalUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = professionalUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy URL:", err);

      // Final fallback if everything else fails
      const professionalUrl = generateProfessionalUrl();
      const textArea = document.createElement("textarea");
      textArea.value = professionalUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Don't render anything during SSR to avoid hydration mismatches
  if (!isClient) {
    return (
      <div className="text-center py-6 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Share Your Portfolio
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Share this portfolio with clients, employers, or anyone you&rsquo;d
          like to showcase your work to.
        </p>
        <button
          onClick={handleShare}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            copied
              ? "bg-green-500 text-white"
              : "bg-[#0A1754] text-white hover:bg-[#0A1754]/90 cursor-pointer"
          }`}
        >
          {copied ? "✓ Link Copied!" : "📋 Copy Portfolio Link"}
        </button>
      </div>
    </div>
  );
}
