# Project Instructions

## Before Committing Code

ALWAYS run these checks before creating any git commit:

1. `pnpm typecheck` - must pass with zero errors
2. `pnpm lint` - must pass with zero errors
3. `pnpm test` - all tests must pass
4. `pnpm test:e2e` - all tests must pass

Do NOT commit until all checks pass. If any check fails, fix the issues first.

## Quick Check Command

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e
```

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
