"use client";

import { useEffect, useMemo, useState } from "react";

interface ShareButtonProps {
  creativeId: string;
  username?: string; // ✅ account username (e.g. "doe")
  templateType:
    | "WRITER"
    | "VIDEOGRAPHER"
    | "DEVELOPER"
    | "PHOTOGRAPHER"
    | "SOCIAL_MEDIA_MANAGER"
    | "DESIGNER";
}

const templateToBasePath: Record<ShareButtonProps["templateType"], string> = {
  WRITER: "/writer-portfolio",
  VIDEOGRAPHER: "/videographer-portfolio",
  DEVELOPER: "/developer-portfolio",
  PHOTOGRAPHER: "/photographer-portfolio",
  SOCIAL_MEDIA_MANAGER: "/social-media-portfolio",
  DESIGNER: "/designer-portfolio",
};

export default function ShareButton({
  creativeId,
  username,
  templateType,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const professionalUrl = useMemo(() => {
    if (!isClient) return "";
    const origin = window.location.origin;

    // ✅ Username + creativeId for unique, shareable URL
    if (username && username.trim() && creativeId && creativeId !== "unknown") {
      const base = templateToBasePath[templateType];
      return `${origin}${base}/${encodeURIComponent(username.trim())}/${encodeURIComponent(creativeId)}`;
    }

    // ⚠️ Fallback: if username missing, still produce something usable
    // (You said "nothing else", but without username you can't build the slug URL.
    // This fallback prevents copying an empty string.)
    return `${origin}${templateToBasePath[templateType]}?creatorId=${encodeURIComponent(
      creativeId
    )}`;
  }, [isClient, username, templateType, creativeId]);

  const copyToClipboard = async (text: string) => {
    if (!text) return;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Older browser fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  const handleShare = async () => {
    if (!isClient) return;

    try {
      await copyToClipboard(professionalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Avoid SSR hydration mismatch
  if (!isClient) {
    return (
      <div className="text-center py-6 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="h-12 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  const isDisabled = !username || !username.trim();

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
          disabled={isDisabled}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : copied
              ? "bg-green-500 text-white"
              : "bg-[#0A1754] text-white hover:bg-[#0A1754]/90 cursor-pointer"
          }`}
          title={isDisabled ? "Username not available to build link" : undefined}
        >
          {copied ? "✓ Link Copied!" : "📋 Copy Portfolio Link"}
        </button>

        {/* Optional: show the exact link being copied (remove if you don't want it) */}
        {!isDisabled && (
          <p className="mt-3 text-xs text-gray-500 break-all">{professionalUrl}</p>
        )}
      </div>
    </div>
  );
}