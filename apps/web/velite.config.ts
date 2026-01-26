import { defineCollection, defineConfig, s } from "velite";
import type { UserConfig } from "velite";

const blog = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(999),
      date: s.isodate(),
      updated: s.isodate().optional(),
      draft: s.boolean().default(false),
      tags: s.array(s.string()).default([]),
      metadata: s.metadata(),
      content: s.mdx(),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: meta.basename?.replace(/\.mdx$/, "") ?? "",
      permalink: `/blog/${meta.basename?.replace(/\.mdx$/, "") ?? ""}`,
    })),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(999),
      url: s.string().url().optional(),
      repo: s.string().url().optional(),
      tech: s.array(s.string()).default([]),
      featured: s.boolean().default(false),
      order: s.number().default(0),
      content: s.mdx(),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: meta.basename?.replace(/\.mdx$/, "") ?? "",
    })),
});

const changelog = defineCollection({
  name: "ChangelogEntry",
  pattern: "changelog/**/*.mdx",
  schema: s
    .object({
      version: s.string(),
      date: s.isodate(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      breaking: s.boolean().default(false),
      tags: s
        .array(s.enum(["feature", "fix", "improvement", "breaking", "docs"]))
        .default([]),
      content: s.mdx(),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: meta.basename?.replace(/\.mdx$/, "") ?? "",
      permalink: `/changelog/${meta.basename?.replace(/\.mdx$/, "") ?? ""}`,
    })),
});

const config = {
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { blog, projects, changelog },
  mdx: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
} satisfies UserConfig;

export default defineConfig(config);
