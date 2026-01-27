import { NextResponse } from "next/server";
import { links } from "@/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Filter options
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const featured = searchParams.get("featured");

  let filteredLinks = [...links];

  // Filter by category
  if (category) {
    filteredLinks = filteredLinks.filter((link) => link.category === category);
  }

  // Filter by tag
  if (tag) {
    filteredLinks = filteredLinks.filter((link) => link.tags.includes(tag));
  }

  // Filter by featured
  if (featured === "true") {
    filteredLinks = filteredLinks.filter((link) => link.featured);
  }

  // Sort by date (newest first)
  filteredLinks.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return NextResponse.json({
    links: filteredLinks,
    total: filteredLinks.length,
  });
}
