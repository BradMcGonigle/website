import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Footer } from "./index";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

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

  it("renders footer navigation with changelog link", () => {
    render(<Footer />);
    expect(
      screen.getByRole("navigation", { name: "Footer navigation" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Changelog" })).toHaveAttribute(
      "href",
      "/changelog"
    );
  });
});
