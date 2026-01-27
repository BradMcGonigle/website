const baseConfig = require("configs.tailwind");
const typography = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Component packages - explicitly list to avoid node_modules scanning
    "../../packages/components/design-system/*/src/**/*.{ts,tsx}",
    "../../packages/components/layout/*/src/**/*.{ts,tsx}",
    "../../packages/components/content/*/src/**/*.{ts,tsx}",
    // Page packages
    "../../packages/pages/*/src/**/*.{ts,tsx}",
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
      typography: {
        DEFAULT: {
          css: {
            // Use CSS variables from design system for theme consistency
            "--tw-prose-body": "hsl(var(--foreground))",
            "--tw-prose-headings": "hsl(var(--foreground))",
            "--tw-prose-lead": "hsl(var(--muted-foreground))",
            "--tw-prose-links": "hsl(var(--primary))",
            "--tw-prose-bold": "hsl(var(--foreground))",
            "--tw-prose-counters": "hsl(var(--muted-foreground))",
            "--tw-prose-bullets": "hsl(var(--muted-foreground))",
            "--tw-prose-hr": "hsl(var(--border))",
            "--tw-prose-quotes": "hsl(var(--foreground))",
            "--tw-prose-quote-borders": "hsl(var(--border))",
            "--tw-prose-captions": "hsl(var(--muted-foreground))",
            "--tw-prose-code": "hsl(var(--foreground))",
            "--tw-prose-pre-code": "hsl(var(--foreground))",
            "--tw-prose-pre-bg": "hsl(var(--muted))",
            "--tw-prose-th-borders": "hsl(var(--border))",
            "--tw-prose-td-borders": "hsl(var(--border))",
            // Invert colors automatically handled by CSS variables in .dark class
            "--tw-prose-invert-body": "hsl(var(--foreground))",
            "--tw-prose-invert-headings": "hsl(var(--foreground))",
            "--tw-prose-invert-lead": "hsl(var(--muted-foreground))",
            "--tw-prose-invert-links": "hsl(var(--primary))",
            "--tw-prose-invert-bold": "hsl(var(--foreground))",
            "--tw-prose-invert-counters": "hsl(var(--muted-foreground))",
            "--tw-prose-invert-bullets": "hsl(var(--muted-foreground))",
            "--tw-prose-invert-hr": "hsl(var(--border))",
            "--tw-prose-invert-quotes": "hsl(var(--foreground))",
            "--tw-prose-invert-quote-borders": "hsl(var(--border))",
            "--tw-prose-invert-captions": "hsl(var(--muted-foreground))",
            "--tw-prose-invert-code": "hsl(var(--foreground))",
            "--tw-prose-invert-pre-code": "hsl(var(--foreground))",
            "--tw-prose-invert-pre-bg": "hsl(var(--muted))",
            "--tw-prose-invert-th-borders": "hsl(var(--border))",
            "--tw-prose-invert-td-borders": "hsl(var(--border))",
            maxWidth: "none",
            // Link styling
            a: {
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              fontWeight: "500",
              "&:hover": {
                opacity: "0.8",
              },
            },
            // Inline code styling
            code: {
              backgroundColor: "hsl(var(--muted))",
              padding: "0.125rem 0.375rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            // Don't style code inside pre (handled by rehype-pretty-code)
            "pre code": {
              backgroundColor: "transparent",
              padding: "0",
              borderRadius: "0",
            },
          },
        },
      },
    },
  },
  plugins: [...(baseConfig.plugins || []), typography],
};
