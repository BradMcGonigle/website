import { notFound } from "next/navigation";
import BlogPostPage from "pages.blog-post";
import { blog } from "#content";
import { MDXContent } from "components.content.mdx";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";
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

  const postUrl = `${site.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: postUrl,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [site.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function BlogPostRoute({ params }: PageProps) {
  const { slug } = await params;
  const post = blog.find((p) => p.slug === slug);

  if (!post || post.draft) {
    notFound();
  }

  const postUrl = `${site.url}/blog/${post.slug}`;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        url={postUrl}
        datePublished={post.date}
        dateModified={post.updated}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Blog", url: `${site.url}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      <BlogPostPage post={post}>
        <MDXContent code={post.content} />
      </BlogPostPage>
    </>
  );
}
