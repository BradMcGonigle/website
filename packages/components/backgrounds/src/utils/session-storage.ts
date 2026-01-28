import type { BackgroundId } from "../types";
import { getCurrentRotationIndex } from "./date-hash";

const SESSION_KEY = "bg-selection";
const SESSION_ROTATION_KEY = "bg-rotation-index";

/**
 * Get the stored background selection from session storage.
 * Returns null if no selection is stored or if the rotation has changed.
 */
export function getStoredBackground(): BackgroundId | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    const storedRotation = sessionStorage.getItem(SESSION_ROTATION_KEY);
    const currentRotation = getCurrentRotationIndex();

    // If rotation changed, clear the stored value
    if (storedRotation !== String(currentRotation)) {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_ROTATION_KEY);
      return null;
    }

    return stored as BackgroundId | null;
  } catch {
    // Session storage may not be available
    return null;
  }
}

/**
 * Store the background selection in session storage.
 */
export function storeBackground(id: BackgroundId): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(SESSION_KEY, id);
    sessionStorage.setItem(SESSION_ROTATION_KEY, String(getCurrentRotationIndex()));
  } catch {
    // Session storage may not be available
  }
}
