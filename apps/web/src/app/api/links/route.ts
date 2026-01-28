import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface LinkData {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  tags?: string[];
}

interface GitHubRepoResponse {
  default_branch: string;
}

interface GitHubRefResponse {
  object: {
    sha: string;
  };
}

interface GitHubCommitResponse {
  tree: {
    sha: string;
  };
}

interface GitHubBlobResponse {
  sha: string;
}

interface GitHubTreeResponse {
  sha: string;
}

interface GitHubNewCommitResponse {
  sha: string;
}

interface FileToCommit {
  path: string;
  content: string | Buffer;
}

function isValidApiKey(request: NextRequest): boolean {
  const apiKey = process.env.LINKS_API_KEY;
  if (!apiKey) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  return authHeader.slice(7) === apiKey;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function generateMdxContent(data: LinkData, imagePath?: string): string {
  const date = new Date().toISOString().split("T")[0];
  const tags = data.tags && data.tags.length > 0 ? data.tags : [];

  let frontmatter = `---
title: "${data.title.replace(/"/g, '\\"')}"`;

  if (data.description) {
    frontmatter += `
description: "${data.description.replace(/"/g, '\\"')}"`;
  }

  frontmatter += `
url: ${data.url}`;

  if (imagePath) {
    frontmatter += `
image: ${imagePath}`;
  }

  frontmatter += `
date: ${date}`;

  if (tags.length > 0) {
    frontmatter += `
tags:
${tags.map((tag) => `  - ${tag}`).join("\n")}`;
  }

  frontmatter += `
---
`;

  return frontmatter;
}

async function downloadImage(imageUrl: string): Promise<Buffer | null> {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LinkSaver/1.0; +https://bradmcgonigle.com)",
      },
    });

    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

function getImageExtension(url: string, contentType?: string): string {
  // Try to get from content type
  if (contentType) {
    const regex = /image\/(jpeg|jpg|png|gif|webp|svg)/i;
    const match = regex.exec(contentType);
    if (match?.[1]) {
      return match[1] === "jpeg" ? "jpg" : match[1];
    }
  }

  // Try to get from URL
  const urlRegex = /\.(jpeg|jpg|png|gif|webp|svg)(\?|$)/i;
  const urlMatch = urlRegex.exec(url);
  if (urlMatch?.[1]) {
    return urlMatch[1].toLowerCase();
  }

  // Default to jpg
  return "jpg";
}

async function commitToGitHub(
  files: FileToCommit[],
  message: string
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? "BradMcGonigle/website";

  if (!token) {
    throw new Error("GITHUB_TOKEN is required");
  }

  const [owner, repoName] = repo.split("/");
  const baseUrl = `https://api.github.com/repos/${owner}/${repoName}`;

  // Get the default branch
  const repoResponse = await fetch(baseUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!repoResponse.ok) {
    throw new Error(`Failed to get repo info: ${repoResponse.status}`);
  }

  const repoInfo = (await repoResponse.json()) as GitHubRepoResponse;
  const defaultBranch = repoInfo.default_branch;

  // Get the latest commit SHA
  const refResponse = await fetch(`${baseUrl}/git/ref/heads/${defaultBranch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!refResponse.ok) {
    throw new Error(`Failed to get ref: ${refResponse.status}`);
  }

  const refData = (await refResponse.json()) as GitHubRefResponse;
  const latestCommitSha = refData.object.sha;

  // Get the tree SHA
  const commitResponse = await fetch(
    `${baseUrl}/git/commits/${latestCommitSha}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!commitResponse.ok) {
    throw new Error(`Failed to get commit: ${commitResponse.status}`);
  }

  const commitData = (await commitResponse.json()) as GitHubCommitResponse;
  const treeSha = commitData.tree.sha;

  // Create blobs for each file
  const treeItems = await Promise.all(
    files.map(async (file) => {
      const isBuffer = Buffer.isBuffer(file.content);
      const blobResponse = await fetch(`${baseUrl}/git/blobs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: isBuffer
            ? (file.content as Buffer).toString("base64")
            : file.content,
          encoding: isBuffer ? "base64" : "utf-8",
        }),
      });

      if (!blobResponse.ok) {
        throw new Error(`Failed to create blob: ${blobResponse.status}`);
      }

      const blobData = (await blobResponse.json()) as GitHubBlobResponse;
      return {
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blobData.sha,
      };
    })
  );

  // Create a new tree
  const newTreeResponse = await fetch(`${baseUrl}/git/trees`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base_tree: treeSha,
      tree: treeItems,
    }),
  });

  if (!newTreeResponse.ok) {
    throw new Error(`Failed to create tree: ${newTreeResponse.status}`);
  }

  const newTreeData = (await newTreeResponse.json()) as GitHubTreeResponse;

  // Create a new commit
  const newCommitResponse = await fetch(`${baseUrl}/git/commits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      tree: newTreeData.sha,
      parents: [latestCommitSha],
    }),
  });

  if (!newCommitResponse.ok) {
    throw new Error(`Failed to create commit: ${newCommitResponse.status}`);
  }

  const newCommitData =
    (await newCommitResponse.json()) as GitHubNewCommitResponse;

  // Update the ref
  const updateRefResponse = await fetch(
    `${baseUrl}/git/refs/heads/${defaultBranch}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sha: newCommitData.sha,
      }),
    }
  );

  if (!updateRefResponse.ok) {
    throw new Error(`Failed to update ref: ${updateRefResponse.status}`);
  }
}

export async function POST(request: NextRequest) {
  if (!isValidApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = (await request.json()) as LinkData;

    if (!data.title || !data.url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(data.title);
    const timestamp = Date.now();
    const uniqueSlug = `${slug}-${timestamp}`;

    const files: FileToCommit[] = [];
    let imagePath: string | undefined;

    // Download and save image if provided
    if (data.imageUrl) {
      const imageBuffer = await downloadImage(data.imageUrl);
      if (imageBuffer) {
        const ext = getImageExtension(data.imageUrl);
        const imageFileName = `${uniqueSlug}.${ext}`;
        imagePath = `/images/links/${imageFileName}`;

        files.push({
          path: `apps/web/public/images/links/${imageFileName}`,
          content: imageBuffer,
        });
      }
    }

    // Generate MDX content
    const mdxContent = generateMdxContent(data, imagePath);
    files.push({
      path: `apps/web/content/links/${uniqueSlug}.mdx`,
      content: mdxContent,
    });

    // Commit to GitHub
    await commitToGitHub(files, `feat: add link - ${data.title}`);

    return NextResponse.json({
      success: true,
      slug: uniqueSlug,
      message: "Link saved successfully",
    });
  } catch (error) {
    console.error("Save link error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save link",
      },
      { status: 500 }
    );
  }
}
