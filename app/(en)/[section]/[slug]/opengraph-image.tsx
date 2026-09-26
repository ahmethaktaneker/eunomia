import { ogSize, renderOg } from "@/lib/og";
import { copy } from "@/lib/i18n";
import { postParams } from "@/lib/content";
import { findTopic, loadArticle } from "@/lib/routes";
import { TOPICS } from "@/lib/i18n";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Eunomia";
export const generateStaticParams = () => [...postParams("en"), ...TOPICS.map(slug => ({ section: "topics", slug }))];
export default async function Image({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const topic = findTopic("en", section, slug);
  if (topic) return renderOg({ kicker: copy.en.topicPage.label, title: topic.name, footer: topic.desc });
  const post = loadArticle("en", section, slug);
  return renderOg({ kicker: post ? copy.en.nav[post.kind] : "Eunomia", title: post?.title ?? "Eunomia", footer: post?.dek ?? copy.en.footer });
}
