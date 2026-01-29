import { DotGridBackground } from "./dot-grid-background";
import { TopographicBackground } from "./topographic-background";
import { FlowFieldBackground } from "./flow-field-background";
import { ConstellationBackground } from "./constellation-background";
import { WaveInterferenceBackground } from "./wave-interference-background";
import { AuroraBackground } from "./aurora-background";
import { VoronoiBackground } from "./voronoi-background";
import type { BackgroundConfig } from "../types";

export const backgrounds: BackgroundConfig[] = [
  {
    id: "dot-grid",
    name: "Dot Grid",
    description: "Pulsing dot grid pattern",
    component: DotGridBackground,
  },
  {
    id: "topographic",
    name: "Topographic",
    description: "Perlin noise contour lines",
    component: TopographicBackground,
  },
  {
    id: "flow-field",
    name: "Flow Field",
    description: "Particles following noise-based flow",
    component: FlowFieldBackground,
  },
  {
    id: "constellation",
    name: "Constellation",
    description: "Connected stars with shooting stars",
    component: ConstellationBackground,
  },
  {
    id: "wave-interference",
    name: "Wave Interference",
    description: "Overlapping circular wave patterns",
    component: WaveInterferenceBackground,
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Flowing ribbon-like aurora borealis",
    component: AuroraBackground,
  },
  {
    id: "voronoi",
    name: "Voronoi",
    description: "Animated Voronoi cell diagram",
    component: VoronoiBackground,
  },
];
