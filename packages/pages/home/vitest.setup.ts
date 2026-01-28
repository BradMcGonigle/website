import "@testing-library/jest-dom/vitest";

// Mock IntersectionObserver for tests - immediately triggers as visible
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: readonly number[] = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(): void {
    // Immediately call callback with isIntersecting: true
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this
    );
  }
  unobserve(): void {
    // noop
  }
  disconnect(): void {
    // noop
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver;
