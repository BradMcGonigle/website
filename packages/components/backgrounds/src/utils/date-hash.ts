const MS_PER_ROTATION = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Get the current rotation index based on time.
 * Changes every 8 hours (3 times per day).
 */
export function getCurrentRotationIndex(): number {
  return Math.floor(Date.now() / MS_PER_ROTATION);
}

/**
 * Get the background index for the current rotation period.
 * Uses a deterministic algorithm based on time.
 */
export function getBackgroundIndex(backgroundCount: number): number {
  if (backgroundCount <= 0) return 0;
  return getCurrentRotationIndex() % backgroundCount;
}
