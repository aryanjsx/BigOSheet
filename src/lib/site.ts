/** The public URL of the deployed site, used for canonical links, Open Graph, and the sitemap. */
export const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bigosheet.aryankr.in/").replace(/\/?$/, "/");

export const SITE_NAME = "BigOSheet";

export const AUTHOR = { name: "Aryan Kumar", url: "https://github.com/aryanjsx" };
