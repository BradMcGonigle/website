import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChangelogPage, { type ChangelogEntry } from "./index";

const mockEntries: ChangelogEntry[] = [
  {
    version: "0.2.0",
    date: "2025-02-01",
    createdAt: "2025-02-01T12:00:00.000Z",
    title: "New Feature Release",
    description: "Added new features",
    breaking: false,
    tags: ["feature"],
    slug: "v0.2.0",
    permalink: "/changelog/v0.2.0",
    content: <p>Feature content</p>,
  },
  {
    version: "0.1.0",
    date: "2025-01-26",
    createdAt: "2025-01-26T12:00:00.000Z",
    title: "Initial Release",
    description: "First release",
    breaking: false,
    tags: ["feature", "docs"],
    slug: "v0.1.0",
    permalink: "/changelog/v0.1.0",
    content: <p>Initial content</p>,
  },
];

describe("ChangelogPage", () => {
  it("renders the changelog heading", () => {
    render(<ChangelogPage entries={[]} />);
    expect(
      screen.getByRole("heading", { name: "Changelog", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<ChangelogPage entries={[]} />);
    expect(
      screen.getByText(/All notable changes and updates to this site/i)
    ).toBeInTheDocument();
  });

  it("renders within an article element for semantic structure", () => {
    render(<ChangelogPage entries={[]} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("renders changelog entries", () => {
    render(<ChangelogPage entries={mockEntries} />);
    expect(
      screen.getByRole("heading", { name: "New Feature Release", level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Initial Release", level: 2 })
    ).toBeInTheDocument();
  });

  it("displays version numbers", () => {
    render(<ChangelogPage entries={mockEntries} />);
    expect(screen.getByText("v0.2.0")).toBeInTheDocument();
    expect(screen.getByText("v0.1.0")).toBeInTheDocument();
  });

  it("displays tags for entries", () => {
    render(<ChangelogPage entries={mockEntries} />);
    const featureTags = screen.getAllByText("feature");
    expect(featureTags).toHaveLength(2);
    expect(screen.getByText("docs")).toBeInTheDocument();
  });

  it("sorts entries by date in descending order", () => {
    render(<ChangelogPage entries={mockEntries} />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0]).toHaveTextContent("New Feature Release");
    expect(headings[1]).toHaveTextContent("Initial Release");
  });

  it("renders entry content", () => {
    render(<ChangelogPage entries={mockEntries} />);
    expect(screen.getByText("Feature content")).toBeInTheDocument();
    expect(screen.getByText("Initial content")).toBeInTheDocument();
  });
});
