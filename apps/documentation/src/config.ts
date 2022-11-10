export const SITE = {
  title: "Jongleur",
  description: "Your website description.",
  defaultLanguage: "en_US",
  url: "...",
};

// export const OPEN_GRAPH = {
//   image: {
//     src: "https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true",
//     alt:
//       "astro logo on a starry expanse of space," +
//       " with a purple saturn-like planet floating in the right foreground",
//   },
//   twitter: "astrodotbuild",
// };

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  icon?: string;
  description: string;
  folder: string;
  // ordering for the pages (ordering for the folders is currently hardcoded in left.astro)
  index: number;
  layout: string;
  image?: { src: string; alt: string };
  dir?: "ltr" | "rtl";
  ogLocale?: string;
  lang?: string;
};

export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/tree/main/examples/docs`;
export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: "XXXXXXXXXX",
  appId: "XXXXXXXXXX",
  apiKey: "XXXXXXXXXX",
};
