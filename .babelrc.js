const createConfig = (prod) => ({
  presets: ["next/babel"],
  plugins: [
    [
      "styled-components",
      {
        ssr: true,
        minify: true,
        transpileTemplateLiterals: true,
        pure: true,
        displayName: !prod,
        preprocess: false,
      },
    ],
    [
      "inline-react-svg",
      {
        svgo: {
          plugins: [
            {
              name: "removeViewBox",
              active: false,
            },
          ],
        },
      },
    ],
    ["import", { libraryName: "antd", style: true }],
  ],
});

module.exports = {
  env: {
    development: createConfig(false),
    production: createConfig(true),
    test: createConfig(true),
  },
};
