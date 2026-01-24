# Design System Components

Shared design system components for the monorepo.

## Usage

```tsx
import { Button } from "components.design-system";

export function Example() {
  return <Button variant="primary">Click me</Button>;
}
```

## Components

- `Button` - A customizable button component with variants and sizes

## Future

This package will house:
- shadcn/ui components
- Custom design system components
- Shared UI primitives

The structure is designed to be framework-agnostic where possible, making it easier to potentially support Vue, Svelte, or other frameworks in the future.
