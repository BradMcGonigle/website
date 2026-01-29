# Project Instructions

## Before Committing Code

Run these checks before creating any git commit:

1. `pnpm typecheck` - must pass with zero errors
2. `pnpm lint` - must pass with zero errors
3. `pnpm test` - all tests must pass
4. `pnpm test:e2e` - all tests must pass

Do NOT commit until all checks pass. If any check fails, fix the issues first.

### Content-Only Changes

Skip all checks when committing changes that ONLY touch content files in `apps/web/content/` (blog posts, changelog entries, links, projects). These are MDX files that don't affect code quality checks.

Content-only commits can be made directly without running typecheck, lint, or tests.

## Quick Check Command

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e
```

## Creating New Packages

When creating a new package in `packages/` that uses Tailwind CSS classes, add its path to `apps/web/tailwind.config.js` in the `content` array. Otherwise, Tailwind won't scan the package for classes and they won't be generated.

Example pattern: `"../../packages/components/my-package/src/**/*.{ts,tsx}"`

## Changelog

Update the changelog when making meaningful changes to the site. Not every change needs an entry.

### When to Add a Changelog Entry

Add entries for:

- New features or pages
- Significant UI/UX improvements
- Breaking changes
- Notable bug fixes that affected users
- Major dependency updates or architectural changes

Skip entries for:

- Minor bug fixes or typos
- Code refactoring with no visible changes (unless they are particularly interesting)
- Test updates
- Documentation updates (unless they're new docs features)

### Changelog Format

Entries are MDX files in `apps/web/content/changelog/` named `v{version}.mdx`.

Frontmatter structure:

```yaml
---
version: "X.Y.Z"
date: YYYY-MM-DD
createdAt: YYYY-MM-DDTHH:MM:SS.000Z
title: Short descriptive title
description: One sentence summary of the changes
tags:
  - feature | fix | improvement | breaking | docs
---
```

Version guidelines:

- Increment MAJOR for breaking changes
- Increment MINOR for new features
- Increment PATCH for fixes and improvements

Check the latest version in `apps/web/content/changelog/` before creating a new entry.
