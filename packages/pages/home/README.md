# Home Page

The home page component for the monorepo website.

## Usage

### In a Next.js App

```tsx
// app/page.tsx
import HomePage from "pages.home";

export default HomePage;
```

Or with a wrapper:

```tsx
// app/page.tsx
import HomePage from "pages.home";

export default function Page() {
  return <HomePage />;
}
```

## Features

- Responsive centered layout
- Welcome message with monorepo description
- Uses Tailwind CSS for styling
- Server Component compatible (Next.js App Router)

## Customization

This page can be customized by:
- Modifying the content directly in the package
- Wrapping it with additional layout/data in your app
- Passing props (if extended to accept them)

## Testing

```bash
pnpm test        # Run tests once
pnpm test:watch  # Run tests in watch mode
```
