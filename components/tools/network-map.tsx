"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type MapNode = { id: string; label: string; sub: string; href: string; kind: "topic" | "essays" | "research" };
export type MapLink = { source: string; target: string; strong?: boolean };
/** Navigate through a real anchor so the site-wide page transition runs. */
function follow(href: string) {
  const a = document.createElement("a");
  a.href = href; document.body.append(a); a.click(); a.remove();
}

type Body = MapNode & { x: number; y: number; vx: number; vy: number; fixed: boolean };

/** Deterministic starting layout: topics on a ring, pieces clustered near the centre. */
function seed(nodes: MapNode[], w: number, h: number): Body[] {
  const topics = nodes.filter(n => n.kind === "topic");
  return nodes.map((n, i) => {
    const t = topics.findIndex(tn => tn.id === n.id);
    const angle = t >= 0 ? (t / topics.length) * Math.PI * 2 : i * 2.4;
    const radius = t >= 0 ? Math.min(w, h) * 0.28 : Math.min(w, h) * 0.12 + (i % 5) * 18;
    return { ...n, x: w / 2 + Math.cos(angle) * radius, y: h / 2 + Math.sin(angle) * radius, vx: 0, vy: 0, fixed: false };
  });
}

/**
 * A small force-directed "constellation" of topics and pieces. Topics are the
 * bright stars; pieces orbit the topic they belong to and link to pieces that
 * share a tag. Drag to rearrange, hover to trace, click a piece to read it.
 */
