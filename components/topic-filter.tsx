"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Chips that filter the post rows rendered as children by their data-topic. */
export function TopicFilter({ options, allLabel, children }: { options: { slug: string; name: string; count: number }[]; allLabel: string; children: ReactNode }) {
  const [active, setActive] = useState("");
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    list.current?.querySelectorAll<HTMLElement>("li[data-topic]").forEach(li => {
      li.hidden = !!active && li.dataset.topic !== active;
    });
    ScrollTrigger.refresh();
  }, [active]);
  return <>
    <div className="topic-chips" role="group">
      <button type="button" aria-pressed={!active} onClick={() => setActive("")}>{allLabel}</button>
      {options.filter(o => o.count > 0).map(o => <button type="button" key={o.slug} aria-pressed={active === o.slug} onClick={() => setActive(o.slug)}>{o.name} <small>{o.count}</small></button>)}
    </div>
    <div ref={list}>{children}</div>
  </>;
}
