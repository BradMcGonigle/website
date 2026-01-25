import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Footer } from "./index";

describe("Footer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-25"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a footer element", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("displays the current year", () => {
    render(<Footer />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("displays the copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Brad McGonigle\. All rights reserved\./i)
    ).toBeInTheDocument();
  });
});
