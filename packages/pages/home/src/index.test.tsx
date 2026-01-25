import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./index";

describe("HomePage", () => {
  it("renders the welcome heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "Welcome to the Monorepo" })
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/modern monorepo with Turborepo, pnpm, Next.js/i)
    ).toBeInTheDocument();
  });

  it("renders as a main element", () => {
    render(<HomePage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
