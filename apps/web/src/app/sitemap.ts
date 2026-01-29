import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { blog, changelog } from "#content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/links`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${site.url}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blog
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.updated ? new Date(post.updated) : new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const changelogPages: MetadataRoute.Sitemap = changelog.map((entry) => ({
    url: `${site.url}/changelog/${entry.slug}`,
    lastModified: new Date(entry.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...blogPages, ...changelogPages];
}
