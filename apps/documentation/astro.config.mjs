import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import remarkTwoslash from "remark-shiki-twoslash";

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    // Enable React for the Algolia search component.
    react(),
    tailwind({
      config: { applyBaseStyles: false },
    }),
    mdx({
      remarkPlugins: [
        [
          remarkTwoslash.default,
          {
            theme: "nord",
          },
        ],
      ],
    }),
  ],
  site: `http://jongleur-docs.vercel.app`,
});
