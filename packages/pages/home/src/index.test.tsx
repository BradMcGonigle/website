import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./index";

const mockPosts = [
  {
    title: "Test Post",
    description: "A test post description",
    date: "2024-01-15",
    createdAt: "2024-01-15T10:00:00Z",
    slug: "test-post",
    permalink: "/blog/test-post",
    tags: ["test"],
    draft: false,
    metadata: {
      readingTime: 5,
      wordCount: 1000,
    },
  },
];

const mockLinks = [
  {
    title: "Test Link",
    description: "A test link description",
    url: "https://example.com",
    date: "2024-01-10",
    createdAt: "2024-01-10T10:00:00Z",
    tags: ["test"],
    slug: "test-link",
  },
];

describe("HomePage", () => {
  it("renders the hero heading", () => {
    render(<HomePage posts={mockPosts} links={mockLinks} />);
    expect(
      screen.getByRole("heading", { name: /Hi, I'm Brad/i, level: 1 })
    ).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<HomePage posts={mockPosts} links={mockLinks} />);
    expect(
      screen.getByText(/software engineer from Orlando/i)
    ).toBeInTheDocument();
  });

  it("renders the writings section", () => {
    render(<HomePage posts={mockPosts} links={mockLinks} />);
    expect(
      screen.getByRole("heading", { name: /Writings/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("renders the links section", () => {
    render(<HomePage posts={mockPosts} links={mockLinks} />);
    expect(
      screen.getByRole("heading", { name: /Links/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("renders recent posts", () => {
    render(<HomePage posts={mockPosts} links={mockLinks} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("renders recent links", () => {
    render(<HomePage posts={mockPosts} links={mockLinks} />);
    expect(screen.getByText("Test Link")).toBeInTheDocument();
  });
});
