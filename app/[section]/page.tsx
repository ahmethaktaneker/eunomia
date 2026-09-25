import { notFound } from "next/navigation";
import { PublicationPage } from "../publication";
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section !== "essays" && section !== "research" && section !== "about") notFound();
  return <PublicationPage locale="en" section={section} />;
}
