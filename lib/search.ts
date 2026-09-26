import { getPosts } from "./content";
import { glossary } from "./glossary";
import { copy, EXTRA_PAGES, href, PAGES, topicHref, type Locale } from "./i18n";

export type SearchItem = { type: string; title: string; sub: string; href: string; text: string };

/** Everything the command palette can find, built at render time for one locale. */
export function searchIndex(locale: Locale): SearchItem[] {
  const c = copy[locale];
  const posts = getPosts(locale).map(p => ({
    type: c.nav[p.kind], title: p.title, sub: p.dek, href: href(locale, p.kind, p.slug),
    text: [p.title, p.dek, p.abstract, ...p.tags].join(" "),
  }));
  const topics = c.topics.items.map(t => ({ type: c.topicPage.label, title: t.name, sub: t.desc, href: topicHref(locale, t.slug), text: `${t.name} ${t.desc}` }));
  const terms = glossary(locale).map(t => ({ type: c.tools.term, title: t.term, sub: t.def, href: `${href(locale, "glossary")}#${t.id}`, text: `${t.term} ${t.def}` }));
  const pages = [...PAGES, ...EXTRA_PAGES].map(s => ({ type: "Eunomia", title: c.nav[s], sub: c.sectionDescriptions[s], href: href(locale, s), text: c.nav[s] }));
  return [...posts, ...topics, ...terms, ...pages];
}
