"use client";

interface DraftBannerProps {
  onRestore: () => void;
  onDiscard: () => void;
}

/**
 * Shown at the top of a portfolio edit form when an unsaved draft is detected.
 * Lets the user choose to restore their previous edits or discard them.
 *
 * Note: File uploads (images) are not included in the draft — only text fields
 * and image URLs already saved to the server are restored.
 */
export default function DraftBanner({ onRestore, onDiscard }: DraftBannerProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-300 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="text-amber-500 text-xl mt-0.5" aria-hidden="true">
          📝
        </span>
        <div>
          <p className="font-semibold text-amber-800 text-sm leading-tight">
            Unsaved draft found
          </p>
          <p className="text-amber-700 text-xs mt-0.5">
            You have unsaved changes from a previous session. Newly uploaded images will need to be re-added.
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0 ml-8 sm:ml-0">
        <button
          type="button"
          onClick={onRestore}
          className="px-4 py-1.5 bg-amber-600 text-white text-sm font-medium rounded hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          Restore Draft
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="px-4 py-1.5 bg-white border border-amber-300 text-amber-700 text-sm font-medium rounded hover:bg-amber-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
