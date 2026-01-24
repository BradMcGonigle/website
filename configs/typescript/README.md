# TypeScript Configurations

Shared TypeScript configurations for the monorepo.

## Configurations

- `tsconfig.base.json` - Base configuration with strict type checking
- `tsconfig.nextjs.json` - Configuration for Next.js applications
- `tsconfig.react-library.json` - Configuration for React component libraries

## Usage

In your package's `tsconfig.json`:

```json
{
  "extends": "configs.typescript/tsconfig.nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```
