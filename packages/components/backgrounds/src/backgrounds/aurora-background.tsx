"use client";

import { useEffect, useRef, useCallback } from "react";

interface Ribbon {
  baseY: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  width: number;
  opacity: number;
}

const RIBBON_COUNT = 6;

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const ribbonsRef = useRef<Ribbon[]>([]);
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

  const createRibbon = useCallback((index: number, height: number): Ribbon => {
    return {
      baseY: height * (0.1 + (index / RIBBON_COUNT) * 0.4),
      amplitude: 30 + Math.random() * 50,
      frequency: 0.002 + Math.random() * 0.002,
      speed: 0.000103 + Math.random() * 0.000137,
      phase: Math.random() * Math.PI * 2,
      width: 80 + Math.random() * 120,
      opacity: 0.056 + Math.random() * 0.07,
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

      // Reinitialize ribbons on resize
      ribbonsRef.current = Array.from({ length: RIBBON_COUNT }, (_, i) =>
        createRibbon(i, height)
      );
    };

    const draw = () => {
      const color = getComputedColor();
      const time = timeRef.current;
      const ribbons = ribbonsRef.current;
      const opacityMult = getOpacityMultiplier();

      ctx.clearRect(0, 0, width, height);

      // Vertical fade boundaries
      const fadeStartY = height * 0.4;
      const fadeEndY = height * 0.75;

      for (const ribbon of ribbons) {
        const timeOffset = time * ribbon.speed;

        // Create the ribbon path with wavy top and bottom edges
        ctx.beginPath();

        const points: { x: number; topY: number; bottomY: number }[] = [];
        const step = 8;

        for (let x = -step; x <= width + step; x += step) {
          // Multiple sine waves for organic movement
          const wave1 = Math.sin(x * ribbon.frequency + timeOffset + ribbon.phase) * ribbon.amplitude;
          const wave2 = Math.sin(x * ribbon.frequency * 2.3 + timeOffset * 1.3) * ribbon.amplitude * 0.3;
          const wave3 = Math.sin(x * ribbon.frequency * 0.7 + timeOffset * 0.7 + ribbon.phase * 2) * ribbon.amplitude * 0.4;

          const centerY = ribbon.baseY + wave1 + wave2 + wave3;
          const halfWidth = ribbon.width / 2;

          // Slight variation in width along the ribbon
          const widthVar = Math.sin(x * 0.005 + timeOffset * 0.5) * 20;

          points.push({
            x,
            topY: centerY - halfWidth - widthVar,
            bottomY: centerY + halfWidth + widthVar,
          });
        }

        // Draw top edge
        const firstPoint = points[0];
        if (firstPoint) {
          ctx.moveTo(firstPoint.x, firstPoint.topY);
        }
        for (let i = 1; i < points.length; i++) {
          const point = points[i];
          if (point) {
            ctx.lineTo(point.x, point.topY);
          }
        }

        // Draw bottom edge (reversed)
        for (let i = points.length - 1; i >= 0; i--) {
          const point = points[i];
          if (point) {
            ctx.lineTo(point.x, point.bottomY);
          }
        }

        ctx.closePath();

        // Create gradient fill for the ribbon
        const gradient = ctx.createLinearGradient(0, ribbon.baseY - ribbon.width, 0, ribbon.baseY + ribbon.width);

        // Calculate fade based on ribbon position
        let opacityMod = 1;
        if (ribbon.baseY > fadeStartY) {
          opacityMod = Math.max(0, 1 - (ribbon.baseY - fadeStartY) / (fadeEndY - fadeStartY));
        }

        const baseOpacity = ribbon.opacity * opacityMod * opacityMult;
        gradient.addColorStop(0, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);
        gradient.addColorStop(0.3, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${baseOpacity})`);
        gradient.addColorStop(0.5, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${baseOpacity * 1.2})`);
        gradient.addColorStop(0.7, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${baseOpacity})`);
        gradient.addColorStop(1, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Add subtle edge glow
        ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${baseOpacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Add some shimmer particles
      const shimmerCount = 30;
      for (let i = 0; i < shimmerCount; i++) {
        const shimmerX = (Math.sin(i * 1.7 + time * 0.001) * 0.5 + 0.5) * width;
        const shimmerY = (Math.sin(i * 2.3 + time * 0.0008) * 0.5 + 0.5) * height * 0.5;
        const shimmerOpacity = (Math.sin(i * 3.1 + time * 0.003) * 0.5 + 0.5) * 0.15;

        // Vertical fade for shimmer
        let fadedOpacity = shimmerOpacity;
        if (shimmerY > fadeStartY) {
          const fadeFactor = Math.max(0, 1 - (shimmerY - fadeStartY) / (fadeEndY - fadeStartY));
          fadedOpacity *= fadeFactor;
        }

        const shimmerFinalOpacity = fadedOpacity * opacityMult;
        if (shimmerFinalOpacity > 0.01) {
          ctx.beginPath();
          ctx.arc(shimmerX, shimmerY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l + 10}%, ${shimmerFinalOpacity})`;
          ctx.fill();
        }
      }

      timeRef.current = time + 16; // Approximate 60fps
      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [getComputedColor, createRibbon, getOpacityMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      aria-hidden="true"
      data-background="aurora"
    />
  );
}
