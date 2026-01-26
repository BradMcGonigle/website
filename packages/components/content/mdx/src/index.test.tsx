import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pre, Code, Blockquote, Anchor, mdxComponents, MDXContent } from "./index";

describe("MDX Components", () => {
  describe("Pre", () => {
    it("renders pre element with children", () => {
      render(<Pre>const x = 1;</Pre>);
      expect(screen.getByText("const x = 1;")).toBeInTheDocument();
    });
  });

  describe("Code", () => {
    it("renders code element with children", () => {
      render(<Code>code snippet</Code>);
      expect(screen.getByText("code snippet")).toBeInTheDocument();
    });
  });

  describe("Blockquote", () => {
    it("renders blockquote with children", () => {
      render(<Blockquote>A quoted text</Blockquote>);
      expect(screen.getByText("A quoted text")).toBeInTheDocument();
    });
  });

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
    it("exports all components", () => {
      expect(mdxComponents.pre).toBe(Pre);
      expect(mdxComponents.code).toBe(Code);
      expect(mdxComponents.blockquote).toBe(Blockquote);
      expect(mdxComponents.a).toBe(Anchor);
    });
  });

  describe("MDXContent", () => {
    it("is exported", () => {
      expect(MDXContent).toBeDefined();
    });
  });
});
