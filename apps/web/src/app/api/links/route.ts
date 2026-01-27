import { NextRequest, NextResponse } from "next/server";

interface SaveLinkRequest {
  url: string;
  title: string;
  description?: string;
  image?: string | null; // URL or base64 data URI
  tags?: string[];
  apiKey?: string; // Can be in body or header
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function downloadImage(
  imageSource: string
): Promise<{ data: string; extension: string } | null> {
  try {
    // Handle base64 data URIs (from screenshots)
    if (imageSource.startsWith("data:")) {
      const match = imageSource.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match && match[1] && match[2]) {
        return { data: match[2], extension: match[1] };
      }
      return null;
    }

    // Download image from URL
    const response = await fetch(imageSource, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Failed to download image: ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.split("/")[1]?.split(";")[0] || "jpg";
    const arrayBuffer = await response.arrayBuffer();
    const data = Buffer.from(arrayBuffer).toString("base64");

    return { data, extension };
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
}

async function createGitHubFile(
  path: string,
  content: string,
  message: string,
  isBase64 = false
): Promise<{ success: boolean; url?: string; error?: string }> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "BradMcGonigle/website";
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token) {
    return { success: false, error: "GitHub token not configured" };
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message,
      content: isBase64 ? content : Buffer.from(content).toString("base64"),
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

function generateMdxContent(
  url: string,
  title: string,
  description: string,
  imagePath: string | null,
  tags: string[]
): string {
  const date = new Date().toISOString().split("T")[0];
  const lines = ["---", `title: "${title.replace(/"/g, '\\"')}"`];

  if (description) {
    lines.push(`description: "${description.replace(/"/g, '\\"')}"`);
  }

  lines.push(`url: ${url}`);

  if (imagePath) {
    lines.push(`image: ${imagePath}`);
  }

  lines.push(`date: ${date}`);

  if (tags.length > 0) {
    lines.push("tags:");
    tags.forEach((tag) => lines.push(`  - ${tag}`));
  }

  lines.push("---", "");

  return lines.join("\n");
}

export async function POST(request: NextRequest) {
  // Verify API key - accept from header or body
  const headerApiKey = request.headers.get("x-api-key");
  const body = (await request.json()) as SaveLinkRequest;
  const apiKey = headerApiKey || body.apiKey;
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
    const { url, title, description = "", image, tags = [] } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Generate slug and timestamp for unique filenames
    const slug = slugify(title);
    const timestamp = Date.now();
    let imagePath: string | null = null;

    // Process image if provided
    if (image) {
      const imageData = await downloadImage(image);
      if (imageData) {
        const imageFilename = `${slug}-${timestamp}.${imageData.extension}`;
        const imageGitPath = `apps/web/public/images/links/${imageFilename}`;

        const imageResult = await createGitHubFile(
          imageGitPath,
          imageData.data,
          `Add image for link: ${slug}`,
          true // Already base64 encoded
        );

        if (imageResult.success) {
          imagePath = `/images/links/${imageFilename}`;
        } else {
          console.error("Failed to upload image:", imageResult.error);
          // Continue without image rather than failing entirely
        }
      }
    }

    // Generate MDX content with local image path
    const mdxContent = generateMdxContent(
      url,
      title,
      description,
      imagePath,
      tags
    );
    const mdxFilename = `${slug}-${timestamp}.mdx`;
    const mdxPath = `apps/web/content/links/${mdxFilename}`;

    // Create MDX file on GitHub
    const result = await createGitHubFile(
      mdxPath,
      mdxContent,
      `Add link: ${title}`
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Link saved successfully",
      filename: mdxFilename,
      imagePath,
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
    message: "Links API - POST to save a link",
    usage: {
      method: "POST",
      headers: { "x-api-key": "your-api-key" },
      body: {
        url: "https://example.com",
        title: "Page Title",
        description: "Optional description",
        image: "https://example.com/image.jpg or data:image/jpeg;base64,...",
        tags: ["optional", "tags"],
      },
    },
  });
}
