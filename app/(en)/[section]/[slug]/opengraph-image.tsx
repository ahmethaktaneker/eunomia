import { ogSize, renderOg } from "@/lib/og";
import { copy } from "@/lib/i18n";
import { postParams } from "@/lib/content";
import { loadArticle } from "@/lib/routes";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Eunomia";
export const generateStaticParams = () => postParams("en");
export default async function Image({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const post = loadArticle("en", section, slug);
  return renderOg({ kicker: post ? copy.en.nav[post.kind] : "Eunomia", title: post?.title ?? "Eunomia", footer: post?.dek ?? copy.en.footer });
}
