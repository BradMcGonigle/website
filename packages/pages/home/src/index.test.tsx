import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./index";

describe("HomePage", () => {
  it("renders the heading with the site owner name", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "Brad McGonigle", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders the welcome text", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Welcome to my personal website/i)
    ).toBeInTheDocument();
  });

  it("has a properly labeled hero section", () => {
    render(<HomePage />);
    const section = screen.getByRole("region", { name: /Brad McGonigle/i });
    expect(section).toBeInTheDocument();
  });
});
