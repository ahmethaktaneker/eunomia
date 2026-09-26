"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "./state";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Fixed chapter index for the front page, built from sections marked data-chapter-title. */
export function ChapterRail() {
  const [chapters, setChapters] = useState<{ title: string; el: HTMLElement }[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-chapter-title]")];
    const triggers = els.map((el, i) => ScrollTrigger.create({
      trigger: el, start: "top 55%", end: "bottom 55%",
      onToggle: self => { if (self.isActive) setActive(i); },
    }));
    const frame = requestAnimationFrame(() => setChapters(els.map(el => ({ title: el.dataset.chapterTitle!, el }))));
    return () => { cancelAnimationFrame(frame); triggers.forEach(t => t.kill()); };
  }, []);
  if (!chapters.length) return null;
  const go = (el: HTMLElement) => {
    if (motion.lenis) motion.lenis.scrollTo(el, { offset: -20, duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  return <nav className="chapter-rail" aria-label="Chapters">
    <ol>{chapters.map((c, i) => <li key={c.title} aria-current={i === active ? "step" : undefined}>
      <button type="button" onClick={() => go(c.el)}><span className="rail-num">{ROMAN[i]}</span><span className="rail-title">{c.title}</span></button>
    </li>)}</ol>
  </nav>;
}
