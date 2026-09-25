import { getPosts } from "./content";
import { copy, href, type Locale } from "./i18n";
import { SITE } from "./site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function rss(locale: Locale) {
  const home = new URL(href(locale, "home"), SITE.url).href;
  const items = getPosts(locale).map(p => {
    const url = new URL(href(locale, p.kind, p.slug), SITE.url).href;
    return `<item><title>${esc(p.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.dek)}</description>${p.tags.map(t => `<category>${esc(t)}</category>`).join("")}</item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Eunomia</title><link>${home}</link><description>${esc(copy[locale].footer)}</description><language>${locale}</language><atom:link href="${new URL(locale === "tr" ? "/tr/rss.xml" : "/rss.xml", SITE.url).href}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
