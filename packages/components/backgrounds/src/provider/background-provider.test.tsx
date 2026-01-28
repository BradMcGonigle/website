import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { BackgroundProvider } from "./background-provider";
import { useBackground } from "../hooks/use-background";

// Mock the backgrounds to avoid lazy loading issues in tests
vi.mock("../backgrounds", () => ({
  backgrounds: [
    {
      id: "dot-grid",
      name: "Dot Grid",
      description: "CSS-based pulsing dot grid pattern",
      component: () => <div data-testid="dot-grid-bg">Dot Grid</div>,
    },
    {
      id: "topographic",
      name: "Topographic",
      description: "Canvas-based Perlin noise contour lines",
      component: () => <div data-testid="topographic-bg">Topographic</div>,
    },
  ],
}));

// Mock session storage
const mockSessionStorage: Record<string, string> = {};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(0));

  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: vi.fn((key: string) => mockSessionStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockSessionStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockSessionStorage[key];
      }),
    },
    writable: true,
  });

  Object.keys(mockSessionStorage).forEach((key) => {
    delete mockSessionStorage[key];
  });
});

afterEach(() => {
  vi.useRealTimers();
});

function TestConsumer() {
  const { currentBackground, isLoading } = useBackground();
  return (
    <div>
      <span data-testid="current-bg">{currentBackground}</span>
      <span data-testid="loading">{isLoading ? "loading" : "loaded"}</span>
    </div>
  );
}

describe("BackgroundProvider", () => {
  it("renders children", () => {
    render(
      <BackgroundProvider>
        <div data-testid="child">Hello</div>
      </BackgroundProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("provides background context to children", () => {
    render(
      <BackgroundProvider>
        <TestConsumer />
      </BackgroundProvider>
    );

    expect(screen.getByTestId("current-bg")).toBeInTheDocument();
  });

  it("selects first background at rotation index 0", async () => {
    vi.setSystemTime(new Date(0));

    render(
      <BackgroundProvider>
        <TestConsumer />
      </BackgroundProvider>
    );

    // Wait for effect to run
    await vi.runAllTimersAsync();

    expect(screen.getByTestId("current-bg")).toHaveTextContent("dot-grid");
  });

  it("selects second background at rotation index 1", async () => {
    vi.setSystemTime(new Date(8 * 60 * 60 * 1000)); // 8 hours

    render(
      <BackgroundProvider>
        <TestConsumer />
      </BackgroundProvider>
    );

    await vi.runAllTimersAsync();

    expect(screen.getByTestId("current-bg")).toHaveTextContent("topographic");
  });
});
