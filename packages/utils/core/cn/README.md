# Class Name Utility (cn)

A utility for conditionally joining class names together.

## Usage

```ts
import { cn } from "utils.core.cn";

// Basic usage
const className = cn("base", "text-lg");
// Result: "base text-lg"

// Conditional classes
const isActive = true;
const className = cn("base", isActive && "active", "text-lg");
// Result: "base active text-lg"

// Filter out falsy values
const className = cn("base", undefined, null, false, "text-lg");
// Result: "base text-lg"
```

## Features

- Filters out falsy values (undefined, null, false)
- Simple and lightweight
- Framework-agnostic
- Can be replaced with clsx or classnames if more features are needed

## Type Safety

The function accepts an array of string, undefined, null, or false values, making it type-safe for conditional class name generation.

## Testing

```bash
pnpm test        # Run tests once
pnpm test:watch  # Run tests in watch mode
```
