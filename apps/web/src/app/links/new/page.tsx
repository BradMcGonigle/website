import type { Metadata } from "next";
import { SaveLinkForm } from "./save-link-form";

export const metadata: Metadata = {
  title: "Save Link | Brad McGonigle",
  description: "Save an interesting link to share on the site.",
  robots: "noindex, nofollow",
};

interface PageProps {
  searchParams: Promise<{ url?: string; key?: string }>;
}

export default async function SaveLinkPage({ searchParams }: PageProps) {
  const { url, key } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Save Link</h1>
      <p className="mt-2 text-muted-foreground">
        Save an interesting link to share on your site.
      </p>
      <SaveLinkForm initialUrl={url} apiKey={key} />
    </div>
  );
}
