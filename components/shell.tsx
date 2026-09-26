import Link from "next/link";
import type { ReactNode } from "react";
import { copy, EXTRA_PAGES, href, PAGES, type Locale, type Section } from "@/lib/i18n";
import { HeaderTools } from "./tools/header-tools";

type ShellProps = {
  locale: Locale; section: Section; path: string;
  /** Equivalent page in the other language; defaults to the same section. */
  alternate?: string; children: ReactNode;
};

export function Shell({ locale, section, path, alternate, children }: ShellProps) {
  const c = copy[locale];
  const other: Locale = locale === "en" ? "tr" : "en";
  const langHref = { [locale]: path, [other]: alternate ?? href(other, section) } as Record<Locale, string>;
  return <div className="site-shell">
    <a className="skip-link" href="#content">{c.skip}</a>
    <header className="site-header">
      <Link href={href(locale, "home")} className="brand" aria-label={c.home}><span className="brand-monogram">EU<span>.</span></span><span className="brand-name">EUNOMIA</span></Link>
      <nav aria-label={c.mainNav}>{PAGES.map(s => <Link key={s} href={href(locale, s)} aria-current={s === section ? "page" : undefined} className="roll"><span data-text={c.nav[s]}>{c.nav[s]}</span></Link>)}</nav>
      <div className="header-right">
      <HeaderTools labels={c.tools} />
      <div className="language">{(["en", "tr"] as const).map((l, i) => <span key={l}>{i > 0 && <i>/</i>}<Link href={langHref[l]} hrefLang={l} lang={l} aria-current={l === locale ? "page" : undefined}>{l.toUpperCase()}</Link></span>)}</div>
      </div>
    </header>
    {children}
    <footer className="site-footer">
      <div className="footer-top" data-stagger>
        <div className="footer-cta">
          <p className="kicker">{c.footer}</p>
          <Link href={href(locale, "contribute")} className="footer-cta-link" data-cursor={c.cursor.open}><span>{c.contributeLink}</span> <i>↗</i></Link>
        </div>
        <nav className="footer-nav" aria-label={c.mainNav}>{[...PAGES, ...EXTRA_PAGES].map(s => <Link key={s} href={href(locale, s)} className="roll"><span data-text={c.nav[s]}>{c.nav[s]}</span></Link>)}</nav>
        <div className="footer-nav">
          <Link href={langHref.en} hrefLang="en" className="roll"><span data-text="English">English</span></Link>
          <Link href={langHref.tr} hrefLang="tr" className="roll"><span data-text="Türkçe">Türkçe</span></Link>
          <a href={locale === "tr" ? "/tr/rss.xml" : "/rss.xml"} className="roll"><span data-text={c.rss}>{c.rss}</span></a>
        </div>
        <Link href={path} className="to-top" aria-label={c.article.backToTop} data-magnetic="0.4">↑</Link>
      </div>
      <div className="footer-word" aria-hidden="true"><span data-chars>EUNOMIA</span></div>
      <div className="footer-meta"><span>© {new Date().getUTCFullYear()} Eunomia</span><span>ENGLISH / TÜRKÇE</span><span>{c.independent}</span></div>
    </footer>
  </div>;
}

export function Arrow() {
  return <i className="arrow" aria-hidden="true"><b>↗</b><b>↗</b></i>;
}
