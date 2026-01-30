import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./index";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

vi.mock("lucide-react", () => ({
  Menu: () => <svg data-testid="menu-icon" />,
  X: () => <svg data-testid="close-icon" />,
}));

describe("Header", () => {
  it("renders a header element", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the site logo/name as a link to home", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", { name: "BM" });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders navigation with proper aria label", () => {
    render(<Header />);
    expect(
      screen.getByRole("navigation", { name: "Main navigation" })
    ).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(screen.getByRole("link", { name: "Links" })).toHaveAttribute(
      "href",
      "/links"
    );
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/projects"
    );
  });

  it("renders navigation items in a list", () => {
    render(<Header />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(5);
  });

  describe("Mobile menu", () => {
    it("renders a mobile menu button", () => {
      render(<Header />);
      const button = screen.getByRole("button", { name: "Open menu" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("shows menu icon when mobile menu is closed", () => {
      render(<Header />);
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
    });

    it("opens mobile menu when button is clicked", () => {
      render(<Header />);
      const button = screen.getByRole("button", { name: "Open menu" });

      fireEvent.click(button);

      expect(button).toHaveAttribute("aria-expanded", "true");
      expect(
        screen.getByRole("navigation", { name: "Mobile navigation" })
      ).toBeInTheDocument();
    });

    it("shows close icon when mobile menu is open", () => {
      render(<Header />);
      const button = screen.getByRole("button", { name: "Open menu" });

      fireEvent.click(button);

      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("menu-icon")).not.toBeInTheDocument();
    });

    it("closes mobile menu when button is clicked again", () => {
      render(<Header />);
      const button = screen.getByRole("button", { name: "Open menu" });

      fireEvent.click(button);
      expect(
        screen.getByRole("navigation", { name: "Mobile navigation" })
      ).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
      expect(
        screen.queryByRole("navigation", { name: "Mobile navigation" })
      ).not.toBeInTheDocument();
    });

    it("renders navigation links in mobile menu", () => {
      render(<Header />);
      const button = screen.getByRole("button", { name: "Open menu" });
      fireEvent.click(button);

      const mobileNav = screen.getByRole("navigation", {
        name: "Mobile navigation",
      });
      expect(mobileNav.querySelector('a[href="/"]')).toBeInTheDocument();
      expect(mobileNav.querySelector('a[href="/about"]')).toBeInTheDocument();
      expect(mobileNav.querySelector('a[href="/blog"]')).toBeInTheDocument();
      expect(mobileNav.querySelector('a[href="/links"]')).toBeInTheDocument();
      expect(
        mobileNav.querySelector('a[href="/projects"]')
      ).toBeInTheDocument();
    });

    it("closes mobile menu when a link is clicked", () => {
      render(<Header />);
      const button = screen.getByRole("button", { name: "Open menu" });
      fireEvent.click(button);

      const mobileNav = screen.getByRole("navigation", {
        name: "Mobile navigation",
      });
      const aboutLink = mobileNav.querySelector('a[href="/about"]');
      expect(aboutLink).toBeInTheDocument();
      fireEvent.click(aboutLink as HTMLElement);

      expect(
        screen.queryByRole("navigation", { name: "Mobile navigation" })
      ).not.toBeInTheDocument();
    });
  });
});
