import ProjectsListPage from "pages.projects-list";
import { projects } from "#content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Brad McGonigle",
  description:
    "Open source projects and experiments I've been working on.",
};

export default function ProjectsPage() {
  return <ProjectsListPage projects={projects} />;
}
