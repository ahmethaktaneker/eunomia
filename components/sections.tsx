import Link from "next/link";
import type { ReactNode } from "react";
import { copy, href, topicHref, PAGES, type Kind, type Locale } from "@/lib/i18n";
import { getPosts } from "@/lib/content";
import { SITE } from "@/lib/site";
import { PostList } from "./post-list";
import { TopicFilter } from "./topic-filter";
import { NetworkMap, type MapLink, type MapNode } from "./tools/network-map";
import { glossary } from "@/lib/glossary";
import { IMAGES } from "@/lib/images";
import { Arrow, Shell } from "./shell";

type Page = (typeof PAGES)[number];

function InnerHero({ locale, section, kicker, title, description }: { locale: Locale; section: Page; kicker: ReactNode; title?: string; description?: string }) {
  const c = copy[locale];
  return <>
    <div className="inner-top"><span>EUNOMIA &nbsp; / &nbsp; {c.opening}</span></div>
    <div className="inner-hero">
      <div><p className="kicker" data-intro-fade>{kicker}</p><h1 data-intro>{title ?? c.nav[section]}<span>.</span></h1></div>
      <p data-intro-fade>{description ?? c.sectionDescriptions[section]}</p>
    </div>
    <div className="hero-rule" data-rule />
  </>;
}

function TopicRows({ locale, current }: { locale: Locale; current?: string }) {
  const c = copy[locale];
  const all = getPosts(locale);
  return <div className="archive-categories">
    <p className="reveal">{current ? c.topicPage.other : c.areas}</p>
    <div data-stagger>{c.topics.items.filter(t => t.slug !== current).map((topic, i) => <Link href={topicHref(locale, topic.slug)} key={topic.slug} className="category-row" data-cursor={c.cursor.open}>
      <span>0{i + 1} · {all.filter(p => p.topic === topic.slug).length}</span><strong>{topic.name}</strong><em>{topic.desc}</em>
    </Link>)}</div>
  </div>;
}

export function ArchivePage({ locale, kind }: { locale: Locale; kind: Kind }) {
  const c = copy[locale];
  const posts = getPosts(locale, kind);
  const options = c.topics.items.map(t => ({ slug: t.slug, name: t.name, count: posts.filter(p => p.topic === t.slug).length }));
  return <Shell locale={locale} section={kind} path={href(locale, kind)}>
    <main id="content" className="inner-page">
      <InnerHero locale={locale} section={kind} kicker={posts.length ? `${posts.length} / ${c.published}` : c.coming} />
      {posts.length
        ? <section className="archive-list"><TopicFilter options={options} allLabel={c.allTopics}><PostList posts={posts} locale={locale} /></TopicFilter></section>
        : <section className="archive-opening"><span className="section-index reveal">{c.coming}</span><p data-split>{c.archiveIntro[kind]}</p></section>}
      <TopicRows locale={locale} />
      <Link className="text-link archive-about reveal" href={href(locale, "about")}>{c.aboutLink} <Arrow /></Link>
    </main>
  </Shell>;
}

