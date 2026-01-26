import type { Metadata } from "next";
import ChangelogPage from "pages.changelog";
import { changelog } from "#content";
import { MDXContent } from "@/components/mdx-content";

export const metadata: Metadata = {
  title: "Changelog | Brad McGonigle",
  description: "All notable changes and updates to this site",
};

export default function Page() {
  const entries = changelog.map((entry) => ({
    ...entry,
    content: <MDXContent code={entry.content} />,
  }));

  return <ChangelogPage entries={entries} />;
}
