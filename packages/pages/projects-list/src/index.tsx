import { MDXContent } from "components.content.mdx";
import { ExternalLink, Github } from "lucide-react";

export interface Project {
  title: string;
  description: string;
  image?: string;
  url?: string;
  repo?: string;
  tech: string[];
  featured: boolean;
  order: number;
  slug: string;
  content: string;
}

export interface ProjectsListPageProps {
  projects: Project[];
}

export default function ProjectsListPage({ projects }: ProjectsListPageProps) {
  const sortedProjects = [...projects].sort((a, b) => {
    // Featured projects first, then by order
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return a.order - b.order;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section aria-labelledby="projects-heading">
        <h1 id="projects-heading" className="text-4xl font-bold">
          Projects
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Open source projects and experiments I&apos;ve been working on.
        </p>
      </section>

      <section aria-label="Projects" className="mt-12">
        <ul className="grid gap-6 sm:grid-cols-2">
          {sortedProjects.map((project) => (
            <li key={project.slug}>
              <div className="group relative isolate flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card backdrop-blur-[2px] transition-colors hover:border-primary">
                {project.image && (
                  <div className="aspect-[2/1] overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={`Preview image for ${project.title}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-semibold group-hover:text-primary">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  {project.content && (
                    <div className="mt-4 flex-1 prose prose-sm prose-neutral dark:prose-invert prose-p:text-muted-foreground prose-li:text-muted-foreground prose-headings:text-foreground prose-headings:font-semibold prose-h2:text-base prose-h2:mt-0 prose-ul:my-2">
                      <MDXContent code={project.content} />
                    </div>
                  )}
                  {project.tech.length > 0 && (
                    <ul
                      className="mt-4 flex flex-wrap gap-1"
                      aria-label={`Technologies used in ${project.title}`}
                    >
                      {project.tech.map((tech) => (
                        <li key={tech}>
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            {tech}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex gap-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`Visit ${project.title} website`}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        <span>Website</span>
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`View ${project.title} source code on GitHub`}
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {sortedProjects.length === 0 && (
          <p className="text-center text-muted-foreground">
            No projects yet. Check back soon!
          </p>
        )}
      </section>
    </div>
  );
}
