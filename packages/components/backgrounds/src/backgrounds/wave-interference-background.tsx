"use client";

import { useEffect, useRef, useCallback } from "react";

interface WaveSource {
  x: number;
  y: number;
  vx: number;
  vy: number;
  frequency: number;
  phase: number;
}

const SOURCE_COUNT = 5;
const WAVE_SPEED = 0.0105;
const SOURCE_SPEED = 0.105;

export function WaveInterferenceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const sourcesRef = useRef<WaveSource[]>([]);
  const timeRef = useRef(0);

  const getComputedColor = useCallback(() => {
    if (typeof window === "undefined") return { h: 215, s: 16, l: 47 };
    const style = getComputedStyle(document.documentElement);
    const hsl = style.getPropertyValue("--muted-foreground").trim();
    if (!hsl) return { h: 215, s: 16, l: 47 };
    const parts = hsl.split(" ").map((v) => parseFloat(v));
    return { h: parts[0] ?? 215, s: parts[1] ?? 16, l: parts[2] ?? 47 };
  }, []);

  const isDarkMode = useCallback(() => {
    if (typeof window === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  }, []);

  const getOpacityMultiplier = useCallback(() => {
    return isDarkMode() ? 1 : 0.5;
  }, [isDarkMode]);

  const createSource = useCallback((width: number, height: number): WaveSource => {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.6,
      vx: Math.cos(angle) * SOURCE_SPEED,
      vy: Math.sin(angle) * SOURCE_SPEED,
      frequency: 0.015 + Math.random() * 0.01,
      phase: Math.random() * Math.PI * 2,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Reinitialize sources on resize
      sourcesRef.current = Array.from({ length: SOURCE_COUNT }, () =>
        createSource(width, height)
      );
    };

    const draw = () => {
      const color = getComputedColor();
      const time = timeRef.current;
      const sources = sourcesRef.current;
      const opacityMult = getOpacityMultiplier();

      ctx.clearRect(0, 0, width, height);

      // Update source positions
      for (const source of sources) {
        source.x += source.vx;
        source.y += source.vy;

        // Bounce off edges
        if (source.x < 0 || source.x > width) {
          source.vx *= -1;
          source.x = Math.max(0, Math.min(width, source.x));
        }
        if (source.y < 0 || source.y > height * 0.6) {
          source.vy *= -1;
          source.y = Math.max(0, Math.min(height * 0.6, source.y));
        }
      }

      // Draw wave interference pattern using concentric rings
      const resolution = 4;
      const fadeStartY = height * 0.5;
      const fadeEndY = height * 0.8;

      // Draw contour lines at regular intervals
      const contourSpacing = 30;
      const maxRadius = Math.max(width, height) * 1.5;
      const numContours = Math.ceil(maxRadius / contourSpacing);

      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      for (const source of sources) {
        for (let c = 0; c < numContours; c++) {
          const baseRadius = c * contourSpacing;
          const waveOffset = (time * WAVE_SPEED * 60) % contourSpacing;
          const radius = baseRadius + waveOffset;

          if (radius < 5) continue;

          // Calculate opacity based on distance from source
          const distanceOpacity = Math.max(0, 1 - radius / (maxRadius * 0.5));

          // Draw the ring as segments to apply fade per-segment
          const segments = 60;
          ctx.beginPath();

          for (let s = 0; s <= segments; s++) {
            const angle = (s / segments) * Math.PI * 2;
            const px = source.x + Math.cos(angle) * radius;
            const py = source.y + Math.sin(angle) * radius;

            if (s === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }

          ctx.closePath();
          ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${distanceOpacity * 0.12 * opacityMult})`;
          ctx.stroke();
        }
      }

      // Draw interference highlights where waves overlap
      for (let y = 0; y < height; y += resolution * 3) {
        for (let x = 0; x < width; x += resolution * 3) {
          let totalWave = 0;

          for (const source of sources) {
            const dx = x - source.x;
            const dy = y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const wave = Math.sin(distance * source.frequency - time * WAVE_SPEED + source.phase);
            totalWave += wave;
          }

          // Normalize and check for constructive interference
          const normalizedWave = totalWave / sources.length;
          const intensity = Math.abs(normalizedWave);

          if (intensity > 0.7) {
            let opacity = (intensity - 0.7) / 0.3 * 0.2;

            // Vertical fade
            if (y > fadeStartY) {
              const fadeFactor = Math.max(0, 1 - (y - fadeStartY) / (fadeEndY - fadeStartY));
              opacity *= fadeFactor;
            }

            const finalOpacity = opacity * opacityMult;
            if (finalOpacity > 0.01) {
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${finalOpacity})`;
              ctx.fill();
            }
          }
        }
      }

      timeRef.current = time + 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [getComputedColor, createSource, getOpacityMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      aria-hidden="true"
      data-background="wave-interference"
    />
  );
}
