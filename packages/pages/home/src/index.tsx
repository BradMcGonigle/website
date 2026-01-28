"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { formatDate } from "utils.core.format";
import {
  AnimatedSection,
  AnimatedText,
  AnimatedList,
  AnimatedListItem,
  AnimatedCard,
} from "./animations";

export interface Post {
  title: string;
  description: string;
  date: string;
  createdAt: string;
  slug: string;
  permalink: string;
  tags: string[];
  draft: boolean;
  metadata: {
    readingTime: number;
    wordCount: number;
  };
}

export interface LinkItem {
  title: string;
  description?: string;
  url: string;
  image?: string;
  date: string;
  createdAt: string;
  tags: string[];
  slug: string;
}

export interface HomePageProps {
  posts: Post[];
  links: LinkItem[];
}

export default function HomePage({ posts, links }: HomePageProps) {
  const recentPosts = posts
    .filter((post) => !post.draft)
    .sort((a, b) => {
      const dateCompare =
        new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 4);

  const recentLinks = [...links]
    .sort((a, b) => {
      const dateCompare =
        new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="pb-16">
        <AnimatedText
          as="h1"
          delay={0}
          className="text-4xl font-bold tracking-tight sm:text-5xl"
          id="hero-heading"
        >
          Hi, I&apos;m Brad.
        </AnimatedText>
        <AnimatedText
          as="p"
          delay={0.1}
          className="mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          I&apos;m a software engineer from Orlando, Florida building things on
          the internet.
        </AnimatedText>
        <AnimatedSection delay={0.2} className="mt-6 flex gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            About me
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Read the blog
          </Link>
        </AnimatedSection>
      </section>

      {/* Writings Section */}
      <AnimatedSection delay={0.3}>
        <section aria-labelledby="writings-heading" className="py-12">
          <div className="flex items-center justify-between">
            <h2 id="writings-heading" className="text-2xl font-bold">
              Writings
            </h2>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-2 text-muted-foreground">
            Thoughts on things.
          </p>

          <AnimatedList className="mt-8 space-y-6">
            {recentPosts.map((post, index) => (
              <AnimatedListItem key={post.slug} index={index}>
                <AnimatedCard>
                  <article className="group">
                    <Link
                      href={post.permalink}
                      className="block rounded-lg border border-transparent p-4 transition-colors hover:border-border hover:bg-accent/50"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <time
                          dateTime={post.date}
                          className="text-sm text-muted-foreground"
                        >
                          {formatDate(post.date)}
                          {post.metadata.readingTime > 0 && (
                            <span className="ml-2">
                              &middot; {post.metadata.readingTime} min read
                            </span>
                          )}
                        </time>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-muted-foreground">
                        {post.description}
                      </p>
                    </Link>
                  </article>
                </AnimatedCard>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        </section>
      </AnimatedSection>

      {/* Links Section */}
      <AnimatedSection delay={0.1}>
        <section aria-labelledby="links-heading" className="py-12">
          <div className="flex items-center justify-between">
            <h2 id="links-heading" className="text-2xl font-bold">
              Links
            </h2>
            <Link
              href="/links"
              className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-2 text-muted-foreground">
            Interesting finds from around the web.
          </p>

          <AnimatedList className="mt-8 grid gap-4 sm:grid-cols-2">
            {recentLinks.map((link, index) => (
              <AnimatedListItem key={link.slug} index={index}>
                <AnimatedCard className="h-full">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-accent/50"
                  >
                    <time
                      dateTime={link.date}
                      className="text-xs text-muted-foreground"
                    >
                      {formatDate(link.date)}
                    </time>
                    <h3 className="mt-1 flex items-start gap-2 font-semibold group-hover:text-primary">
                      <span className="flex-1">{link.title}</span>
                      <ExternalLink className="mt-1 h-3 w-3 flex-shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
                    </h3>
                    {link.description && (
                      <p className="mt-2 flex-1 line-clamp-2 text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    )}
                  </a>
                </AnimatedCard>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        </section>
      </AnimatedSection>
    </div>
  );
}
