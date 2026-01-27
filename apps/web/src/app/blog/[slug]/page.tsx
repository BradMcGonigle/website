import { notFound } from "next/navigation";
import BlogPostPage from "pages.blog-post";
import { blog } from "#content";
import { MDXContent } from "components.content.mdx";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blog
    .filter((post) => !post.draft)
    .map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.find((p) => p.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Brad McGonigle`,
    description: post.description,
  };
}

export default async function BlogPostRoute({ params }: PageProps) {
  const { slug } = await params;
  const post = blog.find((p) => p.slug === slug);

  if (!post || post.draft) {
    notFound();
  }

  return (
    <BlogPostPage post={post}>
      <MDXContent code={post.content} />
    </BlogPostPage>
  );
}
