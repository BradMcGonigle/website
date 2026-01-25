import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./index";

describe("AboutPage", () => {
  it("renders the about heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { name: "About", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<AboutPage />);
    expect(
      screen.getByText(/Learn more about me and what I do/i)
    ).toBeInTheDocument();
  });

  it("renders within an article element for semantic structure", () => {
    render(<AboutPage />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
