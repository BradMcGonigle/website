import BlogListPage from "pages.blog-list";
import { blog } from "#content";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on development, technology, and more.",
  alternates: {
    types: {
      "application/rss+xml": `${site.url}/blog/feed.xml`,
    },
  },
};

export default function BlogPage() {
  return <BlogListPage posts={blog} />;
}
