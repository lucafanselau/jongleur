import * as fs from "fs";
import path from "node:path";
import {
  BindOption,
  DeclarationReflection,
  PageEvent,
  ReflectionKind,
  Renderer,
  RendererEvent,
} from "typedoc";
import { MarkdownTheme } from "typedoc-plugin-markdown";
import {
  FrontMatterVars,
  getPageTitle,
  prependYAML,
} from "typedoc-plugin-markdown/dist/utils/front-matter";

export class AstroTheme extends MarkdownTheme {
  @BindOption("frontmatter")
  frontmatter!: { layout: string };

  constructor(renderer: Renderer) {
    super(renderer);

    this.entryDocument = "none"; // home.md";
    this.hideBreadcrumbs = true;

    this.listenTo(this.owner, {
      [PageEvent.END]: this.onPageEnd,
    });
  }

  getRelativeUrl(url: string) {
    return encodeURI(url.replace(".md", ""));
  }

  toUrl(mapping: any, reflection: DeclarationReflection) {
    return `${reflection.getFullName().replace(/\//g, ".")}.md`;
  }

  onPageEnd(page: PageEvent) {
    if (page.contents) {
      page.contents = page.contents.replace(/# [\w :]*/, "");
      page.contents = prependYAML(page.contents, this.getYamlItems(page));
    }
  }
  getId(page: PageEvent) {
    return path.basename(page.url, path.extname(page.url));
  }

  getTitle(page: PageEvent) {
    if (page.url === this.globalsFile) {
      return "jongleur";
    }
    return "jongleur/" + page.url.replace(/.md$/, "");
  }
  getYamlItems(page: PageEvent) {
    const pageId = this.getId(page);
    const pageTitle = this.getTitle(page);
    const frontmatter = this.getOption("frontmatter") as object | undefined;
    let items = {
      id: pageId,
      title: pageTitle,
      ...(frontmatter ?? {}),
    };
    return items;
  }
  get mappings() {
    return super.mappings.map((mapping) => {
      if (mapping.kind.includes(ReflectionKind.Namespace)) {
        return {
          ...mapping,
          directory: "namespaces",
        };
      }
      return mapping;
    });
  }

  get globalsFile() {
    // this is extension less, because i have the "landing page" (eg. modules.md) in VC
    return this.entryPoints.length > 1 ? "_modules" : "_exports";
  }
}
