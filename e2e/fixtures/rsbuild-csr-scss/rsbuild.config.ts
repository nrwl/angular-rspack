export default () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { createConfig } = require('@nx/angular-rsbuild');
    return createConfig({
      options: {
        browser: './src/main.ts',
        inlineStylesExtension: 'scss',
        styles: ['./src/styles.scss'],
      },
    });
  }
  return {};
};
