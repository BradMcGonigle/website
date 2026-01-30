import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectsListPage, { type Project } from "./index";

const mockProjects: Project[] = [
  {
    title: "Featured Project",
    description: "A featured project description",
    url: "https://example.com/featured",
    repo: "https://github.com/example/featured",
    tech: ["React", "TypeScript"],
    featured: true,
    order: 2,
    slug: "featured-project",
  },
  {
    title: "Regular Project",
    description: "A regular project description",
    repo: "https://github.com/example/regular",
    tech: ["Node.js"],
    featured: false,
    order: 1,
    slug: "regular-project",
  },
  {
    title: "Another Featured",
    description: "Another featured project",
    url: "https://example.com/another",
    tech: [],
    featured: true,
    order: 1,
    slug: "another-featured",
  },
];

describe("ProjectsListPage", () => {
  it("renders the page heading", () => {
    render(<ProjectsListPage projects={mockProjects} />);
    expect(
      screen.getByRole("heading", { name: "Projects", level: 1 })
    ).toBeInTheDocument();
  });

  it("renders all projects", () => {
    render(<ProjectsListPage projects={mockProjects} />);
    expect(screen.getByText("Featured Project")).toBeInTheDocument();
    expect(screen.getByText("Regular Project")).toBeInTheDocument();
    expect(screen.getByText("Another Featured")).toBeInTheDocument();
  });

  it("renders project descriptions", () => {
    render(<ProjectsListPage projects={mockProjects} />);
    expect(screen.getByText("A featured project description")).toBeInTheDocument();
    expect(screen.getByText("A regular project description")).toBeInTheDocument();
  });

  it("renders technology tags", () => {
    render(<ProjectsListPage projects={mockProjects} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("sorts featured projects first, then by order", () => {
    render(<ProjectsListPage projects={mockProjects} />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    // Featured projects first (sorted by order), then non-featured
    expect(headings[0]).toHaveTextContent("Another Featured"); // featured, order 1
    expect(headings[1]).toHaveTextContent("Featured Project"); // featured, order 2
    expect(headings[2]).toHaveTextContent("Regular Project"); // not featured
  });

  it("renders website links when url is provided", () => {
    render(<ProjectsListPage projects={mockProjects} />);
    const websiteLinks = screen.getAllByRole("link", { name: /website/i });
    expect(websiteLinks).toHaveLength(2); // Two projects have URLs
    websiteLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("renders source links when repo is provided", () => {
    render(<ProjectsListPage projects={mockProjects} />);
    const sourceLinks = screen.getAllByRole("link", { name: /source/i });
    expect(sourceLinks).toHaveLength(2); // Two projects have repos
    sourceLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("shows empty state when no projects", () => {
    render(<ProjectsListPage projects={[]} />);
    expect(screen.getByText("No projects yet. Check back soon!")).toBeInTheDocument();
  });
});
