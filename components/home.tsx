import Link from "next/link";
import { copy, href, type Locale } from "@/lib/i18n";
import { getPosts } from "@/lib/content";
import { FolioScene } from "./motion/folio-scene";
import { Marquee } from "./motion/marquee";
import { PostList } from "./post-list";
import { Arrow, Shell } from "./shell";

const GREEK = ["ε", "ὐ", "ν", "ο", "μ", "ί", "α"];
const LATIN = ["E", "u", "n", "o", "m", "i", "a"];

export function HomePage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const posts = getPosts(locale).slice(0, 4);
  return <Shell locale={locale} section="home" path={href(locale, "home")}>
    <main id="content">
      <section className="journey" data-chapter="0" aria-label={c.hero.eyebrow}>
        <div className="journey-stage">
          <div className="hero-top"><span>EUNOMIA / VOL. 00</span><span>ENGLISH &nbsp; / &nbsp; TÜRKÇE</span></div>
          <div className="hero-heading">
            <p className="kicker" data-intro-fade>{c.hero.eyebrow}</p>
            <h1 data-intro>{c.hero.headline}</h1>
            <p className="hero-intro" data-intro-fade>{c.hero.intro}</p>
          </div>
          <FolioScene leaf={c.hero.leaf} leafFoot={c.hero.leafFoot} />
          <div className="hero-bottom"><span>{c.hero.scroll} <b>↓</b></span><span className="hero-chapter">{c.hero.stages.map((item, i) => <i key={item} className={`chapter-${i}`}>0{i + 1} / {item}</i>)}</span></div>
          <div className="hero-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <div className="edition-strip"><span>EUNOMIA &nbsp; / &nbsp; EST. 2026</span><span>{c.opening}</span><span>01 — 05</span></div>
      <Marquee words={c.marquee} />

      <section className="editorial-statement">
        <div className="statement-meta reveal"><span>01 / {c.statementLabel}</span></div>
        <div className="statement-content">
          <h2 data-words>{c.statement}</h2>
          <p data-split>{c.statementBody}</p>
          <div className="principles" data-stagger>{c.principles.map((p, i) => <span key={p}><small>0{i + 1}</small>{p}</span>)}</div>
        </div>
      </section>

      <section className="name-scene" data-greek-scene aria-labelledby="name-title">
        <div className="name-stage">
          <p className="kicker name-kicker">02 / {c.name.label}</p>
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

      {posts.length > 0 && <section className="latest" aria-labelledby="latest-title">
        <div className="section-head">
          <div><p className="kicker">03 / {c.latest.label}</p><h2 id="latest-title" data-split>{c.latest.title}</h2></div>
          <Link href={href(locale, "essays")} className="text-link reveal">{c.latest.all} <Arrow /></Link>
        </div>
        <PostList posts={posts} locale={locale} />
      </section>}

      <section className="formats" aria-labelledby="formats-title">
        <div className="section-head">
          <div><p className="kicker">{c.formatsLabel}</p><h2 id="formats-title" data-split>{c.formatsTitle}</h2></div>
          <p className="reveal">{c.formatsIntro}</p>
        </div>
        <div className="format-grid">{(["essays", "research"] as const).map((s, i) => <Link href={href(locale, s)} className={`format format-${i + 1} reveal`} key={s} data-tilt data-cursor={c.cursor.open}>
          <span className="format-light" aria-hidden="true" />
          <span className="format-top"><small>0{i + 1} / 02</small><Arrow /></span>
          <span className="format-type">{c.formats[i].name}</span>
          <span className="format-bottom"><span>{c.formats[i].desc}</span><small>{c.formats[i].meta}</small></span>
        </Link>)}</div>
        <div className="format-status"><span className="status-dot" />{c.status}</div>
      </section>

      <section className="topics" data-hscroll aria-labelledby="topics-title">
        <div className="topics-pin">
          <div className="topics-track">
            <div className="topic-intro">
              <p className="kicker">04 / {c.topics.label}</p>
              <h2 id="topics-title" data-split>{c.topics.title}</h2>
              <p className="topics-hint">{c.topics.hint} <b>→</b></p>
            </div>
            {c.topics.items.map((t, i) => <article className="topic-card" key={t.name}>
              <span className="topic-num" aria-hidden="true">0{i + 1}</span>
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
              <span className="topic-frame" aria-hidden="true" />
            </article>)}
          </div>
          <div className="topics-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <section className="closing-panel" data-scale-in>
        <p className="kicker">05 / {c.closingLabel}</p>
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
  </Shell>;
}
