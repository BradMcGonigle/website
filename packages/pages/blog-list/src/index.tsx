import Link from "next/link";
import { formatDate } from "utils.core.format";

export interface Post {
  title: string;
  description: string;
  date: string;
  slug: string;
  permalink: string;
  tags: string[];
  draft: boolean;
}

export interface BlogListPageProps {
  posts: Post[];
}

export default function BlogListPage({ posts }: BlogListPageProps) {
  const publishedPosts = posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section aria-labelledby="blog-heading">
        <h1 id="blog-heading" className="text-4xl font-bold">
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Thoughts on development, technology, and more.
        </p>
      </section>

      <section aria-label="Blog posts" className="mt-12">
        <ul className="space-y-12">
          {publishedPosts.map((post) => (
            <li key={post.slug}>
              <article>
                <time
                  dateTime={post.date}
                  className="text-sm text-muted-foreground"
                >
                  {formatDate(post.date)}
                </time>
                <h2 className="mt-2 text-2xl font-semibold">
                  <Link
                    href={post.permalink}
                    className="hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {post.description}
                </p>
                {post.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Tags for ${post.title}`}>
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/70">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
