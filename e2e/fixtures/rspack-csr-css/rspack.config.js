module.exports = () => {
  if (global.NX_GRAPH_CREATION === undefined) {
    const { createConfig } = require('@nx/angular-rspack');
    return createConfig(
      {
        options: {
          root: __dirname,
          name: 'rspack-csr-css',
          index: './src/index.html',
          assets: [{ glob: '**/*', input: 'public' }],
          styles: ['./src/styles.css'],
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
