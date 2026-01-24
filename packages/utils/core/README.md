# Core Utilities

Framework-agnostic utility functions for the monorepo.

## Usage

```ts
import { cn, formatCurrency, formatDate, formatNumber } from "utils.core";

// Combine class names
const className = cn("base", isActive && "active", "text-lg");

// Format currency
const price = formatCurrency(1234.56); // "$1,234.56"

// Format dates
const date = formatDate(new Date()); // "January 24, 2026"

// Format numbers
const views = formatNumber(1234567); // "1,234,567"
```

## Functions

### Class Name Utilities

- `cn(...classes)` - Conditionally join class names together

### Formatting Utilities

- `formatCurrency(amount, currency?, locale?)` - Format numbers as currency
- `formatDate(date, locale?, options?)` - Format dates with Intl.DateTimeFormat
- `formatNumber(num, locale?, options?)` - Format numbers with locale-aware separators

## Design

These utilities are designed to be:
- Framework-agnostic (no React/Vue/etc dependencies)
- Tree-shakeable
- Type-safe
- Tested (in the future)
- Minimal dependencies
