import Link from "next/link";
import { formatDate } from "utils.core.format";
import type { ReactNode } from "react";

export interface Post {
  title: string;
  description: string;
  date: string;
  slug: string;
  permalink: string;
  tags: string[];
}

export interface BlogPostPageProps {
  post: Post;
  children: ReactNode;
}

export default function BlogPostPage({ post, children }: BlogPostPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/blog"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          &larr; Back to blog
        </Link>
      </nav>

      <article>
        <header className="mb-8">
          <time
            dateTime={post.date}
            className="text-sm font-medium text-muted-foreground"
          >
            {formatDate(post.date)}
          </time>
          <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {post.description}
          </p>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Tags for ${post.title}`}>
              {post.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="prose lg:prose-lg dark:prose-invert">
          {children}
        </div>
      </article>
    </div>
  );
}
