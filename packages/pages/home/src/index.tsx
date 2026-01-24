export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold">Welcome to the Monorepo</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A modern monorepo with Turborepo, pnpm, Next.js 16, and Tailwind CSS
        </p>
      </div>
    </main>
  );
}
