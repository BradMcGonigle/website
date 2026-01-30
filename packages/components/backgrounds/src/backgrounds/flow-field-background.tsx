"use client";

import { useEffect, useRef, useCallback } from "react";

// Simple 2D noise for flow field
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

interface ParticlePosition {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  vx: number;
  vy: number;
  history: ParticlePosition[];
}

const PARTICLE_COUNT = 800;
const NOISE_SCALE = 0.003;
const SPEED = 0.8;
const MAX_AGE_BASE = 100;
const MAX_AGE_VARIANCE = 100;
const TRAIL_LENGTH = 20;

export function FlowFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const noiseRef = useRef<ReturnType<typeof createNoise> | null>(null);
  const particlesRef = useRef<Particle[]>([]);
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

  const createParticle = useCallback((width: number, height: number): Particle => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    return {
      x,
      y,
      age: 0,
      maxAge: MAX_AGE_BASE + Math.random() * MAX_AGE_VARIANCE,
      vx: 0,
      vy: 0,
      history: [{ x, y }],
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    noiseRef.current = createNoise();

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

      // Reinitialize particles on resize
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(width, height)
      );
    };

    const draw = () => {
      const noise = noiseRef.current;
      if (!noise) return;

      const color = getComputedColor();
      const time = timeRef.current;
      const opacityMult = getOpacityMultiplier();

      // Clear canvas each frame (transparent background)
      ctx.clearRect(0, 0, width, height);

      // Fade mask from bottom
      const fadeStartY = height * 0.5;
      const fadeEndY = height * 0.85;

      for (const particle of particlesRef.current) {
        // Get flow field angle from noise
        const angle =
          noise(particle.x * NOISE_SCALE, particle.y * NOISE_SCALE + time * 0.0001) *
          Math.PI *
          4;

        // Update velocity with some smoothing
        particle.vx = particle.vx * 0.9 + Math.cos(angle) * SPEED * 0.1;
        particle.vy = particle.vy * 0.9 + Math.sin(angle) * SPEED * 0.1;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.age++;

        // Add current position to history
        particle.history.push({ x: particle.x, y: particle.y });
        if (particle.history.length > TRAIL_LENGTH) {
          particle.history.shift();
        }

        // Calculate opacity based on age (fade in and out)
        const ageRatio = particle.age / particle.maxAge;
        let baseOpacity = 1;
        if (ageRatio < 0.1) {
          baseOpacity = ageRatio / 0.1;
        } else if (ageRatio > 0.8) {
          baseOpacity = (1 - ageRatio) / 0.2;
        }

        // Draw trail from history
        if (particle.history.length > 1) {
          for (let i = 1; i < particle.history.length; i++) {
            const prev = particle.history[i - 1];
            const curr = particle.history[i];
            if (!prev || !curr) continue;

            // Trail fades toward the tail
            const trailRatio = i / particle.history.length;
            let opacity = baseOpacity * trailRatio;

            // Apply vertical fade
            if (curr.y > fadeStartY) {
              const fadeFactor = 1 - (curr.y - fadeStartY) / (fadeEndY - fadeStartY);
              opacity *= Math.max(0, fadeFactor);
            }

            const finalOpacity = opacity * 0.21 * opacityMult;
            if (finalOpacity > 0.01) {
              ctx.beginPath();
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(curr.x, curr.y);
              ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${finalOpacity})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // Reset particle if it's too old or out of bounds
        if (
          particle.age >= particle.maxAge ||
          particle.x < 0 ||
          particle.x > width ||
          particle.y < 0 ||
          particle.y > height
        ) {
          const newParticle = createParticle(width, height);
          particle.x = newParticle.x;
          particle.y = newParticle.y;
          particle.age = 0;
          particle.maxAge = newParticle.maxAge;
          particle.vx = 0;
          particle.vy = 0;
          particle.history = [{ x: particle.x, y: particle.y }];
        }
      }

      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [getComputedColor, createParticle, getOpacityMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      aria-hidden="true"
      data-background="flow-field"
    />
  );
}
