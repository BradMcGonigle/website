# Formatting Utilities

Framework-agnostic formatting utilities for currency, dates, and numbers.

## Usage

### Format Currency

```ts
import { formatCurrency } from "utils.core.format";

const price = formatCurrency(1234.56);
// Result: "$1,234.56"

const euroPrice = formatCurrency(1234.56, "EUR", "de-DE");
// Result: "1.234,56 €"
```

### Format Date

```ts
import { formatDate } from "utils.core.format";

const date = formatDate(new Date());
// Result: "January 24, 2026"

const shortDate = formatDate(new Date(), "en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
// Result: "Jan 24, 2026"
```

### Format Number

```ts
import { formatNumber } from "utils.core.format";

const views = formatNumber(1234567);
// Result: "1,234,567"

const percent = formatNumber(0.1234, "en-US", {
  style: "percent",
  minimumFractionDigits: 2,
});
// Result: "12.34%"
```

## Features

- Uses native Intl API for locale-aware formatting
- Framework-agnostic
- Type-safe
- No external dependencies
- Tree-shakeable

## API

### `formatCurrency(amount, currency?, locale?)`

- `amount` (number): The amount to format
- `currency` (string, optional): Currency code (default: "USD")
- `locale` (string, optional): Locale string (default: "en-US")

### `formatDate(date, locale?, options?)`

- `date` (Date | string): The date to format
- `locale` (string, optional): Locale string (default: "en-US")
- `options` (Intl.DateTimeFormatOptions, optional): Formatting options

### `formatNumber(num, locale?, options?)`

- `num` (number): The number to format
- `locale` (string, optional): Locale string (default: "en-US")
- `options` (Intl.NumberFormatOptions, optional): Formatting options

## Testing

```bash
pnpm test        # Run tests once
pnpm test:watch  # Run tests in watch mode
```
