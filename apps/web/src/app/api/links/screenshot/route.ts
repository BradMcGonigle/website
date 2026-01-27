import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    // Dynamic import to avoid loading puppeteer in non-screenshot contexts
    const chromium = await import("@sparticuz/chromium").then((m) => m.default);
    const puppeteer = await import("puppeteer-core").then((m) => m.default);

    // Configure chromium for serverless
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1200, height: 630 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Set a reasonable timeout
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 15000,
    });

    // Wait a bit for any lazy-loaded content
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Take screenshot
    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 85,
      encoding: "base64",
    });

    await browser.close();

    return NextResponse.json({
      success: true,
      screenshot: `data:image/jpeg;base64,${screenshot}`,
    });
  } catch (error) {
    console.error("Screenshot error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to take screenshot",
      },
      { status: 500 }
    );
  }
}
