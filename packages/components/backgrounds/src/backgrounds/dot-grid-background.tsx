"use client";

import { useEffect, useRef, useCallback } from "react";

const DOT_SPACING = 28;
const DOT_RADIUS = 1.5;
const PULSE_DURATION = 8000; // 8 seconds, matching original CSS

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
      // Sine wave for smooth ease-in-out: goes from 0.6 to 1.0 and back
      const pulseOpacity = 0.6 + 0.4 * Math.sin(progress * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.2;

      ctx.clearRect(0, 0, width, height);

      // Calculate grid
      const cols = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;

      // Fade parameters matching original CSS mask
      // mask-image: radial-gradient(ellipse 100% 70% at 50% 0%, black 20%, transparent 70%)
      const centerX = width / 2;
      const ellipseWidth = width;
      const ellipseHeight = height * 0.7;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * DOT_SPACING;
          const y = row * DOT_SPACING;

          // Calculate distance from top-center using ellipse formula
          const dx = (x - centerX) / (ellipseWidth / 2);
          const dy = y / ellipseHeight;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Fade based on distance (20% to 70% of ellipse)
          let fadeOpacity = 1;
          if (distance > 0.2) {
            fadeOpacity = Math.max(0, 1 - (distance - 0.2) / 0.5);
          }

          const finalOpacity = pulseOpacity * fadeOpacity * 0.5;
          if (finalOpacity <= 0) continue;

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
    />
  );
}
