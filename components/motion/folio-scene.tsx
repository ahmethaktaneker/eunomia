"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export type FolioFeatured = { href: string; kicker: string; title: string; dek: string; cta: string; cursor: string };
export type FolioCover = { publication: string; foot: string };

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** CSS perspective and a hinged cover. The book remains visible without JavaScript. */
export function FolioScene({ featured, cover }: { featured: FolioFeatured | null; cover: FolioCover }) {
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scene.current;
    const journey = element?.closest<HTMLElement>(".journey");
    const stage = journey?.querySelector<HTMLElement>(".journey-stage");
    const object = element?.querySelector<HTMLElement>(".folio-object");
    if (!element || !journey || !stage || !object) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let frame = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const paint = () => {
      frame = 0;
      const distance = Math.max(1, journey.offsetHeight - stage.offsetHeight);
      const progress = reducedMotion.matches ? 0 : clamp(-journey.getBoundingClientRect().top / distance);
      const opening = clamp((progress - .04) / .66);
      const eased = opening * opening * (3 - 2 * opening);
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      journey.style.setProperty("--progress", String(progress));
      journey.style.setProperty("--turn", `${-eased * 148}deg`);
      journey.style.setProperty("--lean-x", `${cx.toFixed(3)}deg`);
      journey.style.setProperty("--lean-y", `${cy.toFixed(3)}deg`);
      journey.dataset.chapter = progress < .25 ? "0" : progress < .67 ? "1" : "2";
      if (Math.abs(tx - cx) > .01 || Math.abs(ty - cy) > .01) schedule();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const lean = (e: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      tx = (e.clientX / window.innerWidth - .5) * 14; ty = (.5 - e.clientY / window.innerHeight) * 10;
      schedule();
    };
    document.documentElement.classList.add("motion-ready");
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    stage.addEventListener("pointermove", lean);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("motion-ready");
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      stage.removeEventListener("pointermove", lean);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);
  const book = <>
    <span className="folio-leaves">
      <span className="leaf-header">EUNOMIA <i>—</i> {featured?.kicker ?? "001"}</span><span className="leaf-rule" />
      {featured && <>
        <span className={`leaf-title${featured.title.length > 34 ? " leaf-title--long" : ""}`}>{featured.title}</span>
        <span className="leaf-dek">{featured.dek}</span>
        <span className="leaf-bottom"><span>{featured.cta}</span><b>→</b></span>
      </>}
    </span>
    <span className="folio-cover" aria-hidden="true"><span className="cover-front"><span className="cover-top"><b>EU.</b><span>{cover.publication}</span></span><span className="cover-emblem">E<span>U</span><i>.</i></span><span className="cover-foot"><span>EUNOMIA</span><small>{cover.foot}</small></span></span><span className="cover-inside"><span>EUNOMIA</span><i>001</i></span></span>
  </>;
  return <div className="folio-scene" ref={scene}>
    {featured
      ? <Link href={featured.href} className="folio-object" data-cursor={featured.cursor} aria-label={`${featured.cta}: ${featured.title}`}>{book}</Link>
      : <div className="folio-object" aria-hidden="true">{book}</div>}
  </div>;
}
