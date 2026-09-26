"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initScrollEffects } from "./effects";
import { motion, prefersReducedMotion } from "./state";


const isTr = (path: string) => path === "/tr" || path.startsWith("/tr/");

export function MotionProvider({ label }: { label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const curtain = useRef<HTMLDivElement>(null);
  const preloader = useRef<HTMLDivElement>(null);
  const covered = useRef(false);
  const firstRun = useRef(true);

  // Smooth scrolling, header state, preloader. Runs once per root layout.
  useEffect(() => {
    const html = document.documentElement;
    const reduce = prefersReducedMotion();
    if (!reduce) html.classList.add("has-motion");
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, anchors: false });
      motion.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      html.toggleAttribute("data-scrolled", y > 30);
      html.dataset.header = y > lastY + 2 && y > 220 ? "hidden" : y < lastY - 2 || y < 220 ? "shown" : html.dataset.header ?? "shown";
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (html.classList.contains("is-curtained")) { covered.current = true; motion.introDelay = 0.55; }
    if (html.classList.contains("is-preloading") && preloader.current) {
      const root = preloader.current;
      const count = root.querySelector(".pre-count")!;
      const counter = { v: 0 };
      lenis?.stop();
      const tl = gsap.timeline({
        onComplete: () => {
          html.classList.remove("is-preloading");
          try { sessionStorage.setItem("eu-visited", "1"); } catch {}
          lenis?.start();
          gsap.set(root, { clearProps: "all" });
        },
      });
      tl.to(counter, { v: 100, duration: 2, ease: "power2.inOut", onUpdate: () => { count.textContent = String(Math.round(counter.v)).padStart(3, "0"); } }, 0)
        .fromTo(root.querySelectorAll(".pre-mark text"), { strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: 1.9, ease: "power2.inOut" }, 0)
        .to(root.querySelectorAll(".pre-mark text"), { fillOpacity: 1, duration: 0.5, ease: "power1.out" }, 1.5)
        .from(root.querySelectorAll(".pre-meta span"), { yPercent: 120, stagger: 0.08, duration: 0.8, ease: "expo.out" }, 0.1)
        .to(root.querySelector(".pre-inner"), { yPercent: -18, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, 2.15)
        .to(root, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.4);
      motion.introDelay = 2.85;
    }

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      motion.lenis = null;
    };
  }, []);

  // Page transitions: cover with the curtain, navigate, then reveal on the new pathname.
  useEffect(() => {
    const el = curtain.current;
    if (!el) return;
    const cover = () => new Promise<void>(resolve => {
      covered.current = true;
      gsap.set(el, { visibility: "visible", pointerEvents: "auto" });
      gsap.timeline({ onComplete: resolve })
        .fromTo(el.querySelectorAll(".curtain-panel"), { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: "expo.inOut", stagger: 0.07 })
        .fromTo(el.querySelector(".curtain-mark"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.35);
    });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.getAttribute("href") || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || /\.(xml|txt|pdf)$/.test(url.pathname)) return;
      if (url.pathname === location.pathname) {
        e.preventDefault();
        const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
        if (target) {
          if (motion.lenis) motion.lenis.scrollTo(target, { offset: -110 });
          else target.scrollIntoView({ behavior: "smooth" });
          history.replaceState(null, "", url.hash);
        } else if (!url.hash) {
          if (motion.lenis) motion.lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
      if (prefersReducedMotion()) return;
      e.preventDefault();
      motion.lenis?.stop();
      const crossLocale = isTr(url.pathname) !== isTr(location.pathname);
      cover().then(() => {
        if (crossLocale) {
          try { sessionStorage.setItem("eu-curtain", "1"); } catch {}
          location.assign(url.href);
        } else router.push(url.pathname + url.search + url.hash, { scroll: false });
      });
      window.setTimeout(() => { if (covered.current && location.pathname === url.pathname) reveal(); }, 3000);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  function reveal() {
    const el = curtain.current;
    if (!el || !covered.current) return;
    covered.current = false;
    gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("is-curtained");
        gsap.set(el, { visibility: "hidden", pointerEvents: "none" });
        gsap.set(el.querySelectorAll(".curtain-panel"), { yPercent: 100 });
      },
    })
      .to(el.querySelector(".curtain-mark"), { autoAlpha: 0, y: -30, duration: 0.35, ease: "power2.in" })
      .to([...el.querySelectorAll(".curtain-panel")].reverse(), { yPercent: -100, duration: 0.9, ease: "expo.inOut", stagger: 0.07 }, 0.1);
  }

  // Every page: reset scroll, wire scroll effects, lift the curtain.
  useEffect(() => {
    let mm: gsap.MatchMedia | undefined;
    const raf = requestAnimationFrame(() => {
      if (!firstRun.current || !location.hash) {
        motion.lenis?.scrollTo(0, { immediate: true, force: true });
        if (!firstRun.current) window.scrollTo(0, 0);
      }
      if (!document.documentElement.classList.contains("is-preloading")) motion.lenis?.start();
      mm = initScrollEffects(motion.introDelay);
      ScrollTrigger.refresh();
      reveal();
      firstRun.current = false;
      motion.introDelay = 0.45;
    });
    return () => { cancelAnimationFrame(raf); mm?.revert(); };
  }, [pathname]);

  return <>
    <div className="grain" aria-hidden="true" />
    <div className="curtain" ref={curtain} aria-hidden="true">
      <span className="curtain-panel curtain-panel--accent" />
      <span className="curtain-panel" />
      <span className="curtain-mark">EU<i>.</i></span>
    </div>
    <div className="preloader" ref={preloader} aria-hidden="true">
      <div className="pre-inner">
        <svg className="pre-mark" viewBox="0 0 400 220"><text x="50%" y="165" textAnchor="middle">EU.</text></svg>
        <div className="pre-meta"><span className="pre-count">000</span><span>{label}</span><span>EST. 2026</span></div>
      </div>
    </div>
    <Cursor />
  </>;
}

function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const r = ring.current, d = dot.current;
    if (!r || !d || !window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" }), ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" }), dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const label = r.querySelector("span")!;
    const move = (e: PointerEvent) => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); html.classList.add("cursor-on"); };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.("a, button, [data-cursor]");
      const text = t?.getAttribute("data-cursor");
      const state = t ? (text ? "label" : "hover") : "";
      r.dataset.state = state;
      if (text) label.textContent = text;
    };
    const out = () => html.classList.remove("cursor-on");
    const down = () => r.classList.add("is-down"), up = () => r.classList.remove("is-down");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", out);
    window.addEventListener("pointerdown", down); window.addEventListener("pointerup", up);
    return () => {
      html.classList.remove("has-cursor", "cursor-on");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", out);
      window.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up);
    };
  }, []);
  return <>
    <div className="cursor-ring" ref={ring} aria-hidden="true"><span /></div>
    <div className="cursor-dot" ref={dot} aria-hidden="true" />
  </>;
}
