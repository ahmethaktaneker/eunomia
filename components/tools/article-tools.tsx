"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/i18n";
import { isSaved, LIST_EVENT, toggleSaved } from "./storage";

const PAPER_EVENT = "eu-paper-change";
const onEvent = (name: string) => (cb: () => void) => { window.addEventListener(name, cb); return () => window.removeEventListener(name, cb); };
const readPaper = () => { try { return localStorage.getItem("eu-paper") === "on"; } catch { return false; } };
const noop = () => () => {};
const subscribeList = onEvent(LIST_EVENT);
const subscribePaper = onEvent(PAPER_EVENT);

gsap.registerPlugin(ScrollTrigger);
type Labels = Copy["tools"];

/** Save, reading mode and read-aloud controls under the article byline. */
export function ArticleToolbar({ labels, href, title, kind, lang }: { labels: Labels; href: string; title: string; kind: string; lang: string }) {
  const saved = useSyncExternalStore(subscribeList, () => isSaved(href), () => false);
  const paper = useSyncExternalStore(subscribePaper, readPaper, () => false);
  useEffect(() => {
    if (paper) document.documentElement.setAttribute("data-reading", "paper");
    else document.documentElement.removeAttribute("data-reading");
  }, [paper]);
  useEffect(() => () => document.documentElement.removeAttribute("data-reading"), []);
  const togglePaper = () => {
    try { localStorage.setItem("eu-paper", paper ? "off" : "on"); } catch {}
    window.dispatchEvent(new Event(PAPER_EVENT));
  };
  return <div className="article-toolbar">
    <Listen labels={labels} lang={lang} />
    <button type="button" className="chip" aria-pressed={saved} onClick={() => toggleSaved({ href, title, kind })}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3h10v15l-5-3.5L5 18z" /></svg>{saved ? labels.saved : labels.save}
    </button>
    <button type="button" className="chip" aria-pressed={paper} onClick={togglePaper}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3h9l3 3v11H4z" /><path d="M7 9h6M7 12h6" /></svg>{labels.paper}
    </button>
    <a className="chip" href="#cite">
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7h4v4H6l-1 3M11 7h4v4h-3l-1 3" /></svg>{labels.cite}
    </a>
  </div>;
}

/** Reads the article aloud paragraph by paragraph, highlighting the one being spoken. */
function Listen({ labels, lang }: { labels: Labels; lang: string }) {
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [progress, setProgress] = useState(0);
  const supported = useSyncExternalStore(noop, () => "speechSynthesis" in window, () => true);
  const queue = useRef<HTMLElement[]>([]);
  const index = useRef(0);
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); document.querySelectorAll(".is-speaking").forEach(n => n.classList.remove("is-speaking")); };
  }, []);
  const speak = () => {
    const el = queue.current[index.current];
    document.querySelectorAll(".is-speaking").forEach(n => n.classList.remove("is-speaking"));
    if (!el) { setState("idle"); setProgress(0); return; }
    el.classList.add("is-speaking");
    setProgress(index.current / queue.current.length);
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("sup, .term-card").forEach(n => n.remove());
    const u = new SpeechSynthesisUtterance(clone.textContent ?? "");
    u.lang = lang; u.rate = 1;
    const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
    if (voice) u.voice = voice;
    u.onend = () => { if (queue.current.length) { index.current += 1; speak(); } };
    speechSynthesis.speak(u);
  };
  const toggle = () => {
    if (!supported) return;
    if (state === "playing") { speechSynthesis.pause(); setState("paused"); return; }
    if (state === "paused") { speechSynthesis.resume(); setState("playing"); return; }
    queue.current = [...document.querySelectorAll<HTMLElement>(".abstract-text, .prose > p, .prose > h2, .prose > blockquote, .prose > ol > li, .prose > ul > li")];
    index.current = 0; setState("playing"); speechSynthesis.cancel(); speak();
  };
  const stop = () => { queue.current = []; speechSynthesis.cancel(); setState("idle"); setProgress(0); document.querySelectorAll(".is-speaking").forEach(n => n.classList.remove("is-speaking")); };
  if (!supported) return <span className="chip chip--muted">{labels.noVoice}</span>;
  return <span className={`listen listen--${state}`}>
    <button type="button" className="chip" onClick={toggle} aria-pressed={state === "playing"}>
      <span className="listen-icon" aria-hidden="true">{state === "playing" ? "❚❚" : "▶"}</span>
      {state === "idle" ? labels.listen : state === "playing" ? labels.pause : labels.resume}
      {state !== "idle" && <span className="listen-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></span>}
    </button>
    {state !== "idle" && <button type="button" className="chip chip--icon" onClick={stop} aria-label={labels.stop}>■</button>}
  </span>;
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
