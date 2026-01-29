// Provider
export { BackgroundProvider } from "./provider/background-provider";
export { BackgroundContext } from "./provider/background-context";

// Hooks
export { useBackground } from "./hooks/use-background";
export { useBackgroundSelection } from "./hooks/use-background-selection";

// Dev tools
export { DevBackgroundToolbar } from "./dev-toolbar/dev-background-toolbar";

// Types
export type { BackgroundId, BackgroundConfig, BackgroundContextValue } from "./types";

// Individual backgrounds (for direct use if needed)
export { DotGridBackground } from "./backgrounds/dot-grid-background";
export { TopographicBackground } from "./backgrounds/topographic-background";
export { FlowFieldBackground } from "./backgrounds/flow-field-background";
export { ConstellationBackground } from "./backgrounds/constellation-background";
export { WaveInterferenceBackground } from "./backgrounds/wave-interference-background";
export { AuroraBackground } from "./backgrounds/aurora-background";
export { VoronoiBackground } from "./backgrounds/voronoi-background";
