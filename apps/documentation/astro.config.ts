import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";
import typedoc from "./integrations/typedoc";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import remarkTwoslash from "remark-shiki-twoslash";

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    react(),
    typedoc({
      options: "./typedoc.cjs",
      frontmatter: {
        layout: "@layouts/markdown-layout.astro",
        folder: "API",
        icon: "📦",
      },
    }),
    tailwind({
      config: { applyBaseStyles: false },
    }),
    mdx({
      remarkPlugins: [
        [
          remarkTwoslash,
          {
            theme: "nord",
            defaultCompilerOptions: {
              strict: true,
            },
          },
        ],
      ],
      extendPlugins: "astroDefaults",
    }),
  ],
  site: `http://jongleur-docs.vercel.app`,
});
