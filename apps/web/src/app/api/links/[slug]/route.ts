import { NextResponse } from "next/server";
import { links } from "@/content";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const link = links.find((l) => l.slug === slug);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}
