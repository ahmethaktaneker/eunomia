"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./state";

gsap.registerPlugin(ScrollTrigger);

/** An endless band of words whose speed, direction and skew follow scroll velocity. */
export function Marquee({ words, size = "lg" }: { words: string[]; size?: "lg" | "sm" }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    const wrap = gsap.utils.wrap(-50, 0);
    const skew = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });
    let x = 0, boost = 0, dir = -1, visible = false;
    const st = ScrollTrigger.create({
      trigger: el, start: "top bottom", end: "bottom top",
      onToggle: self => { visible = self.isActive; },
      onUpdate: self => {
        const v = self.getVelocity();
        dir = self.direction === 1 ? -1 : 1;
        boost = Math.min(Math.abs(v) / 110, 14);
        skew(gsap.utils.clamp(-9, 9, v / -260));
      },
    });
    const tick = (_: number, dt: number) => {
      if (!visible) return;
      boost *= 0.93;
      if (boost < 0.3) skew(0);
      x = wrap(x + dir * (0.025 + boost * 0.028) * (dt / 16.67));
      gsap.set(el, { xPercent: x });
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); };
  }, []);
  const row = <div>{words.map((w, i) => <span key={i} className={i % 2 ? "mq-outline" : undefined}>{w}<i>✳</i></span>)}</div>;
  return <div className={`marquee marquee--${size}`} aria-hidden="true"><div className="marquee-track" ref={track}>{row}{row}</div></div>;
}
