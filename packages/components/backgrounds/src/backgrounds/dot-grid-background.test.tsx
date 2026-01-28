import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DotGridBackground } from "./dot-grid-background";

describe("DotGridBackground", () => {
  it("renders a div element", () => {
    render(<DotGridBackground />);
    const element = document.querySelector(".dot-grid-bg");
    expect(element).toBeInTheDocument();
  });

  it("has aria-hidden attribute for accessibility", () => {
    render(<DotGridBackground />);
    const element = document.querySelector(".dot-grid-bg");
    expect(element).toHaveAttribute("aria-hidden", "true");
  });

  it("has pointer-events-none class", () => {
    render(<DotGridBackground />);
    const element = document.querySelector(".dot-grid-bg");
    expect(element).toHaveClass("pointer-events-none");
  });

  it("is fixed positioned", () => {
    render(<DotGridBackground />);
    const element = document.querySelector(".dot-grid-bg");
    expect(element).toHaveClass("fixed");
    expect(element).toHaveClass("inset-0");
  });

  it("has z-0 for proper stacking", () => {
    render(<DotGridBackground />);
    const element = document.querySelector(".dot-grid-bg");
    expect(element).toHaveClass("z-0");
  });
});
