import LinksListPage from "pages.links-list";
import { links } from "#content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links | Brad McGonigle",
  description:
    "Interesting articles, tools, and resources I've found around the web.",
};

export default function LinksPage() {
  return <LinksListPage links={links} />;
}
