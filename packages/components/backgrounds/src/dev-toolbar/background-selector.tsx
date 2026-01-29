"use client";

import { useBackground } from "../hooks/use-background";

/**
 * Background selector buttons for use in the dev toolbar.
 * Displays all available backgrounds with the current one highlighted.
 */
export function BackgroundSelector() {
  const { currentBackground, backgrounds, setBackground } = useBackground();

  if (!setBackground) {
    return null;
  }

  return (
    <>
      {backgrounds.map((bg, index) => (
        <button
          key={bg.id}
          onClick={() => setBackground(bg.id)}
          style={{
            padding: "3px 8px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: currentBackground === bg.id ? 600 : 500,
            background: currentBackground === bg.id ? "rgba(0, 0, 0, 0.15)" : "transparent",
            color: currentBackground === bg.id ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.6)",
            transition: "all 0.1s ease",
            marginLeft: index > 0 ? 2 : 0,
            fontFamily: "inherit",
          }}
          title={bg.description}
          onMouseEnter={(e) => {
            if (currentBackground !== bg.id) {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentBackground !== bg.id) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {bg.name}
        </button>
      ))}
    </>
  );
}
