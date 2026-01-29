import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface PageMetadata {
  title: string;
  description: string;
  images: string[];
  url: string;
}

interface RequestBody {
  url?: string;
}

interface YouTubeOEmbedResponse {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
}

function isValidApiKey(request: NextRequest): boolean {
  const apiKey = process.env.LINKS_API_KEY;
  if (!apiKey) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  return authHeader.slice(7) === apiKey;
}

export async function POST(request: NextRequest) {
  if (!isValidApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as RequestBody;
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // For YouTube URLs, use oEmbed API for better metadata
    if (isYouTubeUrl(parsedUrl)) {
      const metadata = await fetchYouTubeMetadata(parsedUrl);
      return NextResponse.json(metadata);
    }

    // Fetch the page
    const response = await fetch(parsedUrl.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LinkPreview/1.0; +https://bradmcgonigle.com)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const metadata = extractMetadata(html, parsedUrl);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch preview" },
      { status: 500 }
    );
  }
}

async function fetchYouTubeMetadata(url: URL): Promise<PageMetadata> {
  const videoId = extractYouTubeVideoId(url);
  const images = videoId ? getYouTubeThumbnails(videoId) : [];

  // Use YouTube oEmbed API to get video title and author
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url.href)}&format=json`;

  try {
    const response = await fetch(oembedUrl);
    if (response.ok) {
      const data = (await response.json()) as YouTubeOEmbedResponse;
      return {
        title: data.title ?? "",
        description: data.author_name ? `By ${data.author_name}` : "",
        images,
        url: url.href,
      };
    }
  } catch {
    // Fall through to default response
  }

  // Fallback if oEmbed fails
  return {
    title: "",
    description: "",
    images,
    url: url.href,
  };
}

function extractMetadata(html: string, baseUrl: URL): PageMetadata {
  const images: string[] = [];

  // Extract title
  const ogTitle = getMetaContent(html, 'property="og:title"');
  const twitterTitle = getMetaContent(html, 'name="twitter:title"');
  const titleRegex = /<title[^>]*>([^<]*)<\/title>/i;
  const titleMatch = titleRegex.exec(html);
  const titleTag = titleMatch?.[1] ?? null;
  const title = ogTitle ?? twitterTitle ?? titleTag ?? "";

  // Extract description
  const ogDescription = getMetaContent(html, 'property="og:description"');
  const twitterDescription = getMetaContent(html, 'name="twitter:description"');
  const metaDescription = getMetaContent(html, 'name="description"');
  const description =
    ogDescription ?? twitterDescription ?? metaDescription ?? "";

  // Extract OG image
  const ogImage = getMetaContent(html, 'property="og:image"');
  if (ogImage) {
    images.push(resolveUrl(ogImage, baseUrl));
  }

  // Extract Twitter image
  const twitterImage = getMetaContent(html, 'name="twitter:image"');
  if (twitterImage && twitterImage !== ogImage) {
    images.push(resolveUrl(twitterImage, baseUrl));
  }

  // Extract other images from the page (limit to first 10)
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null && images.length < 12) {
    const src = match[1];
    // Skip data URLs, tiny images, and tracking pixels
    if (
      src &&
      !src.startsWith("data:") &&
      !src.includes("tracking") &&
      !src.includes("pixel") &&
      !src.includes("1x1")
    ) {
      const resolvedSrc = resolveUrl(src, baseUrl);
      if (!images.includes(resolvedSrc)) {
        images.push(resolvedSrc);
      }
    }
  }

  return {
    title: decodeHtmlEntities(title.trim()),
    description: decodeHtmlEntities(description.trim()),
    images,
    url: baseUrl.href,
  };
}

function getMetaContent(html: string, attr: string): string | null {
  const regex = new RegExp(
    `<meta[^>]+${attr}[^>]+content=["']([^"']*)["']`,
    "i"
  );
  const altRegex = new RegExp(
    `<meta[^>]+content=["']([^"']*)[^>]+${attr}`,
    "i"
  );
  const match = regex.exec(html);
  const altMatch = altRegex.exec(html);
  return match?.[1] ?? altMatch?.[1] ?? null;
}

function resolveUrl(url: string, base: URL): string {
  try {
    return new URL(url, base.href).href;
  } catch {
    return url;
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function isYouTubeUrl(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();
  return (
    hostname === "youtube.com" ||
    hostname === "www.youtube.com" ||
    hostname === "youtu.be" ||
    hostname === "m.youtube.com"
  );
}

function extractYouTubeVideoId(url: URL): string | null {
  const hostname = url.hostname.toLowerCase();

  // Handle youtu.be short URLs
  if (hostname === "youtu.be") {
    const videoId = url.pathname.slice(1).split("/")[0];
    if (!videoId) return null;
    return videoId;
  }

  // Handle youtube.com URLs
  if (
    hostname === "youtube.com" ||
    hostname === "www.youtube.com" ||
    hostname === "m.youtube.com"
  ) {
    // /watch?v=VIDEO_ID
    const vParam = url.searchParams.get("v");
    if (vParam) {
      return vParam;
    }

    // /embed/VIDEO_ID or /v/VIDEO_ID
    const pathMatch = /^\/(embed|v)\/([^/?]+)/.exec(url.pathname);
    if (pathMatch?.[2]) {
      return pathMatch[2];
    }

    // /shorts/VIDEO_ID
    const shortsMatch = /^\/shorts\/([^/?]+)/.exec(url.pathname);
    if (shortsMatch?.[1]) {
      return shortsMatch[1];
    }
  }

  return null;
}

function getYouTubeThumbnails(videoId: string): string[] {
  // Return multiple thumbnail options in order of quality (highest first)
  return [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
  ];
}
