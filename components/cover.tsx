import type { PostMeta } from "@/lib/content";

const MARKS: Record<string, string> = { "public-life": "Π", institutions: "Ι", justice: "§", democracy: "Δ" };

function hash(text: string) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619);
  return h >>> 0;
}

/**
 * Typographic cover: a large initial and a topic mark in gold on black. The
 * composition (layout variant, tilt, rule placement) is derived from the slug,
 * so every piece keeps the same cover across builds and languages.
 */
export function Cover({ post, size = "md", className = "" }: { post: Pick<PostMeta, "slug" | "title" | "topic" | "kind">; size?: "sm" | "md" | "lg"; className?: string }) {
  const h = hash(post.slug);
  const variant = h % 3;
  const tilt = ((h >> 3) % 13) - 6;
  const ruleAt = 18 + ((h >> 7) % 55);
  const letter = post.title.replace(/^(The|A|An)\s+/i, "").trim().charAt(0);
  const mark = (post.topic && MARKS[post.topic]) || "§";
  return <span className={`cover cover--v${variant} cover--${size} ${className}`} aria-hidden="true" style={{ "--tilt": `${tilt}deg`, "--rule": `${ruleAt}%` } as React.CSSProperties}>
    <span className="cover-rule" />
    <span className="cover-glyph">{letter}</span>
    <span className="cover-mark">{mark}</span>
    <span className="cover-kind">{post.kind === "research" ? "R." : "E."}</span>
  </span>;
}
