import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LinksListPage, { type Link } from "./index";

const mockLinks: Link[] = [
  {
    title: "Test Link 1",
    description: "Description for test link 1",
    url: "https://example.com/1",
    image: "https://example.com/image1.jpg",
    date: "2024-01-15",
    createdAt: "2024-01-15T12:00:00.000Z",
    slug: "test-link-1",
    tags: ["Development", "Tools"],
  },
  {
    title: "Test Link 2",
    description: "Description for test link 2",
    url: "https://example.com/2",
    date: "2024-01-10",
    createdAt: "2024-01-10T12:00:00.000Z",
    slug: "test-link-2",
    tags: ["Design"],
  },
  {
    title: "Link Without Image",
    url: "https://example.com/3",
    date: "2024-01-05",
    createdAt: "2024-01-05T12:00:00.000Z",
    slug: "link-without-image",
    tags: [],
  },
];

describe("LinksListPage", () => {
  it("renders the page heading", () => {
    render(<LinksListPage links={mockLinks} />);
    expect(
      screen.getByRole("heading", { name: "Links", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders all links", () => {
    render(<LinksListPage links={mockLinks} />);
    expect(screen.getByText("Test Link 1")).toBeInTheDocument();
    expect(screen.getByText("Test Link 2")).toBeInTheDocument();
    expect(screen.getByText("Link Without Image")).toBeInTheDocument();
  });

  it("renders link descriptions when provided", () => {
    render(<LinksListPage links={mockLinks} />);
    expect(screen.getByText("Description for test link 1")).toBeInTheDocument();
    expect(screen.getByText("Description for test link 2")).toBeInTheDocument();
  });

  it("renders link tags", () => {
    render(<LinksListPage links={mockLinks} />);
    expect(screen.getByText("Development")).toBeInTheDocument();
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("sorts links by date in descending order", () => {
    render(<LinksListPage links={mockLinks} />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0]).toHaveTextContent("Test Link 1");
    expect(headings[1]).toHaveTextContent("Test Link 2");
    expect(headings[2]).toHaveTextContent("Link Without Image");
  });

  it("renders links with target blank", () => {
    render(<LinksListPage links={mockLinks} />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("shows empty state when no links", () => {
    render(<LinksListPage links={[]} />);
    expect(screen.getByText("No links yet. Check back soon!")).toBeInTheDocument();
  });

  it("renders images when provided", () => {
    const { container } = render(<LinksListPage links={mockLinks} />);
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(1); // Only first link has an image
    expect(images[0]).toHaveAttribute("src", "https://example.com/image1.jpg");
  });
});
