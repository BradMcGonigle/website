# Monorepo

A modern monorepo built with Turborepo, pnpm workspaces, and Next.js 16, following individual package architecture for optimal build caching and performance.

## 📁 Structure

```
website/
├── apps/
│   └── web/                          # Next.js 16 app with App Router
├── configs/
│   ├── eslint/                       # Shared ESLint configs (base, Next.js, React library)
│   ├── prettier/                     # Shared Prettier config with Tailwind plugin
│   ├── tailwind/                     # Shared Tailwind config with design tokens
│   ├── typescript/                   # Shared TypeScript configs
│   └── vitest/                       # Shared Vitest configs (base, React)
└── packages/
    ├── components/
    │   └── design-system/
    │       └── button/               # components.design-system.button
    ├── pages/
    │   └── home/                     # pages.home
    └── utils/
        └── core/
            ├── cn/                   # utils.core.cn
            └── format/               # utils.core.format
```

## 🎯 Package Architecture

### Individual Packages

Each component, utility, and page is its own package for optimal Turborepo performance:

- **Granular caching** - Only rebuild packages that changed
- **Better parallelization** - Independent packages build in parallel
- **Precise cache invalidation** - Unchanged packages stay cached

### Naming Convention

Packages follow dot notation matching their folder hierarchy:

| Folder Path | Package Name |
|-------------|--------------|
| `packages/components/design-system/button/` | `components.design-system.button` |
| `packages/utils/core/cn/` | `utils.core.cn` |
| `packages/pages/home/` | `pages.home` |

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x (see `.nvmrc`)
- pnpm 9.x

```bash
# Use correct Node version
nvm use

# Install pnpm if needed
npm install -g pnpm
```

### Installation

```bash
# Install all dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages and apps
pnpm build

# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Run tests
pnpm test

# Format code
pnpm format
```

## 🛠 Tech Stack

### Core

- **Build System**: Turborepo 2.x with remote caching support
- **Package Manager**: pnpm 9.x with workspaces and catalogs
- **Framework**: Next.js 16 with App Router and Turbopack
- **Language**: TypeScript 5.7 with strict mode
- **Styling**: Tailwind CSS 3.4 with design system tokens

### Code Quality

- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint 9 with flat config format
- **Formatting**: Prettier 3.x with Tailwind CSS plugin
- **CI/CD**: GitHub Actions for automated checks

### Design System

- CSS variables for light/dark mode theming
- Consistent border radius tokens
- shadcn/ui compatible color scheme

## 📦 Creating New Packages

### Component Package

```bash
# Create directory structure
mkdir -p packages/components/design-system/[name]/src

# Create package.json, tsconfig.json, eslint.config.mjs
# Follow existing patterns in packages/components/design-system/button/
```

### Utility Package

```bash
# Create directory structure
mkdir -p packages/utils/core/[name]/src

# Create package.json, tsconfig.json, eslint.config.mjs
# Follow existing patterns in packages/utils/core/cn/
```

### Page Package

```bash
# Create directory structure
mkdir -p packages/pages/[name]/src

# Create package.json, tsconfig.json, eslint.config.mjs
# Follow existing patterns in packages/pages/home/
```

## 🔄 CI/CD

GitHub Actions workflow runs on all PRs to `main`:

- ✅ ESLint checks
- ✅ TypeScript type checking
- ✅ Tests (Vitest)
- ✅ Build verification

All checks must pass before merging.

## 📚 Documentation

Each package includes its own README with:
- Usage examples
- API documentation
- Features and benefits

## 🎨 Design Philosophy

### Individual Packages

We use individual packages rather than grouped packages because:
1. Turborepo caches each package separately
2. Changes to one component don't rebuild unrelated components
3. Parallel builds are more efficient with many small packages
4. Clear dependency boundaries between components

### Portable Pages

Page packages (`packages/pages/*`) enable:
- Sharing complete pages across multiple apps
- Single source of truth for page implementations
- Consistent user experience across frontends
- Easy micro-frontend architecture in the future

### Shared Configs

Centralized configs (`configs/*`) ensure:
- Consistent code style across all packages
- Easy updates to linting/formatting rules
- Type safety with shared TypeScript configs
- Single dependency management via pnpm catalogs

## 🧪 Testing

Tests use [Vitest](https://vitest.dev/) with shared configs from `configs/vitest/`.

```bash
# Run all tests
pnpm test

# Run tests in watch mode (per-package)
cd packages/utils/core/cn && pnpm test:watch
```

### Test Structure

Each testable package includes:
- `vitest.config.ts` - Extends shared config
- `src/*.test.ts(x)` - Test files colocated with source

### Shared Configs

| Config | Environment | Use Case |
|--------|-------------|----------|
| `configs.vitest` | Node | Utility packages |
| `configs.vitest/react` | jsdom | React components |

React component tests use `@testing-library/react` for accessible, behavior-focused testing.

## 🔮 Future Plans

- Set up shadcn/ui components
- Add more page packages (about, contact, etc.)
- Consider additional apps (blog, portfolio, etc.)
- Explore other frameworks (Vue, Svelte) in component packages
