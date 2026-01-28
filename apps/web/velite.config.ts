import { defineCollection, defineConfig, s } from "velite";
import type { UserConfig } from "velite";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options } from "rehype-pretty-code";

const blog = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(999),
      date: s.isodate(),
      createdAt: s.string().datetime({ offset: true }),
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
      createdAt: s.string().datetime({ offset: true }),
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

const links = defineCollection({
  name: "Link",
  pattern: "links/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(199),
      description: s.string().max(999).optional(),
      url: s.string().url(),
      image: s.string().optional(),
      date: s.isodate(),
      createdAt: s.string().datetime({ offset: true }),
      tags: s.array(s.string()).default([]),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: meta.basename?.replace(/\.mdx$/, "") ?? "",
    })),
});

const prettyCodeOptions: Options = {
  // Use dual themes for light/dark mode support
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  // Keep background from theme
  keepBackground: false,
  // Add data attributes for styling
  defaultLang: "plaintext",
};

const config = {
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { blog, projects, changelog, links },
  mdx: {
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    remarkPlugins: [],
  },
} satisfies UserConfig;

export default defineConfig(config);
