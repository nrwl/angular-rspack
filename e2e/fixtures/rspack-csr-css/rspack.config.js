module.exports = () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { join } = require('path');
    const { createConfig } = require('@nx/angular-rspack');
    return createConfig(
      {
        options: {
          name: 'rspack-csr-css',
          index: './src/index.html',
          assets: [{ glob: '**/*', input: 'public' }],
          styles: ['./src/styles.css'],
          polyfills: ['zone.js'],
          main: './src/main.ts',
          outputPath: {
            base: './build',
            browser: './build/static',
          },
          outputHashing: 'none',
          tsConfig: join(__dirname, './tsconfig.app.json'),
          skipTypeChecking: false,
          devServer: {
            port: 8080,
            proxyConfig: './proxy.conf.json',
          },
        },
      },
      {
        development: {
          options: {
            extractLicenses: false,
            optimization: false,
            namedChunks: true,
            vendorChunk: true,
          },
        },
      }
    );
  }
  return {};
};
