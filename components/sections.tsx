import Link from "next/link";
import type { ReactNode } from "react";
import { copy, href, PAGES, type Kind, type Locale } from "@/lib/i18n";
import { getPosts } from "@/lib/content";
import { SITE } from "@/lib/site";
import { PostList } from "./post-list";
import { Arrow, Shell } from "./shell";

type Page = (typeof PAGES)[number];

function InnerHero({ locale, section, kicker }: { locale: Locale; section: Page; kicker: ReactNode }) {
  const c = copy[locale];
  const index = PAGES.indexOf(section);
  return <>
    <div className="inner-top"><span>EUNOMIA &nbsp; / &nbsp; 0{index + 1}</span><span>ENGLISH / TÜRKÇE</span></div>
    <div className="inner-hero">
      <div><p className="kicker" data-intro-fade>{kicker}</p><h1 data-intro>{c.nav[section]}<span>.</span></h1></div>
      <p data-intro-fade>{c.sectionDescriptions[section]}</p>
    </div>
    <div className="hero-rule" data-rule />
  </>;
}

export function ArchivePage({ locale, kind }: { locale: Locale; kind: Kind }) {
  const c = copy[locale];
  const posts = getPosts(locale, kind);
  return <Shell locale={locale} section={kind} path={href(locale, kind)}>
    <main id="content" className="inner-page">
      <InnerHero locale={locale} section={kind} kicker={posts.length ? `${posts.length} / ${c.published}` : c.coming} />
      {posts.length
        ? <section className="archive-list"><p className="section-index">00 / {c.archive}</p><PostList posts={posts} locale={locale} /></section>
        : <section className="archive-opening"><span className="section-index reveal">00 / {c.coming}</span><p data-split>{c.archiveIntro[kind]}</p></section>}
      <div className="archive-categories">
        <p className="reveal">{c.areas}</p>
        <div data-stagger>{c.topics.items.map((topic, i) => <div key={topic.name} className="category-row"><span>0{i + 1}</span><strong>{topic.name}</strong><em>{topic.desc}</em></div>)}</div>
      </div>
      <Link className="text-link archive-about reveal" href={href(locale, "about")}>{c.aboutLink} <Arrow /></Link>
    </main>
  </Shell>;
}

export function AboutPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <Shell locale={locale} section="about" path={href(locale, "about")}>
    <main id="content" className="inner-page">
      <InnerHero locale={locale} section="about" kicker={c.approachLabel} />
      <section className="about-intro"><span className="section-index reveal">01 / {c.purpose}</span><p data-words>{c.about1}</p></section>
      <div className="about-columns" data-stagger>
        <div><span>02 / {c.formatsWord}</span><p>{c.about2}</p></div>
        <div><span>03 / {c.standards}</span><p>{c.about3}</p></div>
      </div>
      <section className="about-name">
        <span className="section-index reveal">04 / {c.name.label}</span>
        <div>
          <h2 data-split>{c.name.title}</h2>
          <p className="reveal">{c.name.body}</p>
          <ul className="sisters sisters--static" data-stagger>{c.name.sisters.map(s => <li className="sister" key={s.name}><span lang="grc">{s.greek}</span><strong>{s.name}</strong><small>{s.role}</small></li>)}</ul>
        </div>
      </section>
      <div className="editor-signature reveal"><span className="signature-mark">EU.</span><div><strong>{SITE.editor}</strong><span>{c.role}</span></div></div>
    </main>
  </Shell>;
}

export function ContributePage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const k = c.contribute;
  return <Shell locale={locale} section="contribute" path={href(locale, "contribute")}>
    <main id="content" className="inner-page">
      <InnerHero locale={locale} section="contribute" kicker={k.label} />
      <section className="about-intro"><span className="section-index reveal">01 / {k.label}</span><p data-words>{k.lead}</p></section>
      <section className="look">
        <p className="section-index reveal">02 / {k.lookLabel}</p>
        <div className="look-grid" data-stagger>{k.look.map((l, i) => <article key={l.title} className="look-card" data-tilt><span className="format-light" aria-hidden="true" /><small>0{i + 1}</small><h3>{l.title}</h3><p>{l.desc}</p></article>)}</div>
      </section>
      <section className="steps">
        <p className="section-index reveal">03 / {k.stepsLabel}</p>
        <ol>{k.steps.map((s, i) => <li key={s.title} className="reveal"><span className="step-num">{i + 1}</span><div><h3>{s.title}</h3><p>{s.desc}</p></div></li>)}</ol>
      </section>
      <div className="contribute-cta reveal">
        {SITE.contactEmail
          ? <a className="pill pill--solid pill--xl" href={`mailto:${SITE.contactEmail}`} data-magnetic>{k.cta} <Arrow /></a>
          : <p className="format-status"><span className="status-dot" />{k.soon}</p>}
        <Link className="text-link" href={href(locale, "about")}>{c.aboutLink} <Arrow /></Link>
      </div>
    </main>
  </Shell>;
}

export function NotFoundView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <Shell locale={locale} section="home" path={href(locale, "home")}>
    <main id="content" className="inner-page not-found">
      <div className="inner-top"><span>EUNOMIA &nbsp; / &nbsp; 404</span><span>ENGLISH / TÜRKÇE</span></div>
      <p className="nf-code" aria-hidden="true"><span data-parallax="10">404</span></p>
      <h1 data-intro>{c.notFound.title}</h1>
      <p className="nf-body" data-intro-fade>{c.notFound.body}</p>
      <Link href={href(locale, "home")} className="pill pill--solid" data-magnetic data-intro-fade>{c.notFound.home} <Arrow /></Link>
    </main>
  </Shell>;
}
