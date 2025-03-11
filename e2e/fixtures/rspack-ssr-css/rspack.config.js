module.exports = () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { createConfig } = require('@nx/angular-rspack');
    return createConfig({
      options: {
        browser: './src/main.ts',
        index: './src/index.html',
        server: './src/main.server.ts',
        ssr: { entry: './src/server.ts' },
      },
    });
  }
  return {};
};
