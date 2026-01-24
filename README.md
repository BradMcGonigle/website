# Monorepo

A modern monorepo built with Turborepo, pnpm workspaces, and Next.js.

## Structure

- `apps/` - Applications (Next.js, etc.)
- `configs/` - Shared configuration packages (ESLint, TypeScript, Prettier, Tailwind, etc.)
- `packages/` - Shared packages (components, utilities, etc.)
- `pages/` - Portable page packages

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all apps and packages
pnpm build

# Lint
pnpm lint

# Format code
pnpm format
```

## Tech Stack

- **Build System**: Turborepo
- **Package Manager**: pnpm with workspaces
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Formatting**: Prettier

## Node Version

This project requires Node.js 22.x. Use the version specified in `.nvmrc`:

```bash
nvm use
```
