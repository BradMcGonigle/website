interface Role {
  title: string;
  startDate: string;
  endDate: string;
  description: string[];
}

interface Company {
  name: string;
  location: string;
  remote?: string;
  roles: Role[];
}

interface SkillCategory {
  name: string;
  skills: string[];
}

const companies: Company[] = [
  {
    name: "GoodRx",
    location: "Santa Monica, California",
    remote: "Orlando, Florida",
    roles: [
      {
        title: "Lead Software Engineer",
        startDate: "Feb 2024",
        endDate: "Present",
        description: [
          "Led pnpm + Turborepo migration from Yarn + Lerna, reducing node_modules disk usage by 70% and CI pipeline times from 30+ minutes to ~10 minutes",
          "Architected transition from Babel to SWC, cutting full build times by 60% and enabling sub-2-minute incremental builds",
          "Drove Next.js 15 and React 19 adoption across 6 production applications serving GoodRx's primary consumer web properties",
          "Designed and scaled GoodRx's internal design system (300+ packages), replacing external dependencies with in-repo solutions using Tailwind CSS and CVA",
          "Established multi-tenant platform architecture enabling rapid onboarding of retail pharmacy partners including Kroger, Giant Eagle, and Wegmans",
          "Lead application configuration platform powering feature variations and A/B testing across all frontend applications",
          "Partner with SRE, backend, and product teams to define technical roadmaps and drive infrastructure modernization",
        ],
      },
      {
        title: "Senior Software Engineer",
        startDate: "Dec 2021",
        endDate: "Feb 2024",
        description: [
          "Introduced Playwright E2E testing framework and Chromatic visual regression testing, establishing deployment confidence across the organization",
          "Migrated observability stack to DataDog (RUM, APM, error tracking), improving production debugging capabilities",
          "Drove styled-components to Tailwind CSS migration, establishing modern styling patterns adopted org-wide",
          "Led incident management through production deployments, coordinating cross-team communication and root cause analysis",
        ],
      },
      {
        title: "Senior Software Engineer",
        startDate: "Oct 2019",
        endDate: "Dec 2021",
        description: [
          "Core contributor to Singularity monorepo transformation from single-app repo to GoodRx's primary frontend platform",
          "Created next-web application which became the primary Next.js application serving goodrx.com",
          "Set engineering vision for developer accessibility, automated testing, documentation, and build pipeline standards",
          "Led evolution of engineering documentation partnering with Design and Product teams",
        ],
      },
    ],
  },
  {
    name: "Yola",
    location: "San Francisco, California",
    remote: "Orlando, Florida",
    roles: [
      {
        title: "Senior Software Engineer",
        startDate: "Feb 2017",
        endDate: "Sep 2019",
        description: [
          "Developed, maintained, and enhanced reusable components and applications used by millions of users worldwide",
          "Planned and implemented migration of several user-facing applications from legacy client-side JavaScript to server-rendered React",
          "Defined frontend workflows, technology stacks, and code standards for the engineering organization",
          "Partnered with product and engineering leadership to assist with delivery milestones",
        ],
      },
    ],
  },
  {
    name: "Pall Corporation",
    location: "Deland, Florida",
    remote: "Orlando, Florida",
    roles: [
      {
        title: "Senior Web Developer",
        startDate: "Oct 2016",
        endDate: "Feb 2017",
        description: [
          "Contracted to direct the planning, development and relaunch of Pall Corporation's websites",
          "Built internal tools for migrating and aggregating product data across multiple systems",
        ],
      },
    ],
  },
  {
    name: "Pearson",
    location: "Orlando, Florida",
    roles: [
      {
        title: "Senior Web Developer",
        startDate: "Jan 2015",
        endDate: "Oct 2016",
        description: [
          "Helped transform Pearson's digital presence through modern practices and improved accessible user experience",
          "Partnered with external vendors and partner university sites for user experience improvements",
          "Led usability initiatives for prospective student engagement",
        ],
      },
    ],
  },
  {
    name: "SquareFactor",
    location: "Winter Park, Florida",
    roles: [
      {
        title: "Lead Software Engineer",
        startDate: "2012",
        endDate: "2014",
        description: [
          "Led development across multiple client projects from concept to deployment",
          "Defined project web stacks and collaborated directly with clients on requirements and deliverables",
          "Created high-fidelity designs and developed responsive solutions for new business initiatives",
        ],
      },
    ],
  },
  {
    name: "Bonnier Corporation",
    location: "Winter Park, Florida",
    roles: [
      {
        title: "Online Producer",
        startDate: "2007",
        endDate: "2012",
        description: [
          "Produced digital content for Bonnier's outdoor recreation properties including Salt Water Sportsman",
          "Led digital editorial team and engineering program for outdoor-related media sites",
          "Architected and scaled design system and component library for digital properties",
        ],
      },
    ],
  },
];

