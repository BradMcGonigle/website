import { links } from "#content";
import { generateRssFeed } from "@/lib/rss";
import { site } from "@/lib/site";

export function GET() {
  const sortedLinks = [...links].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const feed = generateRssFeed({
    title: `Links | ${site.name}`,
    description:
      "Interesting articles, tools, and resources I've found around the web.",
    link: `${site.url}/links`,
    feedUrl: `${site.url}/links/feed.xml`,
    items: sortedLinks.map((link) => ({
      title: link.title,
      description: link.description,
      link: link.url,
      pubDate: new Date(link.createdAt),
      guid: `${site.url}/links/${link.slug}`,
      categories: link.tags,
    })),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
