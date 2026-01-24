# Prettier Configuration

Shared Prettier configuration for the monorepo with Tailwind CSS support.

## Usage

Create `.prettierrc.mjs` in your package:

```js
export { default } from "configs.prettier";
```

Or extend it with custom options:

```js
import baseConfig from "configs.prettier";

export default {
  ...baseConfig,
  printWidth: 100,
};
```

## Features

- Tailwind CSS class sorting
- Consistent code formatting across the monorepo
- Configured for TypeScript, React, and Next.js
