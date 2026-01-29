import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { DotGridBackground } from "./dot-grid-background";

describe("DotGridBackground", () => {
  beforeEach(() => {
    // Mock canvas context
    const mockContext = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      scale: vi.fn(),
      fillStyle: "",
    };

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      mockContext as unknown as CanvasRenderingContext2D
    );
  });

  it("renders a canvas element", () => {
    render(<DotGridBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("has aria-hidden attribute for accessibility", () => {
    render(<DotGridBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  it("has pointer-events-none class", () => {
    render(<DotGridBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("pointer-events-none");
  });

  it("is fixed positioned", () => {
    render(<DotGridBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("fixed");
    expect(canvas).toHaveClass("inset-0");
  });

  it("has -z-10 for proper stacking behind content", () => {
    render(<DotGridBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveClass("-z-10");
  });
});
