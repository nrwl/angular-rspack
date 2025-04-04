module.exports = () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { createConfig } = require('@nx/angular-rspack');
    return createConfig(
      {
        options: {
          root: __dirname,
          name: 'rspack-csr-css',
          index: './src/index.html',
          assets: [
            {
              input: '../shared/assets/src/assets',
              glob: '**/*',
              output: 'assets',
            },
            { glob: '**/*', input: 'public' },
          ],
          styles: ['../shared/styles/src/index.scss', './src/styles.css'],
          polyfills: ['zone.js'],
          main: './src/main.ts',
          outputPath: {
            base: './dist',
            browser: './dist/static',
          },
          sourceMap: {
            scripts: true,
            styles: true,
          },
          outputHashing: 'none',
          tsConfig: './tsconfig.app.json',
          skipTypeChecking: false,
          devServer: {
            host: '127.0.0.1',
            port: 8080,
            proxyConfig: './proxy.conf.json',
          },
          define: {
            nxAngularRspack: '"20.6.2"',
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
