import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Anchor, mdxComponents, MDXContent } from "./index";

describe("MDX Components", () => {
  describe("Anchor", () => {
    it("renders internal link without target blank", () => {
      render(<Anchor href="/about">About</Anchor>);
      const link = screen.getByRole("link", { name: "About" });
      expect(link).toHaveAttribute("href", "/about");
      expect(link).not.toHaveAttribute("target");
    });

    it("renders external link with target blank", () => {
      render(<Anchor href="https://example.com">External</Anchor>);
      const link = screen.getByRole("link", { name: "External (opens in new tab)" });
      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("mdxComponents", () => {
    it("exports anchor component", () => {
      expect(mdxComponents.a).toBe(Anchor);
    });
  });

  describe("MDXContent", () => {
    it("is exported", () => {
      expect(MDXContent).toBeDefined();
    });
  });
});
