export interface ChangelogEntry {
  version: string;
  date: string;
  createdAt: string;
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
  feature: "bg-green-500/15 text-green-700 dark:text-green-400",
  fix: "bg-red-500/15 text-red-700 dark:text-red-400",
  improvement: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  breaking: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  docs: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;
    if (numA !== numB) return numB - numA;
  }
  return 0;
}

export default function ChangelogPage({ entries }: ChangelogPageProps) {
  const sortedEntries = [...entries].sort((a, b) => {
    const dateCompare =
      new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    const createdAtCompare =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (createdAtCompare !== 0) return createdAtCompare;
    return compareVersions(a.version, b.version);
  });

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
              <div className="prose mt-4 dark:prose-invert">
                {entry.content}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
