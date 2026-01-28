import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatNumber } from "./index";

describe("formatCurrency", () => {
  it("formats USD currency with default locale", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats EUR currency", () => {
    const result = formatCurrency(1234.56, "EUR", "de-DE");
    // Intl.NumberFormat uses non-breaking space (U+00A0) before currency symbol
    expect(result).toMatch(/1\.234,56\s€/);
  });

  it("formats zero amount", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative amounts", () => {
    expect(formatCurrency(-99.99)).toBe("-$99.99");
  });

  it("formats large numbers", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });
});

describe("formatDate", () => {
  it("formats Date object with default options", () => {
    // Use T12:00:00 to avoid timezone issues shifting the date
    const date = new Date("2024-03-15T12:00:00");
    expect(formatDate(date)).toBe("March 15, 2024");
  });

  it("formats ISO string date", () => {
    expect(formatDate("2024-12-25T12:00:00")).toBe("December 25, 2024");
  });

  it("formats with custom locale", () => {
    const date = new Date("2024-03-15T12:00:00");
    expect(formatDate(date, "de-DE")).toBe("15. März 2024");
  });

  it("formats with custom options", () => {
    const date = new Date("2024-03-15T12:00:00");
    expect(formatDate(date, "en-US", { month: "short", day: "numeric" })).toBe(
      "Mar 15"
    );
  });
});

describe("formatNumber", () => {
  it("formats number with thousand separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats decimal numbers", () => {
    expect(formatNumber(1234.567)).toBe("1,234.567");
  });

  it("formats with German locale", () => {
    expect(formatNumber(1234567, "de-DE")).toBe("1.234.567");
  });

  it("formats with custom options", () => {
    expect(
      formatNumber(0.75, "en-US", { style: "percent", maximumFractionDigits: 0 })
    ).toBe("75%");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});
