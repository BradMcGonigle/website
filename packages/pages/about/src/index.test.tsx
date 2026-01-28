import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AboutPage from "./index";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("AboutPage", () => {
  it("renders the about heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { name: "About", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders the introduction text", () => {
    render(<AboutPage />);
    expect(
      screen.getByText(/Hi, I'm Brad — a software engineer living in Orlando/i)
    ).toBeInTheDocument();
  });

  it("renders the beyond the code section", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { name: "Beyond the code", level: 2 })
    ).toBeInTheDocument();
  });

  it("renders the get in touch section", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { name: "Get in touch", level: 2 })
    ).toBeInTheDocument();
  });

  it("renders within an article element for semantic structure", () => {
    render(<AboutPage />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("renders a link to the resume page", () => {
    render(<AboutPage />);
    const resumeLink = screen.getByRole("link", { name: "resume" });
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute("href", "/resume");
  });
});
