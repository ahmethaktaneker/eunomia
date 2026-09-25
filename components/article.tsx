import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { copy, formatDate, href, type Locale } from "@/lib/i18n";
import { getPosts, type Post } from "@/lib/content";
import { ArticleEnhancer } from "./motion/article-enhancer";
import { PostList } from "./post-list";
import { Arrow, Shell } from "./shell";

export async function ArticlePage({ post }: { post: Post }) {
  const { locale, kind, slug } = post;
  const c = copy[locale];
  const other: Locale = locale === "en" ? "tr" : "en";
  const hasOther = post.locales.includes(other);
  const { content } = await compileMDX({
    source: post.body,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
        remarkRehypeOptions: { footnoteLabel: c.article.notes, footnoteLabelProperties: { className: ["footnotes-title"] }, footnoteBackLabel: "↩" },
      },
    },
  });
  const more = getPosts(locale).filter(p => !(p.kind === kind && p.slug === slug)).slice(0, 3);

  return <Shell locale={locale} section={kind} path={href(locale, kind, slug)} alternate={hasOther ? href(other, kind, slug) : undefined}>
    <div className="read-progress" role="presentation"><span /></div>
    <main id="content" className="article">
      <div className="inner-top"><Link href={href(locale, kind)} className="back-link">← {c.article.backTo} {c.nav[kind]}</Link><span>{c.nav[kind].toUpperCase()} / {locale.toUpperCase()}</span></div>
      <header className="article-head">
        <p className="kicker" data-intro-fade>{c.nav[kind]} &nbsp;·&nbsp; <time dateTime={post.date}>{formatDate(post.date, locale)}</time></p>
        <h1 data-intro>{post.title}</h1>
        {post.dek && <p className="article-dek" data-intro-fade>{post.dek}</p>}
        <div className="article-byline" data-intro-fade>
          {post.author && <span>{c.article.by} <strong>{post.author}</strong></span>}
          <span>{post.readingTime} {c.article.minRead}</span>
          {hasOther && <Link href={href(other, kind, slug)} hrefLang={other} className="text-link">{c.article.other} <Arrow /></Link>}
        </div>
      </header>
      <div className="hero-rule" data-rule />
      <div className="article-grid">
        <aside className="toc" aria-label={c.article.contents}>
          {post.headings.length > 0 && <>
            <p className="section-index">{c.article.contents}</p>
            <ol>{post.headings.map((h, i) => <li key={h.id}><a href={`#${h.id}`}><small>0{i + 1}</small>{h.text}</a></li>)}</ol>
          </>}
        </aside>
        <div className="prose">{content}</div>
        <div className="article-notes" aria-hidden="true" />
      </div>
      {post.tags.length > 0 && <ul className="article-tags">{post.tags.map(t => <li key={t}>{t}</li>)}</ul>}
      {more.length > 0 && <section className="latest article-more">
        <div className="section-head"><div><p className="kicker">{c.article.next}</p></div></div>
        <PostList posts={more} locale={locale} />
      </section>}
    </main>
    <ArticleEnhancer />
  </Shell>;
}
