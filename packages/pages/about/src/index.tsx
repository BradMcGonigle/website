import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <article>
        <header>
          <h1 className="text-4xl font-bold">About</h1>
        </header>

        <div className="mt-8 space-y-6">
          <p className="text-lg">
            Hi, I&apos;m Brad — a software engineer living in Orlando, Florida.
          </p>

          <p className="text-muted-foreground">
            With almost two decades of software development experience,
            I&apos;ve been fortunate to work with a wide variety of companies
            ranging from agency-style client-driven shops to venture-backed
            startups to Fortune 500 corporations. I&apos;m passionate about
            building scalable, performant, and accessible applications using
            modern engineering practices.
          </p>

          <p className="text-muted-foreground">
            Currently, I&apos;m a Lead Software Engineer at{" "}
            <a
              href="https://www.goodrx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              GoodRx
            </a>
            , where I architect and scale our design system and component
            library, empowering developers across the organization with
            documented, reusable components. I also lead our application
            configuration platform and work on CI/CD pipelines for our
            monorepo.
          </p>

          <p className="text-muted-foreground">
            For a detailed look at my professional experience, check out my{" "}
            <Link
              href="/resume"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              resume
            </Link>
            .
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Beyond the code</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              When I&apos;m not writing code, I spend my time with my wife
              Shaina and our kids. Being a father has given me a whole new
              perspective on work-life balance and the importance of building
              things that matter.
            </p>

            <p>
              I&apos;m an avid surfer, hockey player, and all-around sports fan.
              Fly Eagles Fly! I also enjoy pretending to be a chef — my most
              recent culinary adventures involve Sous Vide cooking and smoking
              everything from meats to salt.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Get in touch</h2>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <p>
              Feel free to reach out via email at{" "}
              <a
                href="mailto:brad@bradmcgonigle.com"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                brad@bradmcgonigle.com
              </a>{" "}
              or connect with me on{" "}
              <a
                href="https://github.com/bradmcgonigle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                GitHub
              </a>{" "}
              and{" "}
              <a
                href="https://www.linkedin.com/in/bradmcgonigle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                LinkedIn
              </a>
              .
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
