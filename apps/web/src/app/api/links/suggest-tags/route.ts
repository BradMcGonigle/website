import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  checkRateLimit,
  RATE_LIMITS,
  isValidApiKeyFromRequest,
} from "@/lib/security";

interface RequestBody {
  url?: string;
  title?: string;
  description?: string;
}

// Common tags from existing links, ordered by frequency
const EXISTING_TAGS = [
  "development",
  "design",
  "css",
  "apple",
  "react",
  "javascript",
  "ios",
  "photography",
  "animation",
  "typography",
  "ux",
  "shortcuts",
  "history",
  "apps",
  "privacy",
  "ai",
  "ui",
  "tools",
  "svg",
  "react-native",
  "macos",
  "iphone",
  "icons",
  "gatsbyjs",
  "gaming",
  "frontend",
  "sports",
  "safari",
  "progressive-web-apps",
  "movies",
  "ipad",
  "internet-of-things",
  "emoji",
  "accessibility",
  "typescript",
  "nextjs",
  "tailwind",
  "web",
  "performance",
  "security",
  "testing",
  "video",
  "music",
  "home-automation",
  "homekit",
  "smart-home",
];

function getClientIdentifier(request: NextRequest): string {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return `apikey:${authHeader.slice(7).slice(0, 8)}`;
  }
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `ip:${ip}`;
}

export async function POST(request: NextRequest) {
  if (!isValidApiKeyFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting (use same limits as preview)
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Tag suggestions are not configured" },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as RequestBody;
    const { url, title, description } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required for tag suggestions" },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });

    const prompt = `You are a helpful assistant that suggests tags for a links page on a personal website. The website owner saves interesting links about web development, design, Apple products, and technology.

Given the following link information, suggest 2-5 relevant tags from the existing vocabulary. You may also suggest 1-2 new tags if the content clearly warrants it, but prefer using existing tags when possible.

EXISTING TAGS (prefer these):
${EXISTING_TAGS.join(", ")}

LINK INFORMATION:
Title: ${title}
${description ? `Description: ${description}` : ""}
${url ? `URL: ${url}` : ""}

Respond with ONLY a JSON array of tag strings, nothing else. Example: ["development", "react", "typescript"]

Important:
- Use lowercase for all tags
- Use hyphens for multi-word tags (e.g., "react-native" not "react native")
- Be specific but not too granular
- Suggest tags that would help organize and find this link later`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract the text content from the response
    const textContent = message.content.find((block) => block.type === "text");
    if (textContent?.type !== "text") {
      return NextResponse.json(
        { error: "Failed to generate tag suggestions" },
        { status: 500 }
      );
    }

    // Parse the JSON array from the response
    const responseText = textContent.text.trim();
    let suggestedTags: string[];

    try {
      suggestedTags = JSON.parse(responseText) as string[];
      if (!Array.isArray(suggestedTags)) {
        throw new Error("Response is not an array");
      }
      // Ensure all tags are strings and lowercase
      suggestedTags = suggestedTags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.toLowerCase().trim())
        .filter((tag) => tag.length > 0);
    } catch {
      // If JSON parsing fails, try to extract tags from the text
      const match = /\[([^\]]+)\]/.exec(responseText);
      if (match?.[1]) {
        suggestedTags = match[1]
          .split(",")
          .map((tag) =>
            tag
              .trim()
              .replace(/['"]/g, "")
              .toLowerCase()
          )
          .filter((tag) => tag.length > 0);
      } else {
        return NextResponse.json(
          { error: "Failed to parse tag suggestions" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      tags: suggestedTags,
      existingTags: EXISTING_TAGS,
    });
  } catch (error) {
    console.error("Tag suggestion error:", error);
    return NextResponse.json(
      { error: "Failed to generate tag suggestions" },
      { status: 500 }
    );
  }
}
