export const SITE = {
  name: "Eunomia",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://eunomia-henna.vercel.app"),
  editor: "Ahmet Haktan Eker",
  /** Public address for pitches. Leave empty to hide the "send a pitch" button. */
  contactEmail: "",
};
