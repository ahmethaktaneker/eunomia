import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { KINDS, LOCALES, type Kind, type Locale } from "./i18n";

export type PostMeta = {
  kind: Kind; slug: string; locale: Locale;
  title: string; dek: string; date: string; author: string; tags: string[];
  readingTime: number; locales: Locale[];
};
export type Post = PostMeta & { body: string; headings: { id: string; text: string }[] };

const ROOT = path.join(process.cwd(), "content");
const showDrafts = process.env.NODE_ENV !== "production";

function slugsOf(kind: Kind) {
  const dir = path.join(ROOT, kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
}

function load(kind: Kind, slug: string, locale: Locale): Post | null {
  const file = path.join(ROOT, kind, slug, `${locale}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  if (data.draft && !showDrafts) return null;
  const slugger = new GithubSlugger();
  const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map(m => {
    const text = m[1].replace(/[*_`]/g, "").trim();
    return { id: slugger.slug(text), text };
  });
  const words = content.replace(/\[\^\d+\]:.*$/gm, "").split(/\s+/).filter(Boolean).length;
  return {
    kind, slug, locale,
    title: String(data.title), dek: String(data.dek ?? ""),
    date: data.date instanceof Date ? data.date.toISOString() : String(data.date),
    author: String(data.author ?? ""), tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: Math.max(1, Math.round(words / 220)),
    locales: LOCALES.filter(l => fs.existsSync(path.join(ROOT, kind, slug, `${l}.mdx`))),
    body: content, headings,
  };
}

export function getPost(kind: Kind, slug: string, locale: Locale) {
  return load(kind, slug, locale);
}

export function getPosts(locale: Locale, kind?: Kind): PostMeta[] {
  return (kind ? [kind] : KINDS)
    .flatMap(k => slugsOf(k).map(s => load(k, s, locale)))
    .filter((p): p is Post => p !== null)
    .map(({ kind, slug, locale, title, dek, date, author, tags, readingTime, locales }) => ({ kind, slug, locale, title, dek, date, author, tags, readingTime, locales }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function postParams(locale: Locale) {
  return getPosts(locale).map(p => ({ section: p.kind, slug: p.slug }));
}
