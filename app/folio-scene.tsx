"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** CSS perspective and a hinged cover. The book remains visible without JavaScript. */
export function FolioScene({ locale }: { locale: "en" | "tr" }) {
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scene.current;
    const journey = element?.closest<HTMLElement>(".journey");
    const stage = journey?.querySelector<HTMLElement>(".journey-stage");
    if (!element || !journey || !stage) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const paint = () => {
      frame = 0;
      const distance = Math.max(1, journey.offsetHeight - stage.offsetHeight);
      const progress = reducedMotion.matches ? 0 : clamp(-journey.getBoundingClientRect().top / distance);
      const opening = clamp((progress - .10) / .78);
      const eased = opening * opening * (3 - 2 * opening);
      journey.style.setProperty("--progress", String(progress));
      journey.style.setProperty("--turn", `${-eased * 148}deg`);
      journey.dataset.chapter = progress < .25 ? "0" : progress < .67 ? "1" : "2";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add("is-visible"); reveal.unobserve(entry.target);
      }
    }, { threshold: .08 });
    document.querySelectorAll(".reveal").forEach(node => reveal.observe(node));
    document.documentElement.classList.add("motion-ready");
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame); reveal.disconnect();
      document.documentElement.classList.remove("motion-ready");
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);
  return <div className="folio-scene" ref={scene} aria-hidden="true"><div className="folio-object">
    <div className="folio-leaves"><span className="leaf-header">EUNOMIA <i>—</i> 001</span><span className="leaf-rule" /><span className="leaf-title">{locale === "en" ? <>A closer<br /><em>reading</em> of<br />public life.</> : <>Kamusal<br />hayata <em>yakından</em><br />bakmak.</>}</span><span className="leaf-bottom">{locale === "en" ? "ESSAYS / RESEARCH / TWO LANGUAGES" : "YAZILAR / ARAŞTIRMALAR / İKİ DİL"}</span></div>
    <div className="folio-cover"><div className="cover-front"><span className="cover-top"><b>EU.</b><span>AN INDEPENDENT<br />PUBLICATION</span></span><span className="cover-emblem">E<span>U</span><i>.</i></span><span className="cover-foot"><span>EUNOMIA</span><small>LAW / POLITICS / SOCIETY<br />EST. 2026 &nbsp;·&nbsp; EN / TR</small></span></div><div className="cover-inside"><span>EUNOMIA</span><i>001</i></div></div>
  </div></div>;
}
