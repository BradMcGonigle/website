# Project Instructions

## Before Committing Code

ALWAYS run these checks before creating any git commit:

1. `pnpm typecheck` - must pass with zero errors
2. `pnpm lint` - must pass with zero errors
3. `pnpm test` - all tests must pass

Do NOT commit until all checks pass. If any check fails, fix the issues first.

## Quick Check Command

```bash
pnpm typecheck && pnpm lint && pnpm test
```
