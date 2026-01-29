"use client";

import { useEffect, useRef, useCallback } from "react";

interface VoronoiPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}

const POINT_COUNT = 30;
const POINT_SPEED = 0.0625;
const TARGET_CHANGE_INTERVAL = 120; // frames

export function VoronoiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const pointsRef = useRef<VoronoiPoint[]>([]);
  const frameCountRef = useRef(0);

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

  const createPoint = useCallback((width: number, height: number): VoronoiPoint => {
    const x = Math.random() * width;
    const y = Math.random() * height * 0.7;
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      targetX: x,
      targetY: y,
    };
  }, []);

  const setNewTarget = useCallback((point: VoronoiPoint, width: number, height: number) => {
    point.targetX = Math.random() * width;
    point.targetY = Math.random() * height * 0.7;
  }, []);

  // Find the two closest points to a given position
  const findClosestPoints = useCallback(
    (
      x: number,
      y: number,
      points: VoronoiPoint[]
    ): { closest: VoronoiPoint | null; secondClosest: VoronoiPoint | null; minDist: number; secondMinDist: number } => {
      let closest: VoronoiPoint | null = null;
      let secondClosest: VoronoiPoint | null = null;
      let minDist = Infinity;
      let secondMinDist = Infinity;

      for (const point of points) {
        const dx = x - point.x;
        const dy = y - point.y;
        const dist = dx * dx + dy * dy;

        if (dist < minDist) {
          secondMinDist = minDist;
          secondClosest = closest;
          minDist = dist;
          closest = point;
        } else if (dist < secondMinDist) {
          secondMinDist = dist;
          secondClosest = point;
        }
      }

      return { closest, secondClosest, minDist, secondMinDist };
    },
    []
  );

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

      // Reinitialize points on resize
      pointsRef.current = Array.from({ length: POINT_COUNT }, () => createPoint(width, height));
    };

    const draw = () => {
      const color = getComputedColor();
      const points = pointsRef.current;
      const frameCount = frameCountRef.current;
      const opacityMult = getOpacityMultiplier();

      ctx.clearRect(0, 0, width, height);

      // Update points - smooth movement towards targets
      for (const point of points) {
        // Occasionally set new target
        if (frameCount % TARGET_CHANGE_INTERVAL === Math.floor(Math.random() * TARGET_CHANGE_INTERVAL)) {
          setNewTarget(point, width, height);
        }

        // Move towards target with easing
        const dx = point.targetX - point.x;
        const dy = point.targetY - point.y;
        point.vx = point.vx * 0.95 + dx * 0.002;
        point.vy = point.vy * 0.95 + dy * 0.002;
        point.x += point.vx * POINT_SPEED;
        point.y += point.vy * POINT_SPEED;

        // Keep within bounds
        if (point.x < 0 || point.x > width) {
          point.vx *= -0.5;
          point.x = Math.max(0, Math.min(width, point.x));
        }
        if (point.y < 0 || point.y > height * 0.7) {
          point.vy *= -0.5;
          point.y = Math.max(0, Math.min(height * 0.7, point.y));
        }
      }

      // Vertical fade boundaries
      const fadeStartY = height * 0.45;
      const fadeEndY = height * 0.75;

      // Draw Voronoi edges by sampling points and detecting cell boundaries
      const resolution = 6;
      const edgeThreshold = 15; // Distance difference threshold for edge detection

      ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, 0.15)`;

      for (let y = 0; y < height; y += resolution) {
        for (let x = 0; x < width; x += resolution) {
          const { minDist, secondMinDist } = findClosestPoints(x, y, points);

          // If the difference between closest and second closest is small, we're near an edge
          const distDiff = Math.sqrt(secondMinDist) - Math.sqrt(minDist);

          if (distDiff < edgeThreshold) {
            let opacity = (1 - distDiff / edgeThreshold) * 0.2;

            // Vertical fade
            if (y > fadeStartY) {
              const fadeFactor = Math.max(0, 1 - (y - fadeStartY) / (fadeEndY - fadeStartY));
              opacity *= fadeFactor;
            }

            const finalOpacity = opacity * opacityMult;
            if (finalOpacity > 0.01) {
              ctx.globalAlpha = finalOpacity;
              ctx.fillRect(x, y, resolution, resolution);
            }
          }
        }
      }

      ctx.globalAlpha = 1;

      // Draw cell centers (seed points)
      for (const point of points) {
        let opacity = 0.4;

        // Vertical fade for points
        if (point.y > fadeStartY) {
          const fadeFactor = Math.max(0, 1 - (point.y - fadeStartY) / (fadeEndY - fadeStartY));
          opacity *= fadeFactor;
        }

        const pointOpacity = opacity * opacityMult;
        if (pointOpacity > 0.01) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${pointOpacity})`;
          ctx.fill();
        }
      }

      // Draw connections between neighboring cells (Delaunay-like)
      ctx.lineWidth = 1;
      const connectionDistance = 200;

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        if (!p1) continue;

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          if (!p2) continue;

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            let opacity = (1 - dist / connectionDistance) * 0.15;

            // Vertical fade for lines
            const avgY = (p1.y + p2.y) / 2;
            if (avgY > fadeStartY) {
              const fadeFactor = Math.max(0, 1 - (avgY - fadeStartY) / (fadeEndY - fadeStartY));
              opacity *= fadeFactor;
            }

            const lineOpacity = opacity * opacityMult;
            if (lineOpacity > 0.01) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${lineOpacity})`;
              ctx.stroke();
            }
          }
        }
      }

      frameCountRef.current = frameCount + 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [getComputedColor, createPoint, setNewTarget, findClosestPoints, getOpacityMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-background="voronoi"
    />
  );
}
