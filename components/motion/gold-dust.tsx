"use client";

import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; z: number; vx: number; vy: number; phase: number };

/**
 * Drifting gold motes with depth: nearer motes are larger, brighter and move
 * faster. The pointer pushes them aside and scrolling stirs them. The canvas
 * pauses while off screen and draws a still frame for reduced motion.
 */
export function GoldDust({ count = 170 }: { count?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current!;
    const host = el.parentElement!;
    const ctx = el.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const pointer = { x: -9999, y: -9999 };
    let lastScroll = window.scrollY, stir = 0;

    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const s = sprite.getContext("2d")!;
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(236,214,160,1)");
    g.addColorStop(0.25, "rgba(201,169,106,.55)");
    g.addColorStop(1, "rgba(183,164,134,0)");
    s.fillStyle = g; s.fillRect(0, 0, 64, 64);

    let motes: Mote[] = [];
    const seed = () => {
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: 0.15 + Math.random() ** 1.6 * 0.85,
        vx: 0, vy: 0, phase: Math.random() * Math.PI * 2,
      }));
    };
    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      el.width = w * dpr; el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!motes.length) seed();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const dy = window.scrollY - lastScroll; lastScroll = window.scrollY;
      stir = stir * 0.9 + dy * 0.02;
      for (const m of motes) {
        if (!reduce) {
          const dx = m.x - pointer.x, dyp = m.y - pointer.y, d2 = dx * dx + dyp * dyp, reach = 150 * m.z;
          if (d2 < reach * reach) {
            const d = Math.sqrt(d2) || 1, f = (1 - d / reach) * 1.6 * m.z;
            m.vx += (dx / d) * f; m.vy += (dyp / d) * f;
          }
          m.vx += Math.sin(t * 0.0004 + m.phase) * 0.006;
          m.vy += -0.012 * m.z - stir * m.z * 0.08;
          m.vx *= 0.94; m.vy *= 0.94;
          m.x += m.vx; m.y += m.vy;
          if (m.y < -20) { m.y = h + 20; m.x = Math.random() * w; }
          if (m.y > h + 20) m.y = -20;
          if (m.x < -20) m.x = w + 20; else if (m.x > w + 20) m.x = -20;
        }
        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.0015 + m.phase * 3);
        const size = (2 + m.z * 9) * (0.8 + twinkle * 0.3);
        ctx.globalAlpha = (0.18 + m.z * 0.6) * twinkle;
        ctx.drawImage(sprite, m.x - size / 2, m.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => { if (visible) draw(t); raf = requestAnimationFrame(loop); };

    const move = (e: PointerEvent) => { const r = host.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };
    const leave = () => { pointer.x = pointer.y = -9999; };
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    ro.observe(host); io.observe(host);
    resize();
    if (reduce) draw(0);
    else {
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave);
    };
  }, [count]);
  return <canvas ref={canvas} className="gold-dust" aria-hidden="true" />;
}
