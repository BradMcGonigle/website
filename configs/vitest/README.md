# Vitest Configuration

Shared Vitest configurations for the monorepo.

## Configs

### Base Config (Node)

For utility packages that don't need DOM/React:

```ts
// vitest.config.ts
import baseConfig from "configs.vitest";
import { mergeConfig } from "vitest/config";

export default mergeConfig(baseConfig, {});
```

### React Config (jsdom)

For React component packages:

```ts
// vitest.config.ts
import reactConfig from "configs.vitest/react";
import { mergeConfig } from "vitest/config";

export default mergeConfig(reactConfig, {});
```

Also requires a setup file:

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

## Features

- Globals enabled (`describe`, `it`, `expect` without imports)
- Test files colocated with source (`src/**/*.test.{ts,tsx}`)
- V8 coverage provider
- jsdom environment for React tests

## Package Dependencies

Add to your package's `devDependencies`:

**For utility packages:**
```json
{
  "configs.vitest": "workspace:*",
  "vitest": "catalog:"
}
```

**For React packages:**
```json
{
  "@testing-library/dom": "catalog:",
  "@testing-library/jest-dom": "catalog:",
  "@testing-library/react": "catalog:",
  "configs.vitest": "workspace:*",
  "jsdom": "catalog:",
  "vitest": "catalog:"
}
```

## Scripts

Add to your package's `scripts`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```
