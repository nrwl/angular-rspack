module.exports = () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { createConfig } = require('@nx/angular-rspack');
    return createConfig(
      {
        options: {
          root: __dirname,
          browser: './src/main.ts',
          index: './src/index.html',
          server: './src/main.server.ts',
          polyfills: ['zone.js'],
          ssr: { entry: './src/server.ts' },
          verbose: true,
          assets: [
            {
              glob: '**/*',
              input: './public',
            },
          ],
        },
      },
      {
        development: {
          options: {
            optimization: false,
          },
        },
      }
    );
  }
  return {};
};
