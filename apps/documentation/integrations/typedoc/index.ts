import { AstroIntegration } from "astro";
import { Application, TypeDocOptions } from "typedoc";
import { load } from "typedoc-plugin-markdown";
import { addFrontmatter } from "./frontmatter";
import { bootstrap } from "./render";
import { AstroTheme } from "./theme";

// some of this stuff is is taken from https://github.com/tgreyuk/typedoc-plugin-markdown/blob/master/packages/docusaurus-plugin-typedoc/src/plugin.ts

const typedoc = (
  options: Partial<TypeDocOptions> & { frontmatter: any }
): AstroIntegration => ({
  name: "typedoc-astro",
  hooks: {
    "astro:config:setup": async ({ command }) => {
      const app = new Application();
      app.renderer.defineTheme("astro", AstroTheme);
      load(app);
      bootstrap(app, { ...options, plugin: [], theme: "astro" });
      const outDir = app.options.getValue("out");

      const project = app.convert();

      // if project is undefined typedoc has a problem - error logging will be supplied by typedoc.
      if (!project) {
        return;
      }

      // TODO: support dev mode
      // if (command === "dev") {
      //   app.convertAndWatch(async (project) => {
      //     await app.generateDocs(project, outDir);
      //   });
      // } else {
      await app.generateDocs(project, outDir);
      // await addFrontmatter(outDir, frontmatter);
    },
  },
});
export default typedoc;
