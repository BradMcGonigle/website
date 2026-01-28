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
 * Hook to determine which background should be displayed.
 * Uses session storage for consistency within a session,
 * and falls back to date-based selection for new sessions.
 */
export function useBackgroundSelection(): UseBackgroundSelectionResult {
  const [currentBackground, setCurrentBackground] = useState<BackgroundId>("dot-grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session storage first
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
