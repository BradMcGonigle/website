import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  validateUrlForSSRF,
  checkRateLimit,
  RATE_LIMITS,
  REQUEST_TIMEOUT,
  isValidApiKeyFromRequest,
} from "@/lib/security";

interface PageMetadata {
  title: string;
  description: string;
  images: string[];
  url: string;
}

interface RequestBody {
  url?: string;
}


function getClientIdentifier(request: NextRequest): string {
  // Use API key as identifier since all requests are authenticated
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return `apikey:${authHeader.slice(7).slice(0, 8)}`; // Use first 8 chars
  }
  // Fallback to IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `ip:${ip}`;
}

export async function POST(request: NextRequest) {
  if (!isValidApiKeyFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(clientId, RATE_LIMITS.preview);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter ?? 60),
        },
      }
    );
  }

  try {
    const body = (await request.json()) as RequestBody;
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // SSRF protection: validate URL before fetching
    const urlValidation = validateUrlForSSRF(url);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { error: urlValidation.error ?? "Invalid URL" },
        { status: 400 }
      );
    }

    // Parse URL after validation
    const parsedUrl = new URL(url);

    // Fetch the page with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(parsedUrl.href, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; LinkPreview/1.0; +https://bradmcgonigle.com)",
        },
        signal: controller.signal,
        redirect: "follow",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch URL: ${response.status}` },
          { status: 400 }
        );
      }

      // Check final URL after redirects for SSRF
      const finalUrl = new URL(response.url);
      const finalUrlValidation = validateUrlForSSRF(finalUrl.href);
      if (!finalUrlValidation.isValid) {
        return NextResponse.json(
          { error: "Redirected to disallowed URL" },
          { status: 400 }
        );
      }

      const html = await response.text();
      const metadata = extractMetadata(html, finalUrl);

      return NextResponse.json(metadata);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timed out" },
          { status: 408 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch preview" },
      { status: 500 }
    );
  }
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
    const resolvedOgImage = resolveUrl(ogImage, baseUrl);
    // Validate image URLs for SSRF as well
    if (resolvedOgImage && validateUrlForSSRF(resolvedOgImage).isValid) {
      images.push(resolvedOgImage);
    }
  }

  // Extract Twitter image
  const twitterImage = getMetaContent(html, 'name="twitter:image"');
  if (twitterImage && twitterImage !== ogImage) {
    const resolvedTwitterImage = resolveUrl(twitterImage, baseUrl);
    if (resolvedTwitterImage && validateUrlForSSRF(resolvedTwitterImage).isValid) {
      images.push(resolvedTwitterImage);
    }
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
      // Validate each image URL for SSRF
      if (
        resolvedSrc &&
        !images.includes(resolvedSrc) &&
        validateUrlForSSRF(resolvedSrc).isValid
      ) {
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
