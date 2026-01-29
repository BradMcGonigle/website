import LinksListPage from "pages.links-list";
import { links } from "#content";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Links | Brad McGonigle",
  description:
    "Interesting articles, tools, and resources I've found around the web.",
  alternates: {
    types: {
      "application/rss+xml": `${site.url}/links/feed.xml`,
    },
  },
};

export default function LinksPage() {
  return <LinksListPage links={links} />;
}
