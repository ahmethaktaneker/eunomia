export const SITE = {
  name: "Eunomia",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://eunomia-henna.vercel.app"),
  editor: "Ahmet Haktan Eker",
  /** Portrait under /public (e.g. "/editor.jpg"). Empty shows a monogram. */
  editorPhoto: "",
  /** One or two short paragraphs per language. Empty shows a placeholder line. */
  editorBio: { en: "", tr: "" },
  editorLinks: [] as { label: string; url: string }[],
  /** Public address for pitches. Leave empty to hide the "send a pitch" button. */
  contactEmail: "",
  /** Pieces marked `sample: true` are demo content. Set to false to hide them all at once. */
  showSamples: true,
};
