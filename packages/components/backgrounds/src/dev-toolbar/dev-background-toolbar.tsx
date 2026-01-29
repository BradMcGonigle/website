"use client";

import { useBackground } from "../hooks/use-background";
import { useVercelAuth } from "./use-vercel-auth";

/**
 * Dev-only toolbar for switching backgrounds.
 * Mimics Arc Browser's developer mode bar.
 * Renders in development mode OR in production when authenticated with Vercel.
 */
export function DevBackgroundToolbar() {
  const { currentBackground, backgrounds, setBackground } = useBackground();
  const isVercelAuthenticated = useVercelAuth();

  const isDev = process.env.NODE_ENV === "development";
  const shouldShow = isDev || isVercelAuthenticated;

  if (!shouldShow) {
    return null;
  }

  if (!setBackground) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        height: 28,
        background: "linear-gradient(90deg, #FF9500 0%, #FFCC00 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(0, 0, 0, 0.8)",
        zIndex: 9999,
        position: "relative",
      }}
    >
      <span
        style={{
          opacity: 0.6,
          marginRight: 8,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Dev
      </span>
      <span
        style={{
          width: 1,
          height: 14,
          background: "rgba(0, 0, 0, 0.2)",
          marginRight: 8,
        }}
      />
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
    </div>
  );
}
