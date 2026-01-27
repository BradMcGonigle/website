import { NextRequest, NextResponse } from "next/server";

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function fetchMetadata(url: string): Promise<LinkMetadata> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; LinkBot/1.0; +https://bradmcgonigle.com)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();

  // Extract title
  const titleMatch =
    html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i) ||
    html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"[^>]*>/i) ||
    html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch?.[1]?.trim() || new URL(url).hostname;

  // Extract description
  const descMatch =
    html.match(
      /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i
    ) ||
    html.match(
      /<meta[^>]*content="([^"]*)"[^>]*property="og:description"[^>]*>/i
    ) ||
    html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
    html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
  const description = descMatch?.[1]?.trim() || "";

  // Extract OG image
  const imageMatch =
    html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
    html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i);
  let image = imageMatch?.[1]?.trim() || "";

  // Make relative URLs absolute
  if (image && !image.startsWith("http")) {
    const baseUrl = new URL(url);
    image = new URL(image, baseUrl.origin).toString();
  }

  return { title, description, image, url };
}

function generateMdxContent(
  metadata: LinkMetadata,
  tags: string[]
): string {
  const date = new Date().toISOString().split("T")[0];
  const lines = [
    "---",
    `title: "${metadata.title.replace(/"/g, '\\"')}"`,
  ];

  if (metadata.description) {
    lines.push(`description: "${metadata.description.replace(/"/g, '\\"')}"`);
  }

  lines.push(`url: ${metadata.url}`);

  if (metadata.image) {
    lines.push(`image: ${metadata.image}`);
  }

  lines.push(`date: ${date}`);

  if (tags.length > 0) {
    lines.push("tags:");
    tags.forEach((tag) => lines.push(`  - ${tag}`));
  }

  lines.push("---", "");

  return lines.join("\n");
}

async function createGitHubFile(
  filename: string,
  content: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "BradMcGonigle/website";
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token) {
    return { success: false, error: "GitHub token not configured" };
  }

  const path = `apps/web/content/links/${filename}`;
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: `Add link: ${filename.replace(".mdx", "")}`,
      content: Buffer.from(content).toString("base64"),
      branch,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error: `GitHub API error: ${error}` };
  }

  const data = (await response.json()) as { content?: { html_url?: string } };
  const url = data.content?.html_url;
  return url ? { success: true, url } : { success: true };
}

export async function POST(request: NextRequest) {
  // Verify API key
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.LINKS_API_KEY;

  if (!expectedKey) {
    return NextResponse.json(
      { error: "API key not configured on server" },
      { status: 500 }
    );
  }

  if (apiKey !== expectedKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { url?: string; tags?: string[] };
    const { url, tags = [] } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch metadata
    const metadata = await fetchMetadata(url);

    // Generate filename
    const slug = slugify(metadata.title);
    const timestamp = Date.now();
    const filename = `${slug}-${timestamp}.mdx`;

    // Generate MDX content
    const content = generateMdxContent(metadata, tags);

    // Create file on GitHub
    const result = await createGitHubFile(filename, content);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Link saved successfully",
      metadata,
      filename,
      githubUrl: result.url,
    });
  } catch (error) {
    console.error("Error saving link:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Links API - POST a URL to save a link",
    usage: {
      method: "POST",
      headers: { "x-api-key": "your-api-key" },
      body: { url: "https://example.com", tags: ["optional", "tags"] },
    },
  });
}
