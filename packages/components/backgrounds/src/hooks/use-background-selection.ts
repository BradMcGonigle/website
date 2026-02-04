"use client";

import { useState, useEffect } from "react";
import type { BackgroundId } from "../types";
import { backgrounds } from "../backgrounds";
import { getBackgroundIndex } from "../utils/date-hash";
import { getStoredBackground, storeBackground } from "../utils/session-storage";

interface UseBackgroundSelectionResult {
  currentBackground: BackgroundId;
  isLoading: boolean;
}

/**
 * Get background ID from URL query parameter if valid.
 */
function getBackgroundFromUrl(): BackgroundId | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const bgParam = params.get("bg");

  if (bgParam && backgrounds.some((b) => b.id === bgParam)) {
    return bgParam as BackgroundId;
  }

  return null;
}

/**
 * Hook to determine which background should be displayed.
 * Priority: URL param (?bg=mario-kart) > session storage > date-based selection.
 */
export function useBackgroundSelection(): UseBackgroundSelectionResult {
  const [currentBackground, setCurrentBackground] = useState<BackgroundId>("dot-grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check URL parameter first (allows mobile users to select backgrounds)
    const urlBackground = getBackgroundFromUrl();
    if (urlBackground) {
      setCurrentBackground(urlBackground);
      storeBackground(urlBackground);
      setIsLoading(false);
      return;
    }

    // Check session storage next
    const stored = getStoredBackground();
    if (stored) {
      setCurrentBackground(stored);
      setIsLoading(false);
      return;
    }

    // Otherwise, select based on date
    const index = getBackgroundIndex(backgrounds.length);
    const selected = backgrounds[index];
    if (selected) {
      setCurrentBackground(selected.id);
      storeBackground(selected.id);
    }
    setIsLoading(false);
  }, []);

  return { currentBackground, isLoading };
}
