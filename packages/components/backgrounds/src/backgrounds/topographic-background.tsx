"use client";

import { useEffect, useRef, useCallback } from "react";

// Simple 2D noise implementation
function createNoise() {
  const permutation = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const valI = permutation[i];
    const valJ = permutation[j];
    if (valI !== undefined && valJ !== undefined) {
      permutation[i] = valJ;
      permutation[j] = valI;
    }
  }
  const p = [...permutation, ...permutation];

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a: number, b: number, t: number) {
    return a + t * (b - a);
  }

  function grad(hash: number, x: number, y: number) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  return function noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = (p[X] ?? 0) + Y;
    const B = (p[X + 1] ?? 0) + Y;
    return lerp(
      lerp(grad(p[A] ?? 0, x, y), grad(p[B] ?? 0, x - 1, y), u),
      lerp(grad(p[A + 1] ?? 0, x, y - 1), grad(p[B + 1] ?? 0, x - 1, y - 1), u),
      v
    );
  };
}

const CONTOUR_LEVELS = 8;
const SCALE = 0.003;
const SPEED = 0.00004;

export function TopographicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const noiseRef = useRef<ReturnType<typeof createNoise> | null>(null);
  const timeRef = useRef(0);

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

    noiseRef.current = createNoise();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const drawContours = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const noise = noiseRef.current;
      if (!noise) return;

      const color = getComputedColor();
      const time = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      // Higher resolution for smoother lines
      const resolution = 6;
      const cols = Math.ceil(width / resolution) + 1;
      const rows = Math.ceil(height / resolution) + 1;

      // Generate noise values
      const values: number[][] = [];
      for (let y = 0; y < rows; y++) {
        values[y] = [];
        for (let x = 0; x < cols; x++) {
          const nx = x * resolution * SCALE;
          const ny = y * resolution * SCALE;
          // Layer multiple octaves for more interesting terrain
          let value = noise(nx + time, ny + time * 0.7) * 0.6;
          value += noise(nx * 2 + time * 0.5, ny * 2) * 0.3;
          value += noise(nx * 4, ny * 4 + time * 0.3) * 0.1;
          const row = values[y];
          if (row) {
            row[x] = value;
          }
        }
      }

      // Interpolation helper - find where threshold crosses between two values
      const interpolate = (v1: number, v2: number, threshold: number) => {
        if (Math.abs(v2 - v1) < 0.0001) return 0.5;
        return (threshold - v1) / (v2 - v1);
      };

      // Draw contour lines using marching squares with interpolation
      for (let level = 0; level < CONTOUR_LEVELS; level++) {
        const threshold = -0.5 + level / CONTOUR_LEVELS;
        const opacity = 0.08 + (level / CONTOUR_LEVELS) * 0.15;
        const fadeY = height * 0.6;

        ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${opacity})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        for (let y = 0; y < rows - 1; y++) {
          for (let x = 0; x < cols - 1; x++) {
            const px = x * resolution;
            const py = y * resolution;

            const fadeFactor = py > fadeY ? 1 - (py - fadeY) / (height - fadeY) : 1;
            if (fadeFactor <= 0) continue;

            // Get actual values at corners
            const tlVal = values[y]?.[x] ?? 0;
            const trVal = values[y]?.[x + 1] ?? 0;
            const brVal = values[y + 1]?.[x + 1] ?? 0;
            const blVal = values[y + 1]?.[x] ?? 0;

            const tl = tlVal > threshold ? 1 : 0;
            const tr = trVal > threshold ? 1 : 0;
            const br = brVal > threshold ? 1 : 0;
            const bl = blVal > threshold ? 1 : 0;

            const cell = tl * 8 + tr * 4 + br * 2 + bl;
            if (cell === 0 || cell === 15) continue;

            // Interpolated edge positions
            const topT = interpolate(tlVal, trVal, threshold);
            const rightT = interpolate(trVal, brVal, threshold);
            const bottomT = interpolate(blVal, brVal, threshold);
            const leftT = interpolate(tlVal, blVal, threshold);

            const top = { x: px + topT * resolution, y: py };
            const right = { x: px + resolution, y: py + rightT * resolution };
            const bottom = { x: px + bottomT * resolution, y: py + resolution };
            const left = { x: px, y: py + leftT * resolution };

            const drawLine = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            };

            switch (cell) {
              case 1:
              case 14:
                drawLine(left, bottom);
                break;
              case 2:
              case 13:
                drawLine(bottom, right);
                break;
              case 3:
              case 12:
                drawLine(left, right);
                break;
              case 4:
              case 11:
                drawLine(top, right);
                break;
              case 5:
                drawLine(top, left);
                drawLine(bottom, right);
                break;
              case 6:
              case 9:
                drawLine(top, bottom);
                break;
              case 7:
              case 8:
                drawLine(top, left);
                break;
              case 10:
                drawLine(top, right);
                drawLine(left, bottom);
                break;
            }
          }
        }

        ctx.stroke();
      }

      timeRef.current += SPEED * 16; // Approximate 60fps timing
      animationRef.current = requestAnimationFrame(drawContours);
    };

    resizeCanvas();
    drawContours();

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
