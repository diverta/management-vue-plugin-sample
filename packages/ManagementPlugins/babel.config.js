module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['>1%', 'last 2 versions', 'IE 10'],
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-classes',
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: ['>1%', 'last 2 versions', 'IE 11'],
            },
          },
        ],
      ],
    },
  },
};
