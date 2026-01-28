"use client";

import { useContext } from "react";
import { BackgroundContext } from "../provider/background-context";
import type { BackgroundContextValue } from "../types";

/**
 * Hook to access the current background context.
 * Must be used within a BackgroundProvider.
 */
export function useBackground(): BackgroundContextValue {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
