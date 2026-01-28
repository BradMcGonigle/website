import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getCurrentRotationIndex, getBackgroundIndex } from "./date-hash";

describe("date-hash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getCurrentRotationIndex", () => {
    it("returns 0 at the start of epoch", () => {
      vi.setSystemTime(new Date(0));
      expect(getCurrentRotationIndex()).toBe(0);
    });

    it("returns 1 after 8 hours", () => {
      const eightHours = 8 * 60 * 60 * 1000;
      vi.setSystemTime(new Date(eightHours));
      expect(getCurrentRotationIndex()).toBe(1);
    });

    it("returns 3 after 24 hours (3 rotations per day)", () => {
      const twentyFourHours = 24 * 60 * 60 * 1000;
      vi.setSystemTime(new Date(twentyFourHours));
      expect(getCurrentRotationIndex()).toBe(3);
    });

    it("returns same index within the same 8-hour period", () => {
      const baseTime = 8 * 60 * 60 * 1000; // Start of second period
      vi.setSystemTime(new Date(baseTime));
      const index1 = getCurrentRotationIndex();

      vi.setSystemTime(new Date(baseTime + 1000)); // 1 second later
      const index2 = getCurrentRotationIndex();

      vi.setSystemTime(new Date(baseTime + 7 * 60 * 60 * 1000)); // 7 hours later
      const index3 = getCurrentRotationIndex();

      expect(index1).toBe(index2);
      expect(index2).toBe(index3);
    });

    it("changes index after 8 hours", () => {
      const baseTime = 0;
      vi.setSystemTime(new Date(baseTime));
      const index1 = getCurrentRotationIndex();

      vi.setSystemTime(new Date(baseTime + 8 * 60 * 60 * 1000));
      const index2 = getCurrentRotationIndex();

      expect(index2).toBe(index1 + 1);
    });
  });

  describe("getBackgroundIndex", () => {
    it("returns 0 when backgroundCount is 0", () => {
      expect(getBackgroundIndex(0)).toBe(0);
    });

    it("returns 0 when backgroundCount is negative", () => {
      expect(getBackgroundIndex(-1)).toBe(0);
    });

    it("wraps around based on background count", () => {
      const eightHours = 8 * 60 * 60 * 1000;

      vi.setSystemTime(new Date(0));
      expect(getBackgroundIndex(2)).toBe(0);

      vi.setSystemTime(new Date(eightHours));
      expect(getBackgroundIndex(2)).toBe(1);

      vi.setSystemTime(new Date(eightHours * 2));
      expect(getBackgroundIndex(2)).toBe(0);

      vi.setSystemTime(new Date(eightHours * 3));
      expect(getBackgroundIndex(2)).toBe(1);
    });

    it("works with different background counts", () => {
      const eightHours = 8 * 60 * 60 * 1000;

      vi.setSystemTime(new Date(eightHours * 5));
      expect(getBackgroundIndex(3)).toBe(5 % 3); // 2
      expect(getBackgroundIndex(4)).toBe(5 % 4); // 1
      expect(getBackgroundIndex(5)).toBe(5 % 5); // 0
    });
  });
});
