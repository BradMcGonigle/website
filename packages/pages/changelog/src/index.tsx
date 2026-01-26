export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description?: string | undefined;
  breaking: boolean;
  tags: ("feature" | "fix" | "improvement" | "breaking" | "docs")[];
  slug: string;
  permalink: string;
  content: React.ReactNode;
}

export interface ChangelogPageProps {
  entries: ChangelogEntry[];
}

const tagColors: Record<ChangelogEntry["tags"][number], string> = {
  feature: "bg-green-100 text-green-800",
  fix: "bg-red-100 text-red-800",
  improvement: "bg-blue-100 text-blue-800",
  breaking: "bg-orange-100 text-orange-800",
  docs: "bg-purple-100 text-purple-800",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChangelogPage({ entries }: ChangelogPageProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <article>
        <header>
          <h1 className="text-4xl font-bold">Changelog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            All notable changes and updates to this site.
          </p>
        </header>
        <div className="mt-12 space-y-12">
          {sortedEntries.map((entry) => (
            <section
              key={entry.slug}
              className="border-l-2 border-border pl-6"
              aria-labelledby={`changelog-${entry.slug}`}
            >
              <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2
                    id={`changelog-${entry.slug}`}
                    className="text-2xl font-semibold"
                  >
                    {entry.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-mono">v{entry.version}</span>
                    <span aria-hidden="true">&middot;</span>
                    <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                  </div>
                </div>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tagColors[tag]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>
              {entry.description && (
                <p className="mt-3 text-muted-foreground">{entry.description}</p>
              )}
              <div className="prose prose-neutral mt-4 max-w-none dark:prose-invert">
                {entry.content}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
