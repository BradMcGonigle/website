# ESLint Configurations

Shared ESLint configurations for the monorepo using the modern flat config format.

## Configurations

- `base.mjs` - Base configuration with TypeScript and Prettier support
- `nextjs.mjs` - Configuration for Next.js applications
- `react-library.mjs` - Configuration for React component libraries

## Usage

### For Next.js Apps

Create `eslint.config.mjs` in your app:

```js
import config from "configs.eslint/nextjs.mjs";

export default config;
```

### For React Libraries

Create `eslint.config.mjs` in your package:

```js
import config from "configs.eslint/react-library.mjs";

export default config;
```

## Features

- TypeScript support with strict type checking
- React and React Hooks support
- Prettier integration
- Consistent type imports
- Unused variable detection
- Modern ESLint flat config format
