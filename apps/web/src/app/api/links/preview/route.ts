import { NextRequest, NextResponse } from "next/server";

interface PreviewData {
  url: string;
  title: string;
  description: string;
  ogImage: string | null;
  images: string[];
}

function resolveUrl(src: string, baseUrl: string): string | null {
  try {
    if (src.startsWith("data:")) return null; // Skip data URIs
    if (src.startsWith("//")) return `https:${src}`;
    if (src.startsWith("http")) return src;
    return new URL(src, baseUrl).toString();
  } catch {
    return null;
  }
}

function extractImages(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  const seen = new Set<string>();

  // Extract img src attributes
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src) {
      const resolved = resolveUrl(src, baseUrl);
      if (resolved && !seen.has(resolved)) {
        seen.add(resolved);
        images.push(resolved);
      }
    }
  }

  // Extract srcset images (first one from each srcset)
  const srcsetRegex = /srcset=["']([^"']+)["']/gi;
  while ((match = srcsetRegex.exec(html)) !== null) {
    const srcset = match[1];
    if (srcset) {
      const parts = srcset.split(",");
      const firstPart = parts[0];
      if (firstPart) {
        const firstSrc = firstPart.trim().split(" ")[0] ?? "";
        const resolved = resolveUrl(firstSrc, baseUrl);
        if (resolved && !seen.has(resolved)) {
          seen.add(resolved);
          images.push(resolved);
        }
      }
    }
  }

  // Extract background images from inline styles
  const bgRegex = /background(?:-image)?:\s*url\(['"]?([^'")\s]+)['"]?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    const bgSrc = match[1];
    if (bgSrc) {
      const resolved = resolveUrl(bgSrc, baseUrl);
      if (resolved && !seen.has(resolved)) {
        seen.add(resolved);
        images.push(resolved);
      }
    }
  }

  return images;
}

async function fetchPreview(url: string): Promise<PreviewData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const baseUrl = new URL(url).origin;

  // Extract title
  const ogTitleMatch =
    html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i) ||
    html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"[^>]*>/i);
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title =
    ogTitleMatch?.[1]?.trim() ||
    titleMatch?.[1]?.trim() ||
    new URL(url).hostname;

  // Extract description
  const ogDescMatch =
    html.match(
      /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i
    ) ||
    html.match(
      /<meta[^>]*content="([^"]*)"[^>]*property="og:description"[^>]*>/i
    );
  const descMatch =
    html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
    html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
  const description = ogDescMatch?.[1]?.trim() || descMatch?.[1]?.trim() || "";

  // Extract OG image
  const ogImageMatch =
    html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
    html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i);
  const ogImage = ogImageMatch?.[1]
    ? resolveUrl(ogImageMatch[1], baseUrl)
    : null;

  // Extract all images
  const images = extractImages(html, baseUrl);

  // Filter out tiny images (icons, tracking pixels) by checking common patterns
  const filteredImages = images.filter((img) => {
    const lower = img.toLowerCase();
    // Skip common icon/tracking patterns
    if (lower.includes("favicon")) return false;
    if (lower.includes("icon")) return false;
    if (lower.includes("logo") && lower.includes("small")) return false;
    if (lower.includes("tracking")) return false;
    if (lower.includes("pixel")) return false;
    if (lower.includes("1x1")) return false;
    if (lower.includes("spacer")) return false;
    // Skip SVGs (usually icons)
    if (lower.endsWith(".svg")) return false;
    return true;
  });

  return {
    url,
    title,
    description,
    ogImage,
    images: filteredImages.slice(0, 20), // Limit to 20 images
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const preview = await fetchPreview(url);
    return NextResponse.json(preview);
  } catch (error) {
    console.error("Error fetching preview:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch URL" },
      { status: 500 }
    );
  }
}
