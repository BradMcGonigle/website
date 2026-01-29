export const site = {
  name: "Brad McGonigle",
  url: "https://bradmcgonigle.com",
  description: "Personal website of Brad McGonigle",
  author: {
    name: "Brad McGonigle",
    email: "brad@mcgonigle.com",
    url: "https://bradmcgonigle.com",
  },
  links: {
    github: "https://github.com/BradMcGonigle",
  },
} as const;

export type Site = typeof site;
