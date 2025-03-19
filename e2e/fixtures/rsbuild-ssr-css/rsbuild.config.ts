export default () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { createConfig } = require('@nx/angular-rsbuild');
    return createConfig({
      options: {
        browser: './src/main.ts',
        server: './src/main.server.ts',
        ssr: { entry: './src/server.ts' },
        inlineStylesExtension: 'css',
      },
    });
  }
  return {};
};
