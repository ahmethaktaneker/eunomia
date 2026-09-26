import Image from "next/image";
import Link from "next/link";
import { copy, formatDate, href, topicHref, type Locale } from "@/lib/i18n";
import { getPosts, type PostMeta } from "@/lib/content";
import { IMAGES, TOPIC_IMAGES } from "@/lib/images";
import { SITE } from "@/lib/site";
import { ChapterRail } from "./motion/chapter-rail";
import { FolioScene } from "./motion/folio-scene";
import { GoldDust } from "./motion/gold-dust";
import { LiquidGold } from "./motion/liquid-gold";
import { Marquee } from "./motion/marquee";
import { PostList, SampleBadge } from "./post-list";
import { Arrow, Shell } from "./shell";

const GREEK = ["ε", "ὐ", "ν", "ο", "μ", "ί", "α"];
const LATIN = ["E", "u", "n", "o", "m", "i", "a"];
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

function Chapter({ n, title }: { n: number; title: string }) {
  return <span className="chapter-label"><span className="chapter-mark">{ROMAN[n]}</span><span>{title}</span></span>;
}

export function HomePage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const all = getPosts(locale);
  const essays = all.filter(p => p.kind === "essays");
  const research = all.filter(p => p.kind === "research");
  const [featured, ...rest] = essays;
  const count = (n: number) => `${String(n).padStart(2, "0")} ${n === 1 ? c.piece : c.pieces}`;
  return <Shell locale={locale} section="home" path={href(locale, "home")}>
    <main id="content">
      <section className="prologue" data-prologue data-chapter-title={c.chapters[0]} aria-labelledby="prologue-title">
        <div className="prologue-media" aria-hidden="true"><LiquidGold /></div>
        <GoldDust count={70} />
        <div className="prologue-top">
          <span lang="grc">Εὐνομία</span>
          <span>{c.prologue.kicker}</span>
        </div>
        <p className="prologue-line" data-intro-fade>{c.prologue.line}</p>
        <h1 id="prologue-title" className="prologue-word" aria-label="Eunomia"><span data-intro-chars aria-hidden="true">EUNOMIA</span></h1>
        <div className="prologue-bottom">
          <Chapter n={0} title={c.chapters[0]} />
          <span className="prologue-scroll">{c.hero.scroll} <b>↓</b></span>
        </div>
      </section>

      <section className="journey" data-chapter="0" data-chapter-title={c.chapters[1]} aria-label={c.hero.eyebrow}>
        <div className="journey-stage">
          <div className="hero-top"><Chapter n={1} title={c.chapters[1]} /><span>{c.opening}</span></div>
          <div className="hero-heading">
            <p className="kicker" data-intro-fade>{c.hero.eyebrow}</p>
            <h2 className="hero-title" data-split>{c.hero.headline}</h2>
            <p className="hero-intro" data-intro-fade>{c.hero.intro}</p>
          </div>
          <FolioScene cover={c.hero.cover} featured={featured ? { href: href(locale, featured.kind, featured.slug), kicker: c.featured, title: featured.title, dek: featured.dek, cta: c.tools.featured, cursor: c.cursor.read } : null} />
          <div className="hero-bottom"><span>{c.hero.scroll} <b>↓</b></span><span className="hero-chapter">{c.hero.stages.map((item, i) => <i key={item} className={`chapter-${i}`}>0{i + 1} / {item}</i>)}</span></div>
          <div className="hero-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <div className="edition-strip"><span>EUNOMIA</span><span>{c.opening}</span><span>{count(all.length)}</span></div>

      {featured && <section className="front" aria-label={c.featured}>
        <Featured post={featured} locale={locale} />
        {rest.length > 0 && <div className="front-list">
          <div className="section-head section-head--compact">
            <p className="kicker">{c.latest.label}</p>
            <Link href={href(locale, "essays")} className="text-link">{c.latest.all} <Arrow /></Link>
          </div>
          <PostList posts={rest.slice(0, 4)} locale={locale} compact />
        </div>}
      </section>}

      <Marquee words={c.marquee} />

      <section className="letter" data-chapter-title={c.chapters[2]} aria-labelledby="letter-title">
        <figure className="letter-figure">
          <div className="letter-img" aria-hidden="true"><LiquidGold seed={7.3} /><span className="letter-mark">§</span></div>
        </figure>
        <div className="letter-body">
          <p className="kicker"><Chapter n={2} title={c.chapters[2]} /></p>
          <h2 id="letter-title" className="letter-greeting" data-split>{c.letter.greeting}</h2>
          {c.letter.body.map((p, i) => <p key={i} className="letter-p" {...(i === 0 ? { "data-words": true } : { "data-split": true })}>{p}</p>)}
          <p className="letter-closing reveal">{c.letter.closing}</p>
          <p className="letter-sign" data-sign aria-label={SITE.editor}>{SITE.editor}</p>
          <p className="letter-role reveal">{c.role}</p>
          <div className="principles" data-stagger>{c.principles.map((p, i) => <span key={p}><small>0{i + 1}</small>{p}</span>)}</div>
        </div>
      </section>

      <section className="name-scene" data-greek-scene data-chapter-title={c.chapters[3]} aria-labelledby="name-title">
        <div className="name-stage">
          <p className="kicker name-kicker"><Chapter n={3} title={c.chapters[3]} /></p>
          <div className="name-center">
            <div className="name-word" lang="grc" aria-label="Εὐνομία — Eunomia">
              {GREEK.map((g, i) => <span className="nl" key={i} aria-hidden="true"><span className="g">{g}</span><span className="l">{LATIN[i]}</span></span>)}
            </div>
            <p className="name-ety">{c.name.etymology}</p>
          </div>
          <div className="name-info">
            <h2 id="name-title">{c.name.title}</h2>
            <p>{c.name.body}</p>
            <div>
              <ul className="sisters">{c.name.sisters.map(s => <li className="sister" key={s.name}><span lang="grc">{s.greek}</span><strong>{s.name}</strong><small>{s.role}</small></li>)}</ul>
              <p className="name-closing">{c.name.closing}</p>
            </div>
          </div>
        </div>
      </section>

      {research.length > 0 && <section className="research-desk" data-chapter-title={c.chapters[4]} aria-labelledby="research-title">
        <div className="section-head">
          <div><p className="kicker"><Chapter n={4} title={c.chapters[4]} /></p><h2 id="research-title" data-split>{c.research.title}</h2></div>
          <Link href={href(locale, "research")} className="text-link reveal">{c.research.all} <Arrow /></Link>
        </div>
        <div className="research-grid" data-stagger>{research.slice(0, 2).map(p => <ResearchCard key={p.slug} post={p} locale={locale} />)}</div>
      </section>}

      <section className="topics" data-hscroll data-chapter-title={c.chapters[5]} aria-labelledby="topics-title">
        <div className="topics-pin">
          <div className="topics-track">
            <div className="topic-intro">
              <p className="kicker"><Chapter n={5} title={c.chapters[5]} /></p>
              <h2 id="topics-title" data-split>{c.topics.title}</h2>
              <p className="topics-hint">{c.topics.hint} <b>→</b></p>
            </div>
            {c.topics.items.map((t, i) => {
              const n = all.filter(p => p.topic === t.slug).length;
              const img = IMAGES[TOPIC_IMAGES[t.slug]];
              return <Link href={topicHref(locale, t.slug)} className="topic-card" key={t.slug} data-cursor={c.cursor.open}>
                <span className={`topic-media topic-media--${img.kind}`} aria-hidden="true">
                  <Image src={img.src} alt="" fill placeholder="blur" sizes="(max-width: 900px) 100vw, 40vw" />
                </span>
                <span className="topic-num" aria-hidden="true">0{i + 1}</span>
                <small className="topic-count">{count(n)}</small>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
              </Link>;
            })}
          </div>
          <div className="topics-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <section className="closing-panel" data-scale-in data-chapter-title={c.chapters[6]}>
        <p className="kicker"><Chapter n={6} title={c.chapters[6]} /></p>
        <h2 data-split>{c.closing}</h2>
        <div className="closing-bottom">
          <p className="reveal">{c.closingBody}</p>
          <div className="closing-links">
            <Link href={href(locale, "about")} className="pill" data-magnetic>{c.aboutLink} <Arrow /></Link>
            <Link href={href(locale, "contribute")} className="pill pill--solid" data-magnetic>{c.contributeLink} <Arrow /></Link>
          </div>
        </div>
        <span className="closing-watermark" aria-hidden="true"><span data-parallax="18">EU.</span></span>
      </section>
    </main>
    <ChapterRail />
  </Shell>;
}

