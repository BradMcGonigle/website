// Provider
export { BackgroundProvider } from "./provider/background-provider";
export { BackgroundContext } from "./provider/background-context";

// Hooks
export { useBackground } from "./hooks/use-background";
export { useBackgroundSelection } from "./hooks/use-background-selection";

// Types
export type { BackgroundId, BackgroundConfig, BackgroundContextValue } from "./types";

// Individual backgrounds (for direct use if needed)
export { DotGridBackground } from "./backgrounds/dot-grid-background";
export { TopographicBackground } from "./backgrounds/topographic-background";
