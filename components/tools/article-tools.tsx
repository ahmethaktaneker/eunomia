"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/i18n";
import { isSaved, LIST_EVENT, toggleSaved } from "./storage";

const onEvent = (name: string) => (cb: () => void) => { window.addEventListener(name, cb); return () => window.removeEventListener(name, cb); };
const subscribeList = onEvent(LIST_EVENT);

gsap.registerPlugin(ScrollTrigger);
type Labels = Copy["tools"];

/** Save and cite controls under the article byline. */
export function ArticleToolbar({ labels, href, title, kind }: { labels: Labels; href: string; title: string; kind: string }) {
  const saved = useSyncExternalStore(subscribeList, () => isSaved(href), () => false);
  return <div className="article-toolbar">
    <button type="button" className="chip" aria-pressed={saved} onClick={() => toggleSaved({ href, title, kind })}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3h10v15l-5-3.5L5 18z" /></svg>{saved ? labels.saved : labels.save}
    </button>
    <a className="chip" href="#cite">
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7h4v4H6l-1 3M11 7h4v4h-3l-1 3" /></svg>{labels.cite}
    </a>
  </div>;
}

/** Floating "copy / share" bubble for text selected inside the article. */
export function QuoteShare({ labels, title, url }: { labels: Labels; title: string; url: string }) {
  const [pos, setPos] = useState<{ x: number; y: number; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const onUp = () => requestAnimationFrame(() => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? "";
      if (!sel || text.length < 12 || !sel.anchorNode?.parentElement?.closest(".prose")) { setPos(null); return; }
      const r = sel.getRangeAt(0).getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top, text: text.slice(0, 280) }); setCopied(false);
    });
    const hide = () => setPos(null);
    document.addEventListener("mouseup", onUp); document.addEventListener("keyup", onUp); window.addEventListener("scroll", hide, { passive: true });
    return () => { document.removeEventListener("mouseup", onUp); document.removeEventListener("keyup", onUp); window.removeEventListener("scroll", hide); };
  }, []);
  if (!pos) return null;
  const quote = `“${pos.text}” — ${title}, Eunomia`;
  return <div className="quote-share" style={{ left: pos.x, top: pos.y }} onMouseDown={e => e.preventDefault()}>
    <button type="button" onClick={() => { navigator.clipboard?.writeText(`${quote}\n${url}`); setCopied(true); }}>{copied ? labels.copied : labels.copyQuote}</button>
    <a href={`https://x.com/intent/post?text=${encodeURIComponent(quote)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">{labels.shareX}</a>
  </div>;
}

/** Tabbed citation formats with a copy button. */
export function Cite({ labels, formats }: { labels: Labels; formats: { name: string; text: string }[] }) {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  return <section className="cite" id="cite" aria-labelledby="cite-title">
    <p className="section-index" id="cite-title">{labels.cite}</p>
    <div className="cite-tabs" role="tablist">{formats.map((f, i) => <button key={f.name} type="button" role="tab" aria-selected={i === tab} onClick={() => { setTab(i); setCopied(false); }}>{f.name}</button>)}</div>
    <p className="cite-text">{formats[tab].text}</p>
    <button type="button" className="chip" onClick={() => { navigator.clipboard?.writeText(formats[tab].text); setCopied(true); }}>{copied ? labels.copied : labels.copy}</button>
  </section>;
}

/** Inline glossary term with a definition card on hover or focus. */
export function TermPopover({ term, def, href, children }: { term: string; def: string; href: string; children: ReactNode }) {
  return <span className="term" tabIndex={0}>
    {children}
    <span className="term-card" role="tooltip"><small>{term}</small><span>{def}</span><a href={href} tabIndex={-1}>↗</a></span>
  </span>;
}

/** Vertical timeline whose gold spine fills as the reader scrolls through it. */
export function Timeline({ children }: { children: ReactNode }) {
  const root = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelector(".tl-fill"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 0.4 } });
      el.querySelectorAll(".tl-event").forEach(ev => ScrollTrigger.create({ trigger: ev, start: "top 68%", onToggle: self => ev.classList.toggle("is-on", self.isActive || self.progress === 1), end: "max" }));
    }, el);
    return () => ctx.revert();
  }, []);
  return <ol className="timeline" ref={root}><span className="tl-spine" aria-hidden="true"><span className="tl-fill" /></span>{children}</ol>;
}