function Featured({ post, locale }: { post: PostMeta; locale: Locale }) {
  const c = copy[locale];
  const topic = c.topics.items.find(t => t.slug === post.topic);
  return <Link href={href(locale, post.kind, post.slug)} className="featured reveal" data-cursor={c.cursor.read}>
    <span className="featured-meta">
      <span className="kicker">{c.featured} · {c.nav[post.kind]}</span>
      {topic && <span>{topic.name}</span>}
      <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
      <span>{post.readingTime} {c.latest.minRead}</span>
      {post.sample && <SampleBadge locale={locale} />}
    </span>
    <span className="featured-title">{post.title}</span>
    <span className="featured-bottom"><span className="featured-dek">{post.dek}</span><span className="pill pill--solid">{c.cursor.read} <Arrow /></span></span>
  </Link>;
}

function ResearchCard({ post, locale }: { post: PostMeta; locale: Locale }) {
  const c = copy[locale];
  return <Link href={href(locale, post.kind, post.slug)} className="research-card" data-tilt data-cursor={c.cursor.read}>
    <span className="format-light" aria-hidden="true" />
    <span className="research-card-top"><small>{c.research.abstract}</small>{post.sample && <SampleBadge locale={locale} />}</span>
    <span className="research-card-title">{post.title}</span>
    <span className="research-card-abstract">{post.abstract || post.dek}</span>
    <span className="research-card-bottom"><small>{formatDate(post.date, locale)} · {post.readingTime} {c.latest.minRead}</small><Arrow /></span>
  </Link>;
}
