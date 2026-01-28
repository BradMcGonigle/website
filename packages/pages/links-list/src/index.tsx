import { formatDate } from "utils.core.format";

export interface Link {
  title: string;
  description?: string;
  url: string;
  image?: string;
  date: string;
  createdAt: string;
  tags: string[];
  slug: string;
}

export interface LinksListPageProps {
  links: Link[];
}

export default function LinksListPage({ links }: LinksListPageProps) {
  const sortedLinks = [...links].sort((a, b) => {
    const dateCompare =
      new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section aria-labelledby="links-heading">
        <h1 id="links-heading" className="text-4xl font-bold">
          Links
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Interesting articles, tools, and resources I&apos;ve found around the
          web.
        </p>
      </section>

      <section aria-label="Links" className="mt-12">
        <ul className="grid gap-6 sm:grid-cols-2">
          {sortedLinks.map((link) => (
            <li key={link.slug}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
              >
                {link.image && (
                  <div className="aspect-[2/1] overflow-hidden bg-muted">
                    <img
                      src={link.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <time
                    dateTime={link.date}
                    className="text-xs text-muted-foreground"
                  >
                    {formatDate(link.date)}
                  </time>
                  <h2 className="mt-1 font-semibold group-hover:text-primary">
                    {link.title}
                  </h2>
                  {link.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  )}
                  {link.tags.length > 0 && (
                    <ul
                      className="mt-3 flex flex-wrap gap-1"
                      aria-label={`Tags for ${link.title}`}
                    >
                      {link.tags.map((tag) => (
                        <li key={tag}>
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>

        {sortedLinks.length === 0 && (
          <p className="text-center text-muted-foreground">
            No links yet. Check back soon!
          </p>
        )}
      </section>
    </div>
  );
}
