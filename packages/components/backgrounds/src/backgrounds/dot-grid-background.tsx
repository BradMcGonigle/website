"use client";

import { useEffect, useRef, useCallback } from "react";

const DOT_SPACING = 28;
const DOT_RADIUS = 2;
const PULSE_DURATION = 8000; // 8 seconds, matching original CSS
const BASE_OPACITY = 0.5; // Base dot opacity before fade

export function DotGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const getComputedColor = useCallback(() => {
    if (typeof window === "undefined") return { h: 215, s: 16, l: 47 };
    const style = getComputedStyle(document.documentElement);
    const hsl = style.getPropertyValue("--muted-foreground").trim();
    if (!hsl) return { h: 215, s: 16, l: 47 };
    const parts = hsl.split(" ").map((v) => parseFloat(v));
    return { h: parts[0] ?? 215, s: parts[1] ?? 16, l: parts[2] ?? 47 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    startTimeRef.current = performance.now();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const drawDots = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const color = getComputedColor();

      // Calculate pulse opacity (ease-in-out between 0.6 and 1.0)
      const elapsed = performance.now() - startTimeRef.current;
      const progress = (elapsed % PULSE_DURATION) / PULSE_DURATION;
      // Sine wave oscillates between 0.6 and 1.0
      const pulseOpacity = 0.8 + 0.2 * Math.sin(progress * Math.PI * 2);

      ctx.clearRect(0, 0, width, height);

      // Calculate grid
      const cols = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;

      // Fade from top (matching original CSS mask)
      // mask-image: radial-gradient(ellipse 100% 70% at 50% 0%, black 20%, transparent 70%)
      const centerX = width / 2;
      const fadeStartY = height * 0.2;
      const fadeEndY = height * 0.7;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * DOT_SPACING;
          const y = row * DOT_SPACING;

          // Horizontal fade from center
          const horizontalDistance = Math.abs(x - centerX) / (width / 2);
          const horizontalFade = Math.max(0, 1 - horizontalDistance * 0.3);

          // Vertical fade from top
          let verticalFade = 1;
          if (y > fadeStartY) {
            verticalFade = Math.max(0, 1 - (y - fadeStartY) / (fadeEndY - fadeStartY));
          }

          const fadeOpacity = horizontalFade * verticalFade;
          const finalOpacity = pulseOpacity * fadeOpacity * BASE_OPACITY;
          if (finalOpacity <= 0.02) continue;

          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${finalOpacity})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(drawDots);
    };

    resizeCanvas();
    drawDots();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [getComputedColor]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-background="dot-grid"
    />
  );
}
