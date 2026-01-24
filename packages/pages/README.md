# Pages

Portable page packages that can be shared across multiple applications.

## Concept

This directory contains packages that represent complete pages or page sections. The goal is to create portable, reusable pages that can be imported into multiple apps (web, blog, portfolio, etc.).

## Structure

Each page package follows this structure:

```
pages/
  ├── home/
  │   ├── package.json
  │   ├── src/
  │   │   ├── index.tsx        # Main page component
  │   │   ├── sections/        # Page sections
  │   │   └── hooks/           # Page-specific hooks
  │   └── README.md
  └── about/
      └── ...
```

## Usage

### In a Next.js App

```tsx
// app/page.tsx
import { HomePage } from "pages.home";

export default function Page() {
  return <HomePage />;
}
```

## Benefits

1. **Portability** - Pages can be shared across multiple apps
2. **Consistency** - Same page implementation across different frontends
3. **Maintainability** - Single source of truth for page logic
4. **Flexibility** - Apps can override or extend page behavior as needed

## Future Considerations

- Server Components vs Client Components
- Data fetching patterns (RSC, SWR, React Query)
- Page-level state management
- SEO and metadata handling
- Internationalization

## Alternative Approach

If this structure doesn't work well in practice, consider:
- Moving pages directly into apps (more traditional)
- Creating smaller, composable section components in `packages/components`
- Using a hybrid approach where only certain pages are shared

The structure is flexible and can evolve based on actual usage patterns.
