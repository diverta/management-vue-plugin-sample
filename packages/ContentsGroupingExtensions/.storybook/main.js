const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@whitespace/storybook-addon-html"
  ],
  "framework": "@storybook/vue",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  webpackFinal: async (config, { configType }) => {

    // overriding custom SVG loading for CKEditor5
    config.module.rules.find(def => def.test.test('.svg')).exclude = [
      /\/ChildWysiwyg\/icons\//,
      /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
    ]
    config.module.rules.push({
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
      use: ['raw-loader'] 
    });
    config.module.rules.push({
      test: /\/ChildWysiwyg\/icons\//,
      use: ['raw-loader'],
    });

    // overriding custom CSS loading for CKEditor5
    config.module.rules.find(def => def.test.test('.css')).exclude = [
      /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
    ]
    config.module.rules.push({
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
      use: [
          {
              loader: 'style-loader',
              options: {
                  injectType: 'singletonStyleTag',
                  attributes: {
                      'data-cke': true,
                  },
              },
          },
          {
              loader: 'postcss-loader',
              options: styles.getPostCssConfig({
                  themeImporter: {
                      themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                  },
                  minify: true,
              }),
          },
      ],
    });

    // adding plugin for CKEditor5
    config.plugins.push(
        new CKEditorWebpackPlugin({
            language: 'ja',
            addMainLanguageTranslationsToAllAssets: true,
        }),
    )

    return config;
  },
}