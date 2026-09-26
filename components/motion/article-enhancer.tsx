"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { saveProgress } from "../tools/storage";

gsap.registerPlugin(ScrollTrigger);

/** Reading progress, active table-of-contents entry and margin sidenotes for an article. */
export function ArticleEnhancer({ href, title, kind }: { href: string; title: string; kind: string }) {
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".article");
    const prose = article?.querySelector<HTMLElement>(".prose");
    const notes = article?.querySelector<HTMLElement>(".article-notes");
    if (!article || !prose) return;

    const bar = document.querySelector<HTMLElement>(".read-progress span");
    const progress = bar && ScrollTrigger.create({
      trigger: prose, start: "top 30%", end: "bottom bottom",
      onUpdate: self => { bar.style.transform = `scaleX(${self.progress})`; saveProgress(href, title, kind, self.progress); },
    });

    const links = new Map([...document.querySelectorAll<HTMLAnchorElement>(".toc a")].map(a => [a.hash.slice(1), a]));
    const spy = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        links.forEach(a => a.removeAttribute("aria-current"));
        links.get(entry.target.id)?.setAttribute("aria-current", "true");
      }
    }, { rootMargin: "-15% 0px -75% 0px" });
    prose.querySelectorAll("h2[id]").forEach(h => spy.observe(h));

    const wide = window.matchMedia("(min-width: 1200px)");
    const layoutNotes = () => {
      if (!notes) return;
      notes.replaceChildren();
      if (!wide.matches) return;
      const origin = notes.getBoundingClientRect().top;
      let floor = 0;
      prose.querySelectorAll<HTMLAnchorElement>("a[data-footnote-ref]").forEach(ref => {
        const source = document.getElementById(decodeURIComponent(ref.hash.slice(1)));
        if (!source) return;
        const note = document.createElement("aside");
        note.className = "sidenote";
        note.dataset.ref = ref.id;
        note.innerHTML = `<b>${ref.textContent}</b>`;
        const body = source.cloneNode(true) as HTMLElement;
        body.querySelectorAll("[data-footnote-backref]").forEach(n => n.remove());
        note.append(...body.childNodes);
        const top = Math.max(ref.getBoundingClientRect().top - origin - 6, floor);
        note.style.top = `${top}px`;
        notes.append(note);
        floor = top + note.offsetHeight + 18;
      });
    };
    const highlight = (e: PointerEvent) => {
      const ref = (e.target as Element).closest?.("a[data-footnote-ref]");
      notes?.querySelectorAll(".sidenote").forEach(n => n.classList.toggle("is-active", !!ref && (n as HTMLElement).dataset.ref === ref.id));
    };
    prose.addEventListener("pointerover", highlight);
    const resize = new ResizeObserver(() => layoutNotes());
    resize.observe(prose);
    window.addEventListener("resize", layoutNotes);
    document.fonts?.ready.then(layoutNotes);

    return () => {
      progress?.kill(); spy.disconnect(); resize.disconnect();
      window.removeEventListener("resize", layoutNotes);
      prose.removeEventListener("pointerover", highlight);
    };
  }, [href, title, kind]);
  return null;
}
