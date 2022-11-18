import * as fd from "node:fs/promises";
import { globby } from "globby";
import { stringify } from "yaml";

export const addFrontmatter = async (outDir: string, obj: any) => {
  const files = await globby(outDir + "/**/*.md");
  await Promise.all(
    files.map(async (f) => {
      const content = await fd.readFile(f);
      const frontmatter = "---\n" + stringify(obj) + "---\n\n";
      await fd.writeFile(f, frontmatter + content.toString());
    })
  );
};
