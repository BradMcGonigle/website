interface Job {
  company: string;
  title: string;
  location: string;
  remote?: string;
  startDate: string;
  endDate: string;
  description: string[];
}

interface SkillCategory {
  name: string;
  skills: string[];
}

const jobs: Job[] = [
  {
    company: "GoodRx",
    title: "Lead Software Engineer",
    location: "Santa Monica, California",
    remote: "Orlando, Florida",
    startDate: "Feb 2024",
    endDate: "Present",
    description: [
      "Architect and scale GoodRx's design system, empowering developers with documented, reusable components across the frontend organization",
      "Lead the application configuration platform and UI, enabling advanced feature configuration variations across all frontend applications",
      "Design and implement CI/CD pipelines for the GoodRx monorepo, including build package versioning, changelogs via changesets, and artifact registry",
      "Establish governance for docs-as-code component documentation system, enforcing ownership standards and managing contributions",
      "Partner with SRE and backend teams to plan and implement infrastructure changes across providers",
    ],
  },
  {
    company: "GoodRx",
    title: "Senior Software Engineer",
    location: "Santa Monica, California",
    remote: "Orlando, Florida",
    startDate: "Dec 2021",
    endDate: "Feb 2024",
    description: [
      "Implemented and maintained comprehensive testing practices including testing-library/react and mobile data-driven testing with Maestro",
      "Led incident management through production deployments, coordinating cross-team communication and root cause analysis",
      "Championed developer experience improvements through accelerating application platform efficiency and optimizing monorepo pipelines",
    ],
  },
  {
    company: "GoodRx",
    title: "Senior Software Engineer",
    location: "Santa Monica, California",
    remote: "Orlando, Florida",
    startDate: "Oct 2019",
    endDate: "Dec 2021",
    description: [
      "Optimized application performance using React optimization strategies and Datadog observability",
      "Set the engineering vision for developer accessibility, automated testing, documentation, and build pipelines",
      "Led the evolution of engineering documentation by partnering with Design and Product teams",
    ],
  },
  {
    company: "Yola",
    title: "Senior Frontend Engineer",
    location: "San Francisco, California",
    remote: "Orlando, Florida",
    startDate: "Feb 2017",
    endDate: "Sep 2019",
    description: [
      "Developed, maintained, and enhanced reusable components and applications used by millions of users worldwide",
      "Planned and implemented migration of several user-facing applications from legacy client-side JavaScript to server-rendered React",
      "Defined frontend workflows, technology stacks, and code standards for the engineering organization",
      "Partnered with product and engineering leadership to assist with delivery milestones",
    ],
  },
  {
    company: "Pall Corporation",
    title: "Senior Designer",
    location: "Deland, Florida",
    remote: "Orlando, Florida",
    startDate: "Oct 2016",
    endDate: "Feb 2017",
    description: [
      "Built internal tools for migrating and aggregating product data across multiple systems",
      "Led frontend engineering workflows and established best practices for development",
    ],
  },
  {
    company: "Pearson",
    title: "Senior Web Developer",
    location: "Orlando, Florida",
    startDate: "2014",
    endDate: "2016",
    description: [
      "Helped transform Pearson's digital presence through modern practices and improved accessible user experience",
      "Partnered with external vendors and partner university sites for user experience improvements",
      "Led usability initiatives for prospective student engagement",
    ],
  },
  {
    company: "SquareFactor",
    title: "Lead Software Engineer",
    location: "Winter Park, Florida",
    startDate: "2012",
    endDate: "2014",
    description: [
      "Led development across multiple client projects from concept to deployment",
      "Defined project web stacks and collaborated directly with clients on requirements and deliverables",
      "Created high-fidelity designs and developed responsive solutions for new business initiatives",
    ],
  },
  {
    company: "Bonnier Corporation",
    title: "Online Producer / Editor",
    location: "Winter Park, Florida",
    startDate: "2007",
    endDate: "2012",
    description: [
      "Produced digital content for Bonnier's outdoor recreation properties including Salt Water Sportsman",
      "Led digital editorial team and engineering program for outdoor-related media sites",
      "Architected and scaled design system and component library for digital properties",
    ],
  },
];

const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["TypeScript", "JavaScript"],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      "React",
      "Next.js",
      "Gatsby",
      "Redux",
      "Tailwind CSS",
      "styled-components",
      "Emotion",
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      "Node.js",
      "GraphQL",
      "Storybook",
      "Turborepo",
      "pnpm",
      "Git",
      "Docker",
      "CI/CD",
    ],
  },
  {
    name: "Testing",
    skills: ["Vitest", "Playwright", "Maestro", "Testing Library"],
  },
  {
    name: "Observability",
    skills: ["Datadog"],
  },
];

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
          <div className="mt-6 space-y-10">
            {jobs.map((job, index) => (
              <div key={index} className="border-l-2 border-border pl-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {job.startDate} — {job.endDate}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {job.company} · {job.location}
                  {job.remote && ` (Remote from ${job.remote})`}
                </p>
                <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  {job.description.map((item, descIndex) => (
                    <li key={descIndex}>{item}</li>
                  ))}
                </ul>
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
