import { blog } from "#content";
import { generateRssFeed } from "@/lib/rss";
import { site } from "@/lib/site";

export function GET() {
  const posts = blog
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const feed = generateRssFeed({
    title: `Blog | ${site.name}`,
    description: "Thoughts on development, technology, and more.",
    link: `${site.url}/blog`,
    feedUrl: `${site.url}/blog/feed.xml`,
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      link: `${site.url}${post.permalink}`,
      pubDate: new Date(post.createdAt),
      categories: post.tags,
    })),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
