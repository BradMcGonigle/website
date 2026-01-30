import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/changelog"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </nav>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} Brad McGonigle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
