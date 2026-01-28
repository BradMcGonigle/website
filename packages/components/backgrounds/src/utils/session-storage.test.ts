import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getStoredBackground, storeBackground } from "./session-storage";

describe("session-storage", () => {
  const mockSessionStorage: Record<string, string> = {};
  const mockGetItem = vi.fn((key: string) => mockSessionStorage[key] ?? null);
  const mockSetItem = vi.fn((key: string, value: string) => {
    mockSessionStorage[key] = value;
  });
  const mockRemoveItem = vi.fn((key: string) => {
    delete mockSessionStorage[key];
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(0));

    // Reset mocks
    mockGetItem.mockClear();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();

    // Mock sessionStorage
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
      },
      writable: true,
    });

    // Clear mock storage
    Object.keys(mockSessionStorage).forEach((key) => {
      delete mockSessionStorage[key];
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getStoredBackground", () => {
    it("returns null when no background is stored", () => {
      expect(getStoredBackground()).toBeNull();
    });

    it("returns the stored background when rotation matches", () => {
      storeBackground("topographic");
      expect(getStoredBackground()).toBe("topographic");
    });

    it("returns null when rotation has changed", () => {
      storeBackground("dot-grid");

      // Advance time by 8 hours
      vi.setSystemTime(new Date(8 * 60 * 60 * 1000));

      expect(getStoredBackground()).toBeNull();
    });

    it("clears stored values when rotation has changed", () => {
      storeBackground("dot-grid");

      // Advance time by 8 hours
      vi.setSystemTime(new Date(8 * 60 * 60 * 1000));

      getStoredBackground();

      // Verify storage was cleared
      expect(mockRemoveItem).toHaveBeenCalledWith("bg-selection");
      expect(mockRemoveItem).toHaveBeenCalledWith("bg-rotation-index");
    });
  });

  describe("storeBackground", () => {
    it("stores the background id", () => {
      storeBackground("topographic");
      expect(mockSetItem).toHaveBeenCalledWith("bg-selection", "topographic");
    });

    it("stores the current rotation index", () => {
      storeBackground("dot-grid");
      expect(mockSetItem).toHaveBeenCalledWith("bg-rotation-index", "0");
    });

    it("updates the rotation index when stored at a different time", () => {
      vi.setSystemTime(new Date(8 * 60 * 60 * 1000)); // 8 hours in
      storeBackground("topographic");
      expect(mockSetItem).toHaveBeenCalledWith("bg-rotation-index", "1");
    });
  });
});
