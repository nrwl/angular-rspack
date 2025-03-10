import { join } from 'path';
import { Configuration, SwcJsMinimizerRspackPlugin } from '@rspack/core';
import { NgRspackPlugin } from '../plugins/ng-rspack';
import { AngularRspackPluginOptions } from '../models';

export function createServerConfig(
  defaultConfig: Configuration,
  normalizedOptions: AngularRspackPluginOptions
): Configuration {
  return {
    ...defaultConfig,
    target: 'node',
    entry: {
      server: {
        import: [(normalizedOptions.ssr as { entry: string }).entry],
      },
    },
    output: {
      ...defaultConfig.output,
      publicPath: 'auto',
      clean: true,
      path: join(normalizedOptions.root, 'dist', 'server'),
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      allowedHosts: 'auto',
      client: {
        webSocketURL: {
          hostname: 'localhost',
          port: normalizedOptions.devServer?.port ?? 4200,
        },
        overlay: {
          errors: true,
          warnings: false,
          runtimeErrors: true,
        },
        reconnect: true,
      },
      port: normalizedOptions.devServer?.port ?? 4200,
      hot: false,
      liveReload: true,
      watchFiles: ['./src/**/*.*', './public/**/*.*'],
      historyApiFallback: {
        index: '/index.html',
        rewrites: [{ from: /^\/$/, to: 'index.html' }],
      },
      devMiddleware: {
        writeToDisk: (file) => !file.includes('.hot-update.'),
      },
    },
    optimization: normalizedOptions.optimization
      ? {
          minimize: true,
          runtimeChunk: false,
          splitChunks: {
            chunks: 'async',
            minChunks: 1,
            minSize: 20000,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
              defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true,
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
          minimizer: [
            new SwcJsMinimizerRspackPlugin({
              minimizerOptions: {
                minify: true,
                mangle: true,
                compress: {
                  passes: 2,
                },
                format: {
                  comments: false,
                },
              },
            }),
          ],
        }
      : {
          minimize: false,
          minimizer: [],
        },
    plugins: [
      ...(defaultConfig.plugins ?? []),
      new NgRspackPlugin({
        ...normalizedOptions,
        polyfills: ['zone.js/node'],
      }),
    ],
  };
}
