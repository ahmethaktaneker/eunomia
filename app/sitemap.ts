import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { href, PAGES, type Section } from "@/lib/i18n";
import { SITE } from "@/lib/site";

const abs = (path: string) => new URL(path, SITE.url).href;

export default function sitemap(): MetadataRoute.Sitemap {
  const sections: Section[] = ["home", ...PAGES];
  const pages = sections.flatMap(s => (["en", "tr"] as const).map(l => ({
    url: abs(href(l, s)),
    changeFrequency: "weekly" as const,
    priority: s === "home" ? 1 : 0.7,
    alternates: { languages: { en: abs(href("en", s)), tr: abs(href("tr", s)) } },
  })));
  const posts = (["en", "tr"] as const).flatMap(l => getPosts(l).map(p => ({
    url: abs(href(l, p.kind, p.slug)),
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: { languages: Object.fromEntries(p.locales.map(o => [o, abs(href(o, p.kind, p.slug))])) },
  })));
  return [...pages, ...posts];
}
