// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/palenight");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Jongleur",
  tagline: "Making 3d animations and interactions simple!",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "lucafanselau", // Usually your GitHub org/user name.
  projectName: "jongleur", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },

  plugins: [
    // [
    //   "docusaurus-plugin-typedoc",
    //   /** @type {import("docusaurus-plugin-typedoc/dist/types").PluginOptions} */
    //   {
    //     // typedoc options
    //     entryPoints: ["../../src/index.ts"],
    //     tsconfig: "../../tsconfig.json",
    //     readme: "none",
    //     // plugin options
    //     sidebar: {
    //       // fullNames: true,
    //       categoryLabel: "API"
    //     }
    //   }
    // ]
    () => ({
      name: "resolve-react",
      configureWebpack() {
        return {
          resolve: {
            alias: {
              // assuming root node_modules is up from "./packages/<your-docusaurus>
              react: require.resolve("./node_modules/react")
            }
          }
        };
      }
    })
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/lucafanselau/jongleur"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      })
    ],
    [
      "docusaurus-preset-shiki-twoslash",
      {
        vfsRoot: process.cwd(),
        themes: ["material-lighter", "one-dark-pro"],
        defaultCompilerOptions: {
          types: ["node"]
        }
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Jongleur",
        logo: {
          alt: "Juggling man",
          src: "img/logo.png"
        },
        items: [
          {
            type: "doc",
            docId: "guides/getting-started",
            position: "left",
            label: "Documentation"
          },
          {
            to: "docs/api/modules", // 'api' is the 'out' directory
            activeBasePath: "docs",
            label: "API",
            position: "left"
          },
          {
            href: "https://github.com/lucafanselau/jongleur",
            label: "GitHub",
            position: "right"
          }
        ]
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Documentation",
                to: "/docs/guides/getting-started"
              },
              {
                label: "API",
                to: "/docs/api/modules"
              }
            ]
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/lucafanselau/jongleur"
              }
            ]
          }
        ]
        // copyright: `Copyright © ${new Date().getFullYear()} Jongleur, Inc.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
