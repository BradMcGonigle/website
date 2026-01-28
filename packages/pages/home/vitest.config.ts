import reactConfig from "configs.vitest/react";
import { mergeConfig } from "vitest/config";
import { resolve } from "path";

export default mergeConfig(reactConfig, {
  resolve: {
    alias: {
      "framer-motion": resolve(__dirname, "src/__mocks__/framer-motion.tsx"),
    },
  },
});
