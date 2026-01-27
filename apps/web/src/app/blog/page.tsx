import BlogListPage from "pages.blog-list";
import { blog } from "#content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Brad McGonigle",
  description: "Thoughts on development, technology, and more.",
};

export default function BlogPage() {
  return <BlogListPage posts={blog} />;
}
