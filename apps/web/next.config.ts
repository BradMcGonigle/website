import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Empty turbopack config to silence warnings in dev mode
  // Velite runs via webpack plugin in production builds
  turbopack: {},

  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

class VeliteWebpackPlugin {
  static started = false;
  apply(compiler: { hooks: { beforeCompile: { tapPromise: (name: string, fn: () => Promise<void>) => void } } }) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = process.argv.includes("dev");
      const { build } = await import("velite");
      await build({ watch: dev, clean: !dev });
    });
  }
}

export default config;
