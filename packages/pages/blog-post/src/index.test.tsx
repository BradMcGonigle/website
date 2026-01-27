import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BlogPostPage, { type Post } from "./index";

const mockPost: Post = {
  title: "Test Post Title",
  description: "This is a test post description",
  date: "2024-01-15",
  slug: "test-post",
  permalink: "/blog/test-post",
  tags: ["React", "Testing"],
};

describe("BlogPostPage", () => {
  it("renders the post title", () => {
    render(
      <BlogPostPage post={mockPost}>
        <p>Post content</p>
      </BlogPostPage>
    );
    expect(
      screen.getByRole("heading", { name: "Test Post Title", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders the post description", () => {
    render(
      <BlogPostPage post={mockPost}>
        <p>Post content</p>
      </BlogPostPage>
    );
    expect(
      screen.getByText("This is a test post description")
    ).toBeInTheDocument();
  });

  it("renders the post date", () => {
    render(
      <BlogPostPage post={mockPost}>
        <p>Post content</p>
      </BlogPostPage>
    );
    const timeElement = screen.getByRole("time");
    expect(timeElement).toHaveAttribute("datetime", "2024-01-15");
  });

  it("renders post tags", () => {
    render(
      <BlogPostPage post={mockPost}>
        <p>Post content</p>
      </BlogPostPage>
    );
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("renders the back to blog link", () => {
    render(
      <BlogPostPage post={mockPost}>
        <p>Post content</p>
      </BlogPostPage>
    );
    const backLink = screen.getByRole("link", { name: /back to blog/i });
    expect(backLink).toHaveAttribute("href", "/blog");
  });

  it("renders children content", () => {
    render(
      <BlogPostPage post={mockPost}>
        <p>This is the post content</p>
      </BlogPostPage>
    );
    expect(screen.getByText("This is the post content")).toBeInTheDocument();
  });
});
