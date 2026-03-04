import { useCallback } from "react";

/**
 * Recursively strips `file` properties (non-serializable File objects)
 * so the form data can be saved to localStorage.
 */
function stripFiles(data: unknown): unknown {
  if (Array.isArray(data)) return data.map(stripFiles);
  if (data !== null && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      result[k] = k === "file" ? null : stripFiles(v);
    }
    return result;
  }
  return data;
}

/**
 * A lightweight draft utility that persists form state to localStorage.
 *
 * Usage:
 *   const { saveDraft, saveServerSnapshot, loadDraft, clearDraft, hasMeaningfulDraft } =
 *     useDraft<MyFormData>("portgig_draft_writer");
 *
 * - Call `saveServerSnapshot(data)` once right after the API data loads.
 * - Call `saveDraft(formData)` whenever the user edits (use a debounced useEffect).
 * - Call `hasMeaningfulDraft()` to check if the stored draft differs from the server snapshot.
 * - Call `loadDraft()` to restore the draft into state.
 * - Call `clearDraft()` on successful save.
 */
export function useDraft<T>(draftKey: string) {
  const snapshotKey = `${draftKey}_snapshot`;

  const saveDraft = useCallback(
    (data: T) => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(stripFiles(data as unknown)));
      } catch {
        // localStorage may be unavailable (private browsing, quota exceeded, etc.)
      }
    },
    [draftKey]
  );

  const saveServerSnapshot = useCallback(
    (data: T) => {
      try {
        localStorage.setItem(snapshotKey, JSON.stringify(stripFiles(data as unknown)));
      } catch {}
    },
    [snapshotKey]
  );

  const loadDraft = useCallback((): T | null => {
    try {
      const raw = localStorage.getItem(draftKey);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }, [draftKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey);
    } catch {}
  }, [draftKey]);

  /**
   * Returns true only if a draft exists AND it differs from the last known server
   * snapshot, meaning the user had unsaved edits when they left the page.
   */
  const hasMeaningfulDraft = useCallback((): boolean => {
    try {
      const draft = localStorage.getItem(draftKey);
      if (!draft) return false;
      const snapshot = localStorage.getItem(snapshotKey);
      // No snapshot yet → treat any draft as meaningful (first-ever visit with a stale draft)
      if (!snapshot) return true;
      return draft !== snapshot;
    } catch {
      return false;
    }
  }, [draftKey, snapshotKey]);

  return { saveDraft, saveServerSnapshot, loadDraft, clearDraft, hasMeaningfulDraft };
}
