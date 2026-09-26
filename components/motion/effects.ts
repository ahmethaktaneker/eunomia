import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const all = <T extends Element = HTMLElement>(selector: string) => [...document.querySelectorAll<T & HTMLElement>(selector)];

/**
 * Wires every declarative scroll effect on the current page (data-* attributes).
 * Pinned scenes are created first, in document order, so later triggers measure
 * positions that include their pin spacing. Returns a matchMedia to revert on navigation.
 */
export function initScrollEffects(introDelay: number) {
  const mm = gsap.matchMedia();
  mm.add(
    { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 900px)", fine: "(pointer: fine)" },
    ctx => {
      const { motion, desktop, fine } = ctx.conditions as Record<string, boolean>;
      if (!motion) return;
      const cleanups: (() => void)[] = [];

      all("[data-greek-scene]").forEach(nameScene);
      if (desktop) all("[data-hscroll]").forEach(horizontalScroll);

      all("[data-intro]").forEach(el => SplitText.create(el, {
        type: "lines", mask: "lines", linesClass: "sl", autoSplit: true,
        onSplit: self => gsap.from(self.lines, { yPercent: 115, duration: 1.4, ease: "expo.out", stagger: 0.1, delay: introDelay }),
      }));
      all("[data-intro-chars]").forEach(el => {
        const split = SplitText.create(el, { type: "chars", charsClass: "ch" });
        gsap.from(split.chars, { yPercent: 110, rotateX: -70, transformOrigin: "50% 100%", duration: 1.6, ease: "expo.out", stagger: 0.07, delay: introDelay });
      });
      all("[data-prologue]").forEach(section => {
        const st = { trigger: section, start: "top top", end: "bottom top", scrub: true };
        gsap.fromTo(section.querySelector(".prologue-media"), { scale: 1 }, { scale: 1.15, opacity: 0.3, ease: "none", scrollTrigger: st });
        gsap.to(section.querySelector(".prologue-word"), { yPercent: 38, letterSpacing: "0.02em", ease: "none", scrollTrigger: st });
        gsap.to(section.querySelectorAll(".prologue-top, .prologue-line, .prologue-bottom"), { autoAlpha: 0, y: -30, ease: "none", scrollTrigger: { ...st, end: "40% top" } });
        gsap.fromTo(section.querySelector(".prologue-media"), { clipPath: "inset(14% 20% 14% 20%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 2.2, ease: "expo.inOut", delay: Math.max(0, introDelay - 0.3), clearProps: "clipPath" });
      });
      all("[data-sign]").forEach(el => gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", ease: "power1.inOut",
        scrollTrigger: { trigger: el, start: "top 88%", end: "top 55%", scrub: 0.8 },
      }));
      all("[data-intro-fade]").forEach((el, i) => gsap.from(el, { autoAlpha: 0, y: 24, duration: 1.2, ease: "power3.out", delay: introDelay + 0.35 + i * 0.08 }));

      all("[data-split]").forEach(el => SplitText.create(el, {
        type: "lines", mask: "lines", linesClass: "sl", autoSplit: true,
        onSplit: self => gsap.from(self.lines, {
          yPercent: 115, duration: 1.25, ease: "expo.out", stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
      }));

      all("[data-words]").forEach(el => {
        const split = SplitText.create(el, { type: "words", wordsClass: "w" });
        gsap.fromTo(split.words, { opacity: 0.14 }, {
          opacity: 1, stagger: 0.1, ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 42%", scrub: 0.6 },
        });
      });

      all("[data-chars]").forEach(el => {
        const split = SplitText.create(el, { type: "chars", charsClass: "ch" });
        gsap.from(split.chars, {
          yPercent: 105, rotate: 4, stagger: 0.05, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom-=20", scrub: 0.8 },
        });
      });

      all(".reveal").forEach(el => gsap.from(el, {
        autoAlpha: 0, y: 44, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      }));

      all("[data-stagger]").forEach(el => gsap.from(el.children, {
        autoAlpha: 0, y: 30, duration: 1, ease: "power3.out", stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }));

      all("[data-rule]").forEach(el => gsap.from(el, {
        scaleX: 0, transformOrigin: "left center", duration: 1.6, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 94%", once: true },
      }));

      all("[data-parallax]").forEach(el => {
        const amount = Number(el.dataset.parallax) || 15;
        gsap.fromTo(el, { yPercent: -amount }, {
          yPercent: amount, ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      all("[data-scale-in]").forEach(el => gsap.fromTo(el, { scale: 0.9, borderRadius: 28 }, {
        scale: 1, borderRadius: 0, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true },
      }));

      if (fine) {
        all("[data-tilt]").forEach(el => cleanups.push(tilt(el)));
        all("[data-magnetic]").forEach(el => cleanups.push(magnetic(el)));
      }
      return () => cleanups.forEach(fn => fn());
    },
  );
  ScrollTrigger.sort();
  return mm;
}

function nameScene(section: HTMLElement) {
  const stage = section.querySelector<HTMLElement>(".name-stage")!;
  const word = section.querySelector(".name-word");
  const ety = section.querySelector(".name-ety");
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: section, start: "top top", end: "+=240%", pin: stage, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
  });
  tl.from(word, { scale: 1.2, autoAlpha: 0.35, duration: 0.6 })
    .to(section.querySelectorAll(".nl .g"), { rotateX: 90, yPercent: -40, autoAlpha: 0, stagger: 0.12, duration: 0.5 }, 0.7)
    .from(section.querySelectorAll(".nl .l"), { rotateX: -90, yPercent: 40, autoAlpha: 0, stagger: 0.12, duration: 0.5 }, 0.95)
    .from(ety, { autoAlpha: 0, y: 20, duration: 0.4 }, 1.6)
    .to(word, { y: () => -stage.offsetHeight * 0.3, scale: 0.44, duration: 0.9, ease: "power1.inOut" }, 2.3)
    .to(ety, { autoAlpha: 0, y: -40, duration: 0.4 }, 2.3)
    .from(section.querySelectorAll(".name-info > *"), { autoAlpha: 0, y: 60, stagger: 0.15, duration: 0.6 }, 2.7)
    .from(section.querySelectorAll(".sister"), { autoAlpha: 0, y: 40, stagger: 0.12, duration: 0.5 }, 3.1)
    .to({}, { duration: 0.6 });
}

function horizontalScroll(section: HTMLElement) {
  const pin = section.querySelector<HTMLElement>(".topics-pin")!;
  const track = section.querySelector<HTMLElement>(".topics-track")!;
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const tween = gsap.to(track, {
    x: () => -distance(), ease: "none",
    scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, pin, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
  });
  gsap.fromTo(section.querySelector(".topics-progress span"), { scaleX: 0 }, {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
  });
  section.querySelectorAll<HTMLElement>(".topic-card").forEach(card => {
    gsap.fromTo(card.querySelector(".topic-num"), { xPercent: 40 }, {
      xPercent: -40, ease: "none",
      scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
    });
    gsap.from(card.querySelectorAll("h3, p"), {
      autoAlpha: 0, x: 80, stagger: 0.1, ease: "power2.out",
      scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 85%", end: "left 45%", scrub: true },
    });
  });
}

function tilt(el: HTMLElement) {
  gsap.set(el, { transformPerspective: 1100 });
  const rx = gsap.quickTo(el, "rotateX", { duration: 0.7, ease: "power3" });
  const ry = gsap.quickTo(el, "rotateY", { duration: 0.7, ease: "power3" });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ry((px - 0.5) * 9); rx((0.5 - py) * 9);
    el.style.setProperty("--mx", `${px * 100}%`); el.style.setProperty("--my", `${py * 100}%`);
  };
  const enter = () => gsap.to(el, { y: -8, duration: 0.6, ease: "power3.out" });
  const leave = () => { rx(0); ry(0); gsap.to(el, { y: 0, duration: 0.8, ease: "power3.out" }); };
  el.addEventListener("pointermove", move); el.addEventListener("pointerenter", enter); el.addEventListener("pointerleave", leave);
  return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
}

function magnetic(el: HTMLElement) {
  const strength = Number(el.dataset.magnetic) || 0.35;
  const x = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
  const y = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    x((e.clientX - (r.left + r.width / 2)) * strength); y((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x(0); y(0); };
  el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
  return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
}
