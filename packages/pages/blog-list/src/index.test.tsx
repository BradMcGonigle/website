import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BlogListPage, { type Post } from "./index";

const mockPosts: Post[] = [
  {
    title: "Test Post 1",
    description: "Description for test post 1",
    date: "2024-01-15",
    slug: "test-post-1",
    permalink: "/blog/test-post-1",
    tags: ["React", "Testing"],
    draft: false,
  },
  {
    title: "Test Post 2",
    description: "Description for test post 2",
    date: "2024-01-10",
    slug: "test-post-2",
    permalink: "/blog/test-post-2",
    tags: ["TypeScript"],
    draft: false,
  },
  {
    title: "Draft Post",
    description: "This is a draft",
    date: "2024-01-20",
    slug: "draft-post",
    permalink: "/blog/draft-post",
    tags: [],
    draft: true,
  },
];

describe("BlogListPage", () => {
  it("renders the page heading", () => {
    render(<BlogListPage posts={mockPosts} />);
    expect(
      screen.getByRole("heading", { name: "Blog", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders published posts", () => {
    render(<BlogListPage posts={mockPosts} />);
    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("Test Post 2")).toBeInTheDocument();
  });

  it("does not render draft posts", () => {
    render(<BlogListPage posts={mockPosts} />);
    expect(screen.queryByText("Draft Post")).not.toBeInTheDocument();
  });

  it("renders post descriptions", () => {
    render(<BlogListPage posts={mockPosts} />);
    expect(screen.getByText("Description for test post 1")).toBeInTheDocument();
  });

  it("renders post tags", () => {
    render(<BlogListPage posts={mockPosts} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("sorts posts by date in descending order", () => {
    render(<BlogListPage posts={mockPosts} />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0]).toHaveTextContent("Test Post 1");
    expect(headings[1]).toHaveTextContent("Test Post 2");
  });
});
