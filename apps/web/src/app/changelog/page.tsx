import type { Metadata } from "next";
import ChangelogPage from "pages.changelog";
import { changelog } from "#content";
import { MDXContent } from "@/components/mdx-content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Changelog",
  description: "All notable changes and updates to this site",
  alternates: {
    types: {
      "application/rss+xml": `${site.url}/changelog/feed.xml`,
    },
  },
};

export default function Page() {
  const entries = changelog.map((entry) => ({
    ...entry,
    content: <MDXContent code={entry.content} />,
  }));

  return <ChangelogPage entries={entries} />;
}
