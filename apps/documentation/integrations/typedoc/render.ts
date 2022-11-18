import * as fs from "fs";
import {
  Application,
  BooleanDeclarationOption,
  MixedDeclarationOption,
  ObjectDeclarationOption,
  ParameterType,
  ProjectReflection,
  RendererEvent,
  StringDeclarationOption,
  TSConfigReader,
  TypeDocOptions,
  TypeDocReader,
  UrlMapping,
} from "typedoc";

export const bootstrap = (
  app: Application,
  options: Partial<TypeDocOptions>
) => {
  addTypedocReaders(app);
  addTypedocDeclarations(app);
  // app.renderer.render = render;
  app.bootstrap(options);
};

// export async function render(
//   project: ProjectReflection,
//   outputDirectory: string
// ) {
//   if (!this.prepareTheme()) {
//     return;
//   }
//   const output = new RendererEvent(
//     RendererEvent.BEGIN,
//     outputDirectory,
//     project
//   );
//   output.urls = this.theme!.getUrls(project);
//   this.trigger(output);
//   if (!output.isDefaultPrevented) {
//     output?.urls?.forEach((mapping: UrlMapping) => {
//       this.renderDocument(output.createPageEvent(mapping));
//     });

//     this.trigger(RendererEvent.END, output);
//   }
// }

const addTypedocReaders = (app: Application) => {
  app.options.addReader(new TypeDocReader());
  app.options.addReader(new TSConfigReader());
};

const addTypedocDeclarations = (app: Application) => {
  // app.options.addDeclaration({
  //   name: "id",
  // } as StringDeclarationOption);

  // app.options.addDeclaration({
  //   name: "docsRoot",
  // } as StringDeclarationOption);

  // app.options.addDeclaration({
  //   name: "siteDir",
  // } as MixedDeclarationOption);

  // app.options.addDeclaration({
  //   name: "globalsTitle",
  // } as StringDeclarationOption);

  // app.options.addDeclaration({
  //   name: "readmeTitle",
  // } as StringDeclarationOption);

  // app.options.addDeclaration({
  //   name: "indexSlug",
  // } as StringDeclarationOption);

  // app.options.addDeclaration({
  //   name: "includeExtension",
  // } as BooleanDeclarationOption);

  // app.options.addDeclaration({
  //   name: "sidebar",
  //   type: ParameterType.Mixed,
  // } as MixedDeclarationOption);

  app.options.addDeclaration({
    name: "frontmatter",
    type: ParameterType.Mixed,
    defaultValue: { layout: "some" },
  } as MixedDeclarationOption);
};

export function removeDir(path: string) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);
    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          removeDir(path + "/" + filename);
        } else {
          fs.unlinkSync(path + "/" + filename);
        }
      });
      fs.rmdirSync(path);
    } else {
      fs.rmdirSync(path);
    }
  }
}