export function NetworkMap({ nodes, links, hint }: { nodes: MapNode[]; links: MapLink[]; hint: string }) {
  const box = useRef<HTMLDivElement>(null);
  const bodies = useRef<Body[]>([]);
  const size = useRef({ w: 1000, h: 640 });
  const alpha = useRef(1);
  const drag = useRef<{ id: string; moved: number } | null>(null);
  const [view, setView] = useState<{ bodies: Body[]; w: number }>(() => ({ bodies: seed(nodes, 1000, 640), w: 1000 }));
  const [hover, setHover] = useState<string | null>(null);

  const neighbours = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const l of links) {
      if (!m.has(l.source)) m.set(l.source, new Set());
      if (!m.has(l.target)) m.set(l.target, new Set());
      m.get(l.source)!.add(l.target); m.get(l.target)!.add(l.source);
    }
    return m;
  }, [links]);

  const stars = useMemo(() => Array.from({ length: 90 }, (_, i) => {
    const r = Math.sin(i * 12.9898) * 43758.5453;
    const f = r - Math.floor(r), g = (Math.sin(i * 78.233) * 12345.678) % 1;
    return { x: f * 100, y: Math.abs(g) * 100, r: 0.4 + (i % 3) * 0.35, d: (i % 7) * 0.6 };
  }), []);

  useEffect(() => {
    const el = box.current!;
    const measure = () => { size.current = { w: el.clientWidth, h: el.clientHeight }; alpha.current = Math.max(alpha.current, 0.4); };
    measure();
    const { w, h } = size.current;
    bodies.current = seed(nodes, w, h);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    let raf = 0;
    const step = () => {
      const bs = bodies.current, a = alpha.current, { w, h } = size.current;
      if (a <= 0.021 && !drag.current) { raf = requestAnimationFrame(step); return; }
      const byId = new Map(bs.map(b => [b.id, b]));
      for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
        const p = bs[i], q = bs[j];
        let dx = q.x - p.x, dy = q.y - p.y;
        const d2 = Math.max(dx * dx + dy * dy, 60);
        const force = (p.kind === "topic" && q.kind === "topic" ? 26000 : 5200) / d2;
        const d = Math.sqrt(d2); dx /= d; dy /= d;
        p.vx -= dx * force * a; p.vy -= dy * force * a; q.vx += dx * force * a; q.vy += dy * force * a;
      }
      for (const l of links) {
        const p = byId.get(l.source), q = byId.get(l.target);
        if (!p || !q) continue;
        const rest = l.strong ? Math.min(w, h) * 0.16 : Math.min(w, h) * 0.24;
        const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1;
        const k = ((d - rest) / d) * (l.strong ? 0.035 : 0.012) * a;
        p.vx += dx * k; p.vy += dy * k; q.vx -= dx * k; q.vy -= dy * k;
      }
      for (const b of bs) {
        if (b.fixed) { b.vx = b.vy = 0; continue; }
        b.vx += (w / 2 - b.x) * 0.0022 * a; b.vy += (h / 2 - b.y) * 0.0022 * a;
        b.vx *= 0.82; b.vy *= 0.82;
        b.x = Math.min(w - 40, Math.max(40, b.x + b.vx)); b.y = Math.min(h - 40, Math.max(40, b.y + b.vy));
      }
      alpha.current = drag.current ? Math.max(a, 0.3) : Math.max(0.02, a * 0.992);
      setView({ bodies: bs.map(b => ({ ...b })), w });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [nodes, links]);

  const point = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onDown = (e: React.PointerEvent, id: string) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { id, moved: 0 };
    const b = bodies.current.find(n => n.id === id)!; b.fixed = true;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const b = bodies.current.find(n => n.id === drag.current!.id)!;
    const p = point(e);
    drag.current.moved += Math.hypot(p.x - b.x, p.y - b.y);
    b.x = p.x; b.y = p.y;
  };
  const onUp = (id: string) => {
    const d = drag.current; drag.current = null;
    const b = bodies.current.find(n => n.id === id);
    if (b) b.fixed = false;
    if (d && b && d.moved < 6) follow(b.href);
  };

  const bs = view.bodies;
  const byId = new Map(bs.map(b => [b.id, b]));
  const lit = hover ? new Set([hover, ...(neighbours.get(hover) ?? [])]) : null;
  const hovered = hover ? byId.get(hover) : null;
  return <div className="map" ref={box} onPointerMove={onMove}>
    <div className="map-stars" aria-hidden="true">{stars.map((s, i) => <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, animationDelay: `${s.d}s` }} />)}</div>
    <svg width="100%" height="100%" aria-hidden="true">
      {links.map((l, i) => {
        const p = byId.get(l.source), q = byId.get(l.target);
        if (!p || !q) return null;
        const on = lit ? lit.has(l.source) && lit.has(l.target) : false;
        return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={`map-link${l.strong ? " is-strong" : ""}${on ? " is-lit" : ""}${lit && !on ? " is-dim" : ""}`} />;
      })}
    </svg>
    <ul className="map-nodes">{bs.map(b => <li key={b.id}
      className={`map-node map-node--${b.kind}${lit && !lit.has(b.id) ? " is-dim" : ""}${hover === b.id ? " is-hover" : ""}`}
      style={{ transform: `translate(${b.x}px, ${b.y}px)` }}>
      <button type="button" aria-label={b.label}
        onPointerDown={e => onDown(e, b.id)} onPointerUp={() => onUp(b.id)}
        onPointerEnter={() => setHover(b.id)} onPointerLeave={() => setHover(h => (h === b.id ? null : h))}
        onFocus={() => setHover(b.id)} onBlur={() => setHover(null)}
        onKeyDown={e => { if (e.key === "Enter") follow(b.href); }}>
        <span className="map-dot" />{b.kind === "topic" && <span className="map-label">{b.label}</span>}
      </button>
    </li>)}</ul>
    {hovered && hovered.kind !== "topic" && <div className="map-card" style={{ transform: `translate(${Math.min(hovered.x + 18, view.w - 300)}px, ${hovered.y + 18}px)` }}>
      <small>{hovered.sub}</small><strong>{hovered.label}</strong>
    </div>}
    <p className="map-hint">{hint}</p>
  </div>;
}
