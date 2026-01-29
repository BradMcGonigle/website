import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TopographicBackground } from "./topographic-background";

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  scale: vi.fn(),
  strokeStyle: "",
  lineWidth: 0,
  lineCap: "butt" as CanvasLineCap,
  lineJoin: "miter" as CanvasLineJoin,
};

const mockGetContext = vi.fn(() => mockContext);
const mockRequestAnimationFrame = vi.fn(() => 1);

beforeEach(() => {
  vi.clearAllMocks();

  // Mock getContext
  HTMLCanvasElement.prototype.getContext =
    mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext;

  // Mock getComputedStyle
  vi.spyOn(window, "getComputedStyle").mockReturnValue({
    getPropertyValue: () => "215 16 47",
  } as unknown as CSSStyleDeclaration);

  // Mock requestAnimationFrame
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(
    mockRequestAnimationFrame
  );
});

describe("TopographicBackground", () => {
  it("renders a canvas element", () => {
    render(<TopographicBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("has aria-hidden attribute for accessibility", () => {
    render(<TopographicBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  it("has pointer-events-none class", () => {
    render(<TopographicBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("pointer-events-none");
  });

  it("is fixed positioned", () => {
    render(<TopographicBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("fixed");
    expect(canvas).toHaveClass("inset-0");
  });

  it("has -z-10 for proper stacking behind content", () => {
    render(<TopographicBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("-z-10");
  });

  it("gets 2d context from canvas", () => {
    render(<TopographicBackground />);
    expect(mockGetContext).toHaveBeenCalledWith("2d");
  });

  it("starts animation with requestAnimationFrame", () => {
    render(<TopographicBackground />);
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });
});
