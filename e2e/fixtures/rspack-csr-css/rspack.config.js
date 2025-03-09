module.exports = () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { join } = require('path');
    const { createConfig } = require('@nx/angular-rspack');
    return createConfig({
      options: {
        root: __dirname,
        name: 'rspack-csr-css',
        index: './src/index.html',
        assets: ['./public'],
        styles: ['./src/styles.css'],
        polyfills: ['zone.js'],
        main: './src/main.ts',
        outputPath: './dist/browser',
        tsConfig: join(__dirname, './tsconfig.app.json'),
        skipTypeChecking: false,
        devServer: {
          port: 8080,
        },
      },
    });
  }
  return {};
};
