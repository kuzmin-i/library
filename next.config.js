const withMDX = require("@next/mdx")({ extension: /\.mdx?$/ });
const withAntdLess = require("next-plugin-antd-less");

const colors = require("./styles/theme/colors");
const { primary, white, grey, black } = colors;

module.exports = withMDX(
  withAntdLess({
    pageExtensions: ["js", "jsx", "mdx"],
    modifyVars: {
      "@primary-color": primary,
      "@text-color": black,
      "@heading-color": black,
      "@layout-body-background": white,
      "@layout-header-background": primary,
      "@layout-header-color": white,
      "@layout-footer-background": grey,
      "@menu-dark-color": white,
      "@alert-info-bg-color": grey,
      "@select-item-selected-bg": grey,
    },
    lessVarsFilePath: "./styles/theme/variables.less",
    images: {
      domains: ["library.strelka-kb.com"],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 416, 560],
    },
    redirects: async () => [
      {
        source: "/auth/:slug((?!sign-in$|error$).*)",
        destination: "/auth/sign-in",
        permanent: true,
      },
      {
        source: "/book/:id/take",
        destination: "/book/:id",
        permanent: true,
      },
    ],
  })
);