export function TopicPage({ locale, topic }: { locale: Locale; topic: string }) {
  const c = copy[locale];
  const t = c.topics.items.find(i => i.slug === topic)!;
  const posts = getPosts(locale).filter(p => p.topic === topic);
  return <Shell locale={locale} section="home" path={topicHref(locale, topic)} alternate={topicHref(locale === "en" ? "tr" : "en", topic)}>
    <main id="content" className="inner-page">
      <InnerHero locale={locale} section="essays" kicker={`${c.topicPage.label} / ${posts.length} ${posts.length === 1 ? c.piece : c.pieces}`} title={t.name} description={t.desc} />
      {posts.length
        ? <section className="archive-list"><PostList posts={posts} locale={locale} /></section>
        : <section className="archive-opening"><p data-split>{c.topicPage.empty}</p></section>}
      <TopicRows locale={locale} current={topic} />
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
      <section className="editor reveal" aria-label={c.editor.label}>
        <div className="editor-portrait">
          {SITE.editorPhoto
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={SITE.editorPhoto} alt={SITE.editor} />
            : <span className="editor-monogram" aria-hidden="true">{SITE.editor.split(" ").map(w => w[0]).slice(0, 2).join("")}<i>.</i></span>}
        </div>
        <div className="editor-text">
          <span className="section-index">{c.editor.label}</span>
          <strong>{SITE.editor}</strong>
          <span className="editor-role">{c.role}</span>
          {SITE.editorBio[locale]
            ? SITE.editorBio[locale].split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)
            : <p className="editor-placeholder">{locale === "tr" ? "Biyografi yakında." : "Biography coming soon."}</p>}
          {SITE.editorLinks.length > 0 && <div className="editor-links"><span className="section-index">{c.editor.links}</span>{SITE.editorLinks.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-link">{l.label} <Arrow /></a>)}</div>}
        </div>
      </section>
      <section className="credits" id="credits">
        <span className="section-index">{c.credits.label}</span>
        <div>
          <p>{c.credits.note}</p>
          <ul>{Object.values(IMAGES).map(img => <li key={img.url}><a href={img.url} target="_blank" rel="noopener noreferrer">{img.title}</a>, {img.date}</li>)}</ul>
        </div>
      </section>
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

export function ExplorePage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const posts = getPosts(locale);
  const nodes: MapNode[] = [
    ...c.topics.items.map(t => ({ id: `t:${t.slug}`, label: t.name, sub: c.topicPage.label, href: topicHref(locale, t.slug), kind: "topic" as const })),
    ...posts.map(p => ({ id: `p:${p.kind}/${p.slug}`, label: p.title, sub: c.nav[p.kind], href: href(locale, p.kind, p.slug), kind: p.kind })),
  ];
  const links: MapLink[] = posts.filter(p => p.topic).map(p => ({ source: `p:${p.kind}/${p.slug}`, target: `t:${p.topic}`, strong: true }));
  posts.forEach((p, i) => posts.slice(i + 1).forEach(q => {
    if (p.tags.some(t => q.tags.includes(t))) links.push({ source: `p:${p.kind}/${p.slug}`, target: `p:${q.kind}/${q.slug}` });
  }));
  return <Shell locale={locale} section="explore" path={href(locale, "explore")}>
    <main id="content" className="inner-page">
      <InnerHero locale={locale} section="explore" kicker={`${posts.length} ${c.pieces} · ${c.topics.items.length} ${c.topicPage.label}`} />
      <NetworkMap nodes={nodes} links={links} hint={c.tools.mapHint} />
      <TopicRows locale={locale} />
    </main>
  </Shell>;
}

export function GlossaryPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const terms = glossary(locale);
  const letters = [...new Set(terms.map(t => t.term[0].toLocaleUpperCase(locale)))];
  return <Shell locale={locale} section="glossary" path={href(locale, "glossary")}>
    <main id="content" className="inner-page">
      <InnerHero locale={locale} section="glossary" kicker={`${terms.length} ${c.tools.term}`} />
      <nav className="glossary-letters" aria-label={c.tools.allTerms}>{letters.map(l => <a key={l} href={`#letter-${l}`}>{l}</a>)}</nav>
      <dl className="glossary" data-stagger>{terms.map((t, i) => {
        const letter = t.term[0].toLocaleUpperCase(locale);
        const first = i === 0 || terms[i - 1].term[0].toLocaleUpperCase(locale) !== letter;
        return <div key={t.id} id={t.id} className="glossary-entry">
          <span className="glossary-letter" id={first ? `letter-${letter}` : undefined}>{first ? letter : ""}</span>
          <dt>{t.term}</dt><dd>{t.def}</dd>
        </div>;
      })}</dl>
    </main>
  </Shell>;
}

export function NotFoundView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return <Shell locale={locale} section="home" path={href(locale, "home")}>
    <main id="content" className="inner-page not-found">
      <div className="inner-top"><span>EUNOMIA &nbsp; / &nbsp; 404</span></div>
      <p className="nf-code" aria-hidden="true"><span data-parallax="10">404</span></p>
      <h1 data-intro>{c.notFound.title}</h1>
      <p className="nf-body" data-intro-fade>{c.notFound.body}</p>
      <Link href={href(locale, "home")} className="pill pill--solid" data-magnetic data-intro-fade>{c.notFound.home} <Arrow /></Link>
    </main>
  </Shell>;
}
