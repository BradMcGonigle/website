"use client";

import { useEffect, useRef, useCallback } from "react";

interface ItemBox {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  bobPhase: number;
  bobSpeed: number;
}

interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  sparklePhase: number;
}

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  life: number;
  maxLife: number;
}

interface RainbowTrail {
  points: { x: number; y: number }[];
  width: number;
  speed: number;
  offset: number;
}

const ITEM_BOX_COUNT = 8;
const COIN_COUNT = 20;
const RAINBOW_TRAIL_COUNT = 3;
const STAR_CHANCE = 0.003;

// Rainbow colors for the trails
const RAINBOW_COLORS = [
  { h: 0, s: 80, l: 60 },    // Red
  { h: 30, s: 90, l: 55 },   // Orange
  { h: 55, s: 90, l: 50 },   // Yellow
  { h: 120, s: 60, l: 45 },  // Green
  { h: 200, s: 80, l: 55 },  // Blue
  { h: 270, s: 70, l: 60 },  // Purple
];

export function MarioKartBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const itemBoxesRef = useRef<ItemBox[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const starsRef = useRef<Star[]>([]);
  const trailsRef = useRef<RainbowTrail[]>([]);
  const timeRef = useRef(0);

  const isDarkMode = useCallback(() => {
    if (typeof window === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  }, []);

  const getOpacityMultiplier = useCallback(() => {
    return isDarkMode() ? 0.6 : 0.35;
  }, [isDarkMode]);

  const createItemBox = useCallback((width: number, height: number): ItemBox => {
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      size: 25 + Math.random() * 15,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      bobPhase: Math.random() * Math.PI * 2,
      bobSpeed: 0.02 + Math.random() * 0.02,
    };
  }, []);

  const createCoin = useCallback((width: number, height: number): Coin => {
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 6 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: 0.03 + Math.random() * 0.03,
      sparklePhase: Math.random() * Math.PI * 2,
    };
  }, []);

  const createStar = useCallback((_width: number): Star => {
    const startY = Math.random() * 200;
    const angle = Math.PI / 6 + Math.random() * (Math.PI / 6);
    const speed = 6 + Math.random() * 4;
    return {
      x: -50,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 20 + Math.random() * 15,
      rotation: 0,
      life: 0,
      maxLife: 120 + Math.random() * 60,
    };
  }, []);

  const createRainbowTrail = useCallback((width: number, height: number, index: number): RainbowTrail => {
    const points: { x: number; y: number }[] = [];
    const startY = height * 0.2 + (index * height * 0.25);

    for (let i = 0; i <= 20; i++) {
      points.push({
        x: (i / 20) * (width + 200) - 100,
        y: startY,
      });
    }

    return {
      points,
      width: 40 + index * 10,
      speed: 0.5 + index * 0.2,
      offset: index * 2,
    };
  }, []);

  const drawItemBox = useCallback((
    ctx: CanvasRenderingContext2D,
    box: ItemBox,
    time: number,
    opacityMult: number
  ) => {
    const bobOffset = Math.sin(box.bobPhase + time * box.bobSpeed) * 5;
    const y = box.y + bobOffset;

    ctx.save();
    ctx.translate(box.x, y);
    ctx.rotate(box.rotation);

    // Draw cube (simplified 3D effect)
    const size = box.size;
    const halfSize = size / 2;

    // Main face - yellow/orange
    ctx.fillStyle = `hsla(45, 90%, 55%, ${0.7 * opacityMult})`;
    ctx.fillRect(-halfSize, -halfSize, size, size);

    // Border
    ctx.strokeStyle = `hsla(30, 80%, 35%, ${0.8 * opacityMult})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(-halfSize, -halfSize, size, size);

    // Question mark
    ctx.fillStyle = `hsla(0, 0%, 100%, ${0.9 * opacityMult})`;
    ctx.font = `bold ${size * 0.6}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", 0, 0);

    ctx.restore();
  }, []);

  const drawCoin = useCallback((
    ctx: CanvasRenderingContext2D,
    coin: Coin,
    time: number,
    opacityMult: number
  ) => {
    const sparkle = 0.7 + 0.3 * Math.sin(coin.sparklePhase + time * 0.05);
    const scaleX = Math.cos(coin.rotation);

    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.scale(scaleX, 1);

    // Coin body
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(45, 100%, ${50 + sparkle * 15}%, ${0.8 * opacityMult})`;
    ctx.fill();

    // Coin edge/shine
    ctx.strokeStyle = `hsla(35, 100%, 40%, ${0.6 * opacityMult})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner detail
    if (Math.abs(scaleX) > 0.3) {
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(40, 90%, 65%, ${0.5 * opacityMult})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawStar = useCallback((
    ctx: CanvasRenderingContext2D,
    star: Star,
    opacityMult: number
  ) => {
    const lifeRatio = star.life / star.maxLife;
    let opacity = 1;
    if (lifeRatio < 0.1) {
      opacity = lifeRatio / 0.1;
    } else if (lifeRatio > 0.7) {
      opacity = (1 - lifeRatio) / 0.3;
    }

    ctx.save();
    ctx.translate(star.x, star.y);
    ctx.rotate(star.rotation);

    const size = star.size;
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = size / 4;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Rainbow gradient for the star
    const hue = (star.life * 3) % 360;
    ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${opacity * 0.9 * opacityMult})`;
    ctx.fill();
    ctx.strokeStyle = `hsla(${hue}, 90%, 40%, ${opacity * 0.7 * opacityMult})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }, []);

  const drawRainbowTrail = useCallback((
    ctx: CanvasRenderingContext2D,
    trail: RainbowTrail,
    time: number,
    _width: number,
    height: number,
    opacityMult: number
  ) => {
    // Update trail points with sine wave
    for (let i = 0; i < trail.points.length; i++) {
      const point = trail.points[i];
      if (!point) continue;
      const baseY = height * 0.3 + trail.offset * height * 0.15;
      const wave1 = Math.sin((i * 0.3) + time * 0.02 * trail.speed + trail.offset) * 50;
      const wave2 = Math.sin((i * 0.15) + time * 0.015 * trail.speed + trail.offset * 2) * 30;
      point.y = baseY + wave1 + wave2;
    }

    // Draw the rainbow trail as multiple colored stripes
    const stripeWidth = trail.width / RAINBOW_COLORS.length;

    for (let c = 0; c < RAINBOW_COLORS.length; c++) {
      const color = RAINBOW_COLORS[c];
      if (!color) continue;

      ctx.beginPath();

      const offset = (c - RAINBOW_COLORS.length / 2) * stripeWidth;

      for (let i = 0; i < trail.points.length; i++) {
        const point = trail.points[i];
        if (!point) continue;
        const x = point.x;
        const y = point.y + offset;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prev = trail.points[i - 1];
          if (prev) {
            const cpX = (prev.x + x) / 2;
            const cpY = (prev.y + offset + y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y + offset, cpX, cpY);
          }
        }
      }

      ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${0.4 * opacityMult})`;
      ctx.lineWidth = stripeWidth + 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
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

      // Reinitialize elements on resize
      itemBoxesRef.current = Array.from({ length: ITEM_BOX_COUNT }, () => createItemBox(width, height));
      coinsRef.current = Array.from({ length: COIN_COUNT }, () => createCoin(width, height));
      trailsRef.current = Array.from({ length: RAINBOW_TRAIL_COUNT }, (_, i) => createRainbowTrail(width, height, i));
    };

    const draw = () => {
      const time = timeRef.current;
      const opacityMult = getOpacityMultiplier();
      const fadeStartY = height * 0.6;
      const fadeEndY = height * 0.85;

      ctx.clearRect(0, 0, width, height);

      // Draw rainbow trails in background
      for (const trail of trailsRef.current) {
        drawRainbowTrail(ctx, trail, time, width, height, opacityMult);
      }

      // Update and draw item boxes
      for (const box of itemBoxesRef.current) {
        box.x += box.vx;
        box.y += box.vy;
        box.rotation += box.rotationSpeed;

        // Bounce off edges
        if (box.x < box.size || box.x > width - box.size) box.vx *= -1;
        if (box.y < box.size || box.y > height * 0.5) box.vy *= -1;

        // Keep in bounds
        box.x = Math.max(box.size, Math.min(width - box.size, box.x));
        box.y = Math.max(box.size, Math.min(height * 0.5, box.y));

        // Vertical fade
        let fadeOpacity = opacityMult;
        if (box.y > fadeStartY) {
          fadeOpacity *= Math.max(0, 1 - (box.y - fadeStartY) / (fadeEndY - fadeStartY));
        }

        if (fadeOpacity > 0.01) {
          drawItemBox(ctx, box, time, fadeOpacity);
        }
      }

      // Update and draw coins
      for (const coin of coinsRef.current) {
        coin.x += coin.vx;
        coin.y += coin.vy;
        coin.rotation += coin.rotationSpeed;

        // Bounce off edges
        if (coin.x < coin.radius || coin.x > width - coin.radius) coin.vx *= -1;
        if (coin.y < coin.radius || coin.y > height * 0.6) coin.vy *= -1;

        // Keep in bounds
        coin.x = Math.max(coin.radius, Math.min(width - coin.radius, coin.x));
        coin.y = Math.max(coin.radius, Math.min(height * 0.6, coin.y));

        // Vertical fade
        let fadeOpacity = opacityMult;
        if (coin.y > fadeStartY) {
          fadeOpacity *= Math.max(0, 1 - (coin.y - fadeStartY) / (fadeEndY - fadeStartY));
        }

        if (fadeOpacity > 0.01) {
          drawCoin(ctx, coin, time, fadeOpacity);
        }
      }

      // Maybe spawn a star
      if (Math.random() < STAR_CHANCE) {
        starsRef.current.push(createStar(width));
      }

      // Update and draw stars
      const stars = starsRef.current;
      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        if (!star) continue;

        star.x += star.vx;
        star.y += star.vy;
        star.rotation += 0.1;
        star.life++;

        if (star.life >= star.maxLife || star.x > width + 50 || star.y > height) {
          stars.splice(i, 1);
          continue;
        }

        drawStar(ctx, star, opacityMult);
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
  }, [
    getOpacityMultiplier,
    createItemBox,
    createCoin,
    createStar,
    createRainbowTrail,
    drawItemBox,
    drawCoin,
    drawStar,
    drawRainbowTrail,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      aria-hidden="true"
      data-background="mario-kart"
    />
  );
}
