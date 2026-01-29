import { site } from "./site";

export interface FeedItem {
  title: string;
  description?: string | undefined;
  link: string;
  pubDate: Date;
  guid?: string | undefined;
  categories?: string[] | undefined;
}

export interface FeedOptions {
  title: string;
  description: string;
  link: string;
  feedUrl: string;
  items: FeedItem[];
  language?: string;
  lastBuildDate?: Date;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRssFeed(options: FeedOptions): string {
  const {
    title,
    description,
    link,
    feedUrl,
    items,
    language = "en-us",
    lastBuildDate = new Date(),
  } = options;

  const itemsXml = items
    .map((item) => {
      const categories = item.categories
        ?.map((cat) => `      <category>${escapeXml(cat)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid ?? item.link)}</guid>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>${item.description ? `\n      <description>${escapeXml(item.description)}</description>` : ""}${categories ? `\n${categories}` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    <managingEditor>${escapeXml(site.author.email)} (${escapeXml(site.author.name)})</managingEditor>
    <webMaster>${escapeXml(site.author.email)} (${escapeXml(site.author.name)})</webMaster>
${itemsXml}
  </channel>
</rss>`;
}
