# Button Component

A customizable button component with variants and sizes.

## Usage

```tsx
import { Button } from "components.button";

export function Example() {
  return (
    <>
      <Button variant="primary" size="md">
        Primary Button
      </Button>
      <Button variant="secondary" size="lg">
        Secondary Button
      </Button>
      <Button variant="outline" size="sm">
        Outline Button
      </Button>
    </>
  );
}
```

## Props

- `variant` - `"primary" | "secondary" | "outline"` (default: `"primary"`)
- `size` - `"sm" | "md" | "lg"` (default: `"md"`)
- All standard HTML button attributes are supported

## Styling

The component uses Tailwind CSS classes and follows the design system color scheme defined in the global CSS variables.
