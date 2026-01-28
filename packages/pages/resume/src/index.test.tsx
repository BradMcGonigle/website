import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResumePage from "./index";

describe("ResumePage", () => {
  it("renders the resume heading", () => {
    render(<ResumePage />);
    expect(
      screen.getByRole("heading", { name: "Resume", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders the experience section", () => {
    render(<ResumePage />);
    expect(
      screen.getByRole("heading", { name: "Experience", level: 2 })
    ).toBeInTheDocument();
  });

  it("renders the skills section", () => {
    render(<ResumePage />);
    expect(
      screen.getByRole("heading", { name: "Skills", level: 2 })
    ).toBeInTheDocument();
  });

  it("renders the education section", () => {
    render(<ResumePage />);
    expect(
      screen.getByRole("heading", { name: "Education", level: 2 })
    ).toBeInTheDocument();
  });

  it("renders within an article element for semantic structure", () => {
    render(<ResumePage />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("renders GoodRx jobs", () => {
    render(<ResumePage />);
    const goodRxElements = screen.getAllByText(/GoodRx/);
    expect(goodRxElements.length).toBeGreaterThan(0);
    const leadEngineerElements = screen.getAllByText(/Lead Software Engineer/);
    expect(leadEngineerElements.length).toBeGreaterThan(0);
  });

  it("renders education details", () => {
    render(<ResumePage />);
    expect(
      screen.getByText(/Bachelor of Arts in Economics/)
    ).toBeInTheDocument();
    expect(screen.getByText(/University of Georgia/)).toBeInTheDocument();
  });
});
