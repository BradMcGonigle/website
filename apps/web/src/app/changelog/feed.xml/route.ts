import { changelog } from "#content";
import { generateRssFeed } from "@/lib/rss";
import { site } from "@/lib/site";

export function GET() {
  const sortedChangelog = [...changelog].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const feed = generateRssFeed({
    title: `Changelog | ${site.name}`,
    description: "All notable changes and updates to this site.",
    link: `${site.url}/changelog`,
    feedUrl: `${site.url}/changelog/feed.xml`,
    items: sortedChangelog.map((entry) => ({
      title: `v${entry.version}: ${entry.title}`,
      description: entry.description,
      link: `${site.url}${entry.permalink}`,
      pubDate: new Date(entry.createdAt),
      categories: entry.tags,
    })),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
