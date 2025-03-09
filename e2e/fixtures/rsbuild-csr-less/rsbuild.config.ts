export default () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { createConfig } = require('@nx/angular-rsbuild');
    return createConfig({
      options: {
        browser: './src/main.ts',
        styles: ['./src/styles.less'],
        inlineStylesExtension: 'less',
        devServer: {
          port: 8080,
        },
      },
    });
  }
  return {};
};
