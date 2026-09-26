"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { SearchItem } from "@/lib/search";
import type { Copy, Locale } from "@/lib/i18n";
import { getList, getProgress, LIST_EVENT, removeSaved, type ListItem, type Progress } from "./storage";
import { setSound, soundOn, SOUND_EVENT } from "../motion/sound";

type Labels = Copy["tools"];
export const SEARCH_EVENT = "eu-search-open";

const noop = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

const norm = (s: string, locale: Locale) => s.toLocaleLowerCase(locale === "tr" ? "tr" : "en").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");

/** Search, reading list and sound controls that sit in the header. */
export function HeaderTools({ labels }: { labels: Labels }) {
  const [sound, setSoundState] = useState(false);
  const mac = useSyncExternalStore(noop, isMac, () => true);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<ListItem[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  useEffect(() => {
    const sync = () => { setSoundState(soundOn()); setList(getList()); setProgress(getProgress()); };
    sync();
    window.addEventListener(SOUND_EVENT, sync); window.addEventListener(LIST_EVENT, sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener(SOUND_EVENT, sync); window.removeEventListener(LIST_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const away = (e: MouseEvent) => { if (!(e.target as Element).closest(".list-drawer, .tool-list")) setOpen(false); };
    window.addEventListener("keydown", esc); window.addEventListener("click", away);
    return () => { window.removeEventListener("keydown", esc); window.removeEventListener("click", away); };
  }, [open]);

  const inProgress = Object.entries(progress).filter(([, p]) => p.progress > 0.05 && p.progress < 0.95).sort((a, b) => b[1].at - a[1].at).slice(0, 3);
  return <div className="header-tools">
    <button type="button" className="tool" onClick={() => window.dispatchEvent(new Event(SEARCH_EVENT))} aria-label={labels.openSearch}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4.5 4.5" /></svg><kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>
    </button>
    <button type="button" className="tool tool-list" aria-expanded={open} onClick={() => setOpen(o => !o)} aria-label={labels.list}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3h10v15l-5-3.5L5 18z" /></svg>{list.length > 0 && <b>{list.length}</b>}
    </button>
    <button type="button" className="tool tool-sound" aria-pressed={sound} onClick={() => setSound(!sound)} aria-label={`${labels.sound}: ${sound ? labels.on : labels.off}`}>
      <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
    </button>
    {open && <div className="list-drawer" role="dialog" aria-label={labels.list}>
      {inProgress.length > 0 && <>
        <p className="section-index">{labels.continue}</p>
        <ul>{inProgress.map(([href, p]) => <li key={href}><a href={href}><span>{p.title}</span><small>{Math.round(p.progress * 100)}% {labels.read}</small><i style={{ transform: `scaleX(${p.progress})` }} /></a></li>)}</ul>
      </>}
      <p className="section-index">{labels.list}</p>
      {list.length === 0 ? <p className="list-empty">{labels.listEmpty}</p> : <ul>{list.map(i => <li key={i.href}>
        <a href={i.href}><span>{i.title}</span><small>{i.kind}</small></a>
        <button type="button" onClick={() => removeSaved(i.href)} aria-label={`${labels.remove}: ${i.title}`}>×</button>
      </li>)}</ul>}
    </div>}
  </div>;
}

/** Command palette: ⌘K / Ctrl+K or "/" opens it; arrows move; Enter follows the link. */
export function SearchPalette({ items, labels, locale }: { items: SearchItem[]; labels: Labels; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indexed = useMemo(() => items.map(i => ({ ...i, n: norm(i.text + " " + i.title, locale) })), [items, locale]);
  const results = useMemo(() => {
    const words = norm(q, locale).split(/\s+/).filter(Boolean);
    const hits = words.length ? indexed.filter(i => words.every(w => i.n.includes(w))) : indexed.slice(0, 8);
    return hits.slice(0, 12);
  }, [q, indexed, locale]);

  useEffect(() => {
    const show = () => { setOpen(true); setQ(""); setActive(0); };
    const key = (e: KeyboardEvent) => {
      const typing = (e.target as Element)?.closest?.("input, textarea, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); show(); }
    };
    window.addEventListener(SEARCH_EVENT, show); window.addEventListener("keydown", key);
    return () => { window.removeEventListener(SEARCH_EVENT, show); window.removeEventListener("keydown", key); };
  }, []);
  useEffect(() => { if (open) requestAnimationFrame(() => input.current?.focus()); }, [open]);

  if (!open) return null;
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(results.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); listRef.current?.querySelectorAll("a")[active]?.click(); setOpen(false); }
  };
  return <div className="palette" role="dialog" aria-modal="true" aria-label={labels.search} onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
    <div className="palette-box" onKeyDown={onKey}>
      <div className="palette-input">
        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4.5 4.5" /></svg>
        <input ref={input} value={q} onChange={e => { setQ(e.target.value); setActive(0); }} placeholder={labels.searchHint} aria-label={labels.search} />
        <kbd>esc</kbd>
      </div>
      {results.length === 0 ? <p className="palette-empty">{labels.noResults}</p> : <ul ref={listRef} role="listbox">
        {results.map((r, i) => <li key={r.href} role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)}>
          <a href={r.href} onClick={() => setOpen(false)}><small>{r.type}</small><strong>{r.title}</strong><span>{r.sub}</span></a>
        </li>)}
      </ul>}
    </div>
  </div>;
}
