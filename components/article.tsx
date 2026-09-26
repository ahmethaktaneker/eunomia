import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { copy, formatDate, href, topicHref, type Locale } from "@/lib/i18n";
import { getPosts, type Post } from "@/lib/content";
import { ArticleEnhancer } from "./motion/article-enhancer";
import { PostList, SampleBadge } from "./post-list";
import { Arrow, Shell } from "./shell";
import { Cover } from "./cover";
import { ArticleToolbar, Cite, QuoteShare, TermPopover, Timeline } from "./tools/article-tools";
import { GLOSSARY } from "@/lib/glossary";
import { SITE } from "@/lib/site";
import type { ReactNode } from "react";

function citations(post: Post, url: string) {
  const d = new Date(post.date);
  const author = post.author || "Eunomia";
  if (post.locale === "tr") {
    const date = formatDate(post.date, "tr");
    return [
      { name: "OSCOLA", text: `${author}, '${post.title}' (Eunomia, ${date}) <${url}>` },
      { name: "APA", text: `${author}. (${d.getUTCFullYear()}, ${date}). ${post.title}. Eunomia. ${url}` },
      { name: "Chicago", text: `${author}. “${post.title}.” Eunomia, ${date}. ${url}.` },
    ];
  }
  const us = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
  const apa = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" }).format(d);
  return [
    { name: "OSCOLA", text: `${author}, '${post.title}' (Eunomia, ${formatDate(post.date, "en")}) <${url}>` },
    { name: "APA", text: `${author}. (${d.getUTCFullYear()}, ${apa}). ${post.title}. Eunomia. ${url}` },
    { name: "Chicago", text: `${author}. “${post.title}.” Eunomia, ${us}. ${url}.` },
  ];
}

export async function ArticlePage({ post }: { post: Post }) {
  const { locale, kind, slug } = post;
  const c = copy[locale];
  const other: Locale = locale === "en" ? "tr" : "en";
  const hasOther = post.locales.includes(other);
  const glossaryHref = href(locale, "glossary");
  const components = {
    Term: ({ id, children }: { id: string; children: ReactNode }) => {
      const entry = GLOSSARY[id]?.[locale];
      return entry ? <TermPopover term={entry.term} def={entry.def} href={`${glossaryHref}#${id}`}>{children}</TermPopover> : <>{children}</>;
    },
    Timeline: ({ children }: { children: ReactNode }) => <Timeline>{children}</Timeline>,
    Event: ({ year, title, children }: { year: string; title: string; children: ReactNode }) => <li className="tl-event"><span className="tl-year">{year}</span><div><strong>{title}</strong><span>{children}</span></div></li>,
  };
  const url = new URL(href(locale, kind, slug), SITE.url).href;
  const { content } = await compileMDX({
    source: post.body,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
        remarkRehypeOptions: { footnoteLabel: c.article.notes, footnoteLabelProperties: { className: ["footnotes-title"] }, footnoteBackLabel: "↩" },
      },
    },
  });
  const topic = c.topics.items.find(t => t.slug === post.topic);
  const others = getPosts(locale).filter(p => !(p.kind === kind && p.slug === slug));
  const more = [...others.filter(p => p.topic === post.topic), ...others.filter(p => p.topic !== post.topic)].slice(0, 3);

  return <Shell locale={locale} section={kind} path={href(locale, kind, slug)} alternate={hasOther ? href(other, kind, slug) : undefined}>
    <div className="read-progress" role="presentation"><span /></div>
    <main id="content" className="article">
      <div className="inner-top"><Link href={href(locale, kind)} className="back-link">← {c.article.backTo} {c.nav[kind]}</Link>{post.sample && <SampleBadge locale={locale} />}</div>
      <header className="article-head">
        <Cover post={post} size="lg" className="article-cover" />
        <p className="kicker" data-intro-fade>{c.nav[kind]}{topic && <> &nbsp;·&nbsp; <Link href={topicHref(locale, topic.slug)} className="kicker-link">{topic.name}</Link></>} &nbsp;·&nbsp; <time dateTime={post.date}>{formatDate(post.date, locale)}</time></p>
        <h1 data-intro>{post.title}</h1>
        {post.dek && <p className="article-dek" data-intro-fade>{post.dek}</p>}
        <div className="article-byline" data-intro-fade>
          {post.author && <span>{c.article.by} <strong>{post.author}</strong></span>}
          <span>{post.readingTime} {c.article.minRead}</span>
          {hasOther && <Link href={href(other, kind, slug)} hrefLang={other} className="text-link">{c.article.other} <Arrow /></Link>}
        </div>
        <div data-intro-fade><ArticleToolbar labels={c.tools} href={href(locale, kind, slug)} title={post.title} kind={c.nav[kind]} lang={locale === "tr" ? "tr-TR" : "en-GB"} /></div>
      </header>
      <div className="hero-rule" data-rule />
      <div className="article-grid">
        <aside className="toc" aria-label={c.article.contents}>
          {post.headings.length > 0 && <>
            <p className="section-index">{c.article.contents}</p>
            <ol>{post.headings.map((h, i) => <li key={h.id}><a href={`#${h.id}`}><small>0{i + 1}</small>{h.text}</a></li>)}</ol>
          </>}
        </aside>
        <div className="prose-col">
          {post.abstract && <section className="abstract" aria-label={c.research.abstract}>
            <p className="section-index">{c.research.abstract}</p>
            <p className="abstract-text">{post.abstract}</p>
            {post.findings.length > 0 && <>
              <p className="section-index">{c.research.findings}</p>
              <ol className="findings">{post.findings.map((f, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{f}</li>)}</ol>
            </>}
          </section>}
          <div className="prose">{content}</div>
          <Cite labels={c.tools} formats={citations(post, url)} />
        </div>
        <div className="article-notes" aria-hidden="true" />
      </div>
      {(topic || post.tags.length > 0) && <ul className="article-tags">
        {topic && <li><Link href={topicHref(locale, topic.slug)} className="tag-topic">{topic.name} <Arrow /></Link></li>}
        {post.tags.map(t => <li key={t}>{t}</li>)}
      </ul>}
      {more.length > 0 && <section className="latest article-more">
        <div className="section-head"><div><p className="kicker">{c.article.next}</p></div></div>
        <PostList posts={more} locale={locale} />
      </section>}
    </main>
    <ArticleEnhancer href={href(locale, kind, slug)} title={post.title} kind={c.nav[kind]} />
    <QuoteShare labels={c.tools} title={post.title} url={url} />
  </Shell>;
}
