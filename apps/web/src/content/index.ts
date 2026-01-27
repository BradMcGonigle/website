// Content types and exports
// Re-exports from Velite-generated content with explicit types

export interface Post {
  title: string;
  description: string;
  date: string;
  updated?: string;
  draft: boolean;
  tags: string[];
  metadata: {
    readingTime: number;
    wordCount: number;
  };
  content: string;
  slug: string;
  permalink: string;
}

export interface Project {
  title: string;
  description: string;
  url?: string;
  repo?: string;
  tech: string[];
  featured: boolean;
  order: number;
  content: string;
  slug: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description?: string;
  breaking: boolean;
  tags: ("feature" | "fix" | "improvement" | "breaking" | "docs")[];
  content: string;
  slug: string;
  permalink: string;
}

export interface Link {
  title: string;
  description?: string;
  url: string;
  image?: string;
  date: string;
  tags: string[];
  slug: string;
}

interface VeliteContent {
  blog: Post[];
  projects: Project[];
  changelog: ChangelogEntry[];
  links: Link[];
}

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const veliteContent: VeliteContent = require("../../.velite");

export const blog: Post[] = veliteContent.blog;
export const projects: Project[] = veliteContent.projects;
export const changelog: ChangelogEntry[] = veliteContent.changelog;
export const links: Link[] = veliteContent.links;