const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["TypeScript", "JavaScript", "GraphQL", "HTML", "CSS"],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      "React",
      "Next.js",
      "Apollo Client",
      "TanStack Query",
      "Tailwind CSS",
      "i18next",
    ],
  },
  {
    name: "Platform & Infrastructure",
    skills: [
      "Monorepo Architecture",
      "Turborepo",
      "pnpm",
      "Docker",
      "Kubernetes",
      "AWS",
      "Terraform",
      "Vercel",
    ],
  },
  {
    name: "Build & CI/CD",
    skills: ["Vite", "Webpack", "GitHub Actions", "CircleCI"],
  },
  {
    name: "Testing & Quality",
    skills: ["Vitest", "Playwright", "Chromatic", "Testing Library"],
  },
  {
    name: "Observability",
    skills: ["Datadog RUM", "APM", "Error Tracking", "Synthetics"],
  },
  {
    name: "Design Systems",
    skills: ["Storybook", "Figma"],
  },
];

function getCompanyDateRange(roles: Role[]): string {
  if (roles.length === 0) return "";
  const firstRole = roles.at(-1);
  const lastRole = roles.at(0);
  if (!firstRole || !lastRole) return "";
  return `${firstRole.startDate} — ${lastRole.endDate}`;
}

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <article>
        <header>
          <h1 className="text-4xl font-bold">Resume</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Software engineer with almost two decades of experience building
            scalable, performant, and accessible applications.
          </p>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Experience</h2>
          <div className="mt-6 space-y-12">
            {companies.map((company) => (
              <div key={company.name} className="border-l-2 border-border pl-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-xl font-bold">{company.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {getCompanyDateRange(company.roles)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {company.location}
                  {company.remote && ` · Remote from ${company.remote}`}
                </p>

                <div className="mt-4 space-y-6">
                  {company.roles.map((role, roleIndex) => (
                    <div key={roleIndex}>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                        <h4 className="font-semibold">{role.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {role.startDate} — {role.endDate}
                        </span>
                      </div>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {role.description.map((item, descIndex) => (
                          <li key={descIndex}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <div className="mt-6 space-y-6">
            {skillCategories.map((category) => (
              <div key={category.name}>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {category.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border bg-muted px-3 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Education</h2>
          <div className="mt-6 border-l-2 border-border pl-6">
            <h3 className="text-lg font-semibold">
              Bachelor of Arts in Economics
            </h3>
            <p className="mt-1 text-muted-foreground">
              University of Georgia · Terry College of Business
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <div className="mt-6 space-y-2 text-muted-foreground">
            <p>
              <a
                href="mailto:brad@bradmcgonigle.com"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                brad@bradmcgonigle.com
              </a>
            </p>
            <p>
              <a
                href="https://github.com/bradmcgonigle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                github.com/bradmcgonigle
              </a>
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/bradmcgonigle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                linkedin.com/in/bradmcgonigle
              </a>
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
