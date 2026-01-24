# Tailwind CSS Configuration

Shared Tailwind CSS configuration for the monorepo with design system tokens.

## Usage

In your `tailwind.config.js`:

```js
const baseConfig = require("configs.tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      // Your custom extensions here
    },
  },
};
```

## Features

- Pre-configured design system colors using CSS variables
- Consistent border radius tokens
- Compatible with shadcn/ui components
- Extensible for app-specific customizations

## Design System

The configuration uses CSS variables for theming, allowing for easy light/dark mode support:

- `--background`, `--foreground` - Base colors
- `--primary`, `--secondary` - Brand colors
- `--muted`, `--accent` - UI accent colors
- `--destructive` - Error/danger states
- `--border`, `--input`, `--ring` - Form elements
- `--card`, `--popover` - Surface colors
- `--radius` - Border radius token
