import { describe, expect, it } from "vitest";
import { cn } from "./index";

describe("cn", () => {
  it("joins multiple class names", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", false, "bar", null, "baz", undefined)).toBe("foo bar baz");
  });

  it("returns empty string when all values are falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });

  it("returns empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles single class name", () => {
    expect(cn("single")).toBe("single");
  });
});
