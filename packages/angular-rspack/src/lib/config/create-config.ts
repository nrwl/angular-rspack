import {
  Configuration,
  DevServer,
  SwcJsMinimizerRspackPlugin,
  SourceMapDevToolPlugin,
  RspackPluginInstance,
  RuleSetRule,
  CssExtractRspackPlugin,
  javascript,
} from '@rspack/core';
import { merge as rspackMerge } from 'webpack-merge';
import deepMerge from 'deepmerge';
import { resolve } from 'path';
import {
  JS_ALL_EXT_REGEX,
  TS_ALL_EXT_REGEX,
} from '@nx/angular-rspack-compiler';
import {
  AngularRspackPluginOptions,
  normalizeOptions,
  SourceMap,
} from '../models';
import { NgRspackPlugin } from '../plugins/ng-rspack';
import { DevToolsIgnorePlugin } from '../plugins/tools/dev-tools-ignore-plugin';
import { getStyleLoaders, getStylesEntry } from './style-config-utils';
import { deleteOutputDir, getOutputHashFormat } from './helpers';
import {
  getAllowedHostsConfig,
  getProxyConfig,
} from './dev-server-config-utils';
import { configureI18n } from './i18n/create-i18n-options';

function configureSourceMap(sourceMap: SourceMap) {
  const { scripts, styles, hidden, vendor } = sourceMap;

  const sourceMapRules: RuleSetRule[] = [];
  const sourceMapPlugins: RspackPluginInstance[] = [];

  if (scripts || styles) {
    const include: RegExp[] = [];
    if (scripts) {
      include.push(/js$/);
    }

    if (styles) {
      include.push(/css$/);
    }

    sourceMapPlugins.push(new DevToolsIgnorePlugin());

    sourceMapPlugins.push(
      new SourceMapDevToolPlugin({
        filename: '[file].map',
        include,
        // We want to set sourceRoot to  `webpack:///` for non
        // inline sourcemaps as otherwise paths to sourcemaps will be broken in browser
        // `webpack:///` is needed for Visual Studio breakpoints to work properly as currently
        // there is no way to set the 'webRoot'
        sourceRoot: 'webpack:///',
        moduleFilenameTemplate: '[resource-path]',
        append: hidden ? false : undefined,
      })
    );

    sourceMapRules.push({
      test: /\.[cm]?jsx?$/,
      enforce: 'pre',
      loader: require.resolve('source-map-loader'),
      options: {
        filterSourceMappingUrl: (_mapUri: string, resourcePath: string) => {
          if (vendor) {
            // Consume all sourcemaps when vendor option is enabled.
            return true;
          }

          // Don't consume sourcemaps in node_modules when vendor is disabled.
          // But, do consume local libraries sourcemaps.
          return !resourcePath.includes('node_modules');
        },
      },
    });
  }

  return { sourceMapRules, sourceMapPlugins };
}

const VENDORS_TEST = /[\\/]node_modules[\\/]/;

export async function _createConfig(
  options: AngularRspackPluginOptions,
  rspackConfigOverrides?: Partial<Configuration>
): Promise<Configuration[]> {
  const { options: _options, i18n } = await configureI18n(
    options.root ?? process.cwd(),
    options
  );
  // Update file hashes to include translation file content
  const i18nHash = i18n.shouldInline
    ? Object.values(i18n.locales).reduce(
        (data, locale) =>
          data + locale.files.map((file) => file.integrity || '').join('|'),
        ''
      )
    : () => {
        // no-op as i18n is not inlined
      };

  const normalizedOptions = normalizeOptions(_options);
  const isProduction = process.env['NODE_ENV'] === 'production';
  const isDevServer = process.env['WEBPACK_SERVE'];
  const hashFormat = getOutputHashFormat(normalizedOptions.outputHashing);
  const { root } = normalizedOptions;

  if (options.deleteOutputPath) {
    await deleteOutputDir(root, normalizedOptions.outputPath.base);
  }

  const { sourceMapRules, sourceMapPlugins } = configureSourceMap(
    normalizedOptions.sourceMap
  );

  const defaultConfig: Configuration = {
    context: root,
    mode: isProduction ? 'production' : 'development',
    devtool: normalizedOptions.sourceMap.scripts ? 'source-map' : undefined,
    output: {
      uniqueName: 'rspack-angular',
      publicPath: 'auto',
      clean: normalizedOptions.deleteOutputPath,
      crossOriginLoading: false,
      trustedTypes: { policyName: 'angular#bundler' },
      sourceMapFilename: normalizedOptions.sourceMap.scripts
        ? '[file].map'
        : undefined,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js'],
      symlinks: !normalizedOptions.preserveSymlinks,
      modules: ['node_modules'],
      mainFields: ['es2020', 'es2015', 'browser', 'module', 'main'],
      conditionNames: ['es2020', 'es2015', '...'],
      tsConfig: {
        configFile: normalizedOptions.tsConfig,
      },
      ...(i18n.shouldInline && normalizedOptions.aot
        ? { alias: { '@angular/localize/init': false } }
        : {}),
    },
    resolveLoader: {
      symlinks: !normalizedOptions.preserveSymlinks,
    },
    watchOptions: {
      followSymlinks: normalizedOptions.preserveSymlinks,
    },
    module: {
      parser: {
        javascript: {
          requireContext: false,
          url: false,
        },
      },
      rules: [
        ...getStyleLoaders(
          normalizedOptions.stylePreprocessorOptions,
          normalizedOptions.sourceMap
        ),
        ...sourceMapRules,
        { test: /[/\\]rxjs[/\\]add[/\\].+\.js$/, sideEffects: true },
        {
          test: TS_ALL_EXT_REGEX,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                  },
                  target: 'es2022',
                },
              },
            },
            {
              loader: require.resolve(
                '@nx/angular-rspack/loaders/angular-loader'
              ),
            },
          ],
        },
        {
          test: JS_ALL_EXT_REGEX,
          use: [
            {
              loader: require.resolve(
                '@nx/angular-rspack/loaders/angular-partial-transform-loader'
              ),
            },
          ],
        },
      ],
    },
    plugins: [
      ...sourceMapPlugins,
      ...(i18n.shouldInline
        ? [
            {
              apply(compiler) {
                compiler.hooks.compilation.tap(
                  'AngularRspackPlugin',
                  (compilation) => {
                    javascript.JavascriptModulesPlugin.getCompilationHooks(
                      compilation
                    ).chunkHash.tap('AngularRspackPlugin', (_, hash) => {
                      hash.update('$localize' + i18nHash);
                    });
                  }
                );
              },
            },
          ]
        : []),
      new CssExtractRspackPlugin({
        filename: `[name]${hashFormat.extract}.css`,
      }),
    ],
  };

  const configs: Configuration[] = [];
  if (normalizedOptions.hasServer) {
    const serverConfig: Configuration = {
      ...defaultConfig,
      name: 'server',
      target: 'node',
      entry: {
        server: {
          import: [
            (normalizedOptions.ssr as { entry: string }).entry,
            ...(i18n.shouldInline ? ['@angular/localize/init'] : []),
          ],
        },
      },
      output: {
        ...defaultConfig.output,
        publicPath: '/',
        clean: normalizedOptions.deleteOutputPath,
        path: normalizedOptions.outputPath.server,
        filename: '[name].js',
        chunkFilename: '[name].js',
      },
      devServer: {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        allowedHosts: getAllowedHostsConfig(
          normalizedOptions.devServer.allowedHosts,
          normalizedOptions.devServer.disableHostCheck
        ),
        client: {
          webSocketURL: {
            hostname: normalizedOptions.devServer.host,
            port: normalizedOptions.devServer.port,
          },
          overlay: {
            errors: true,
            warnings: false,
            runtimeErrors: true,
          },
          reconnect: true,
        },
        host: normalizedOptions.devServer.host,
        port: normalizedOptions.devServer.port,
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
        server: {
          options:
            normalizedOptions.devServer.sslKey &&
            normalizedOptions.devServer.sslCert
              ? {
                  key: resolve(root, normalizedOptions.devServer.sslKey),
                  cert: resolve(root, normalizedOptions.devServer.sslCert),
                }
              : {},
          type: normalizedOptions.devServer.ssl ? 'https' : 'http',
        },
        proxy: await getProxyConfig(
          root,
          normalizedOptions.devServer.proxyConfig
        ),
      },
      externals: normalizedOptions.externalDependencies,
      optimization: {
        chunkIds: normalizedOptions.namedChunks ? 'named' : 'deterministic',
        moduleIds: 'deterministic',
        ...(normalizedOptions.optimization && !isDevServer
          ? {
              minimize: true,
              runtimeChunk: 'single',
              splitChunks: {
                chunks: 'async',
                minChunks: 1,
                minSize: 20000,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                cacheGroups: {
                  default: normalizedOptions.commonChunk && {
                    chunks: 'async',
                    minChunks: 2,
                    priority: 10,
                  },
                  common: normalizedOptions.commonChunk && {
                    name: 'common',
                    chunks: 'async',
                    minChunks: 2,
                    enforce: true,
                    priority: 5,
                  },
                  vendors: false,
                  defaultVendors: normalizedOptions.vendorChunk && {
                    name: 'vendor',
                    chunks: (chunk) => chunk.name === 'main',
                    enforce: true,
                    test: VENDORS_TEST,
                  },
                },
              },
              minimizer: [
                new SwcJsMinimizerRspackPlugin({
                  minimizerOptions: {
                    minify: true,
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
            }),
      },
      plugins: [
        ...(defaultConfig.plugins ?? []),
        new NgRspackPlugin(
          {
            ...normalizedOptions,
            polyfills: ['zone.js/node'],
          },
          i18n
        ),
      ],
    };
    const mergedConfig = rspackMerge(
      serverConfig,
      (rspackConfigOverrides as unknown) ?? {}
    );
    configs.push(mergedConfig);
  }

  const browserConfig = {
    ...defaultConfig,
    name: 'browser',
    ...(normalizedOptions.hasServer && isDevServer
      ? { dependencies: ['server'] }
      : {}),
    target: 'web',
    entry: {
      main: {
        import: [
          normalizedOptions.browser,
          ...(i18n.shouldInline ? ['@angular/localize/init'] : []),
        ],
      },
      styles: {
        import: getStylesEntry(normalizedOptions),
      },
    },
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      allowedHosts: getAllowedHostsConfig(
        normalizedOptions.devServer.allowedHosts,
        normalizedOptions.devServer.disableHostCheck
      ),
      client: {
        webSocketURL: {
          hostname: normalizedOptions.devServer.host,
          port: normalizedOptions.devServer.port,
        },
        overlay: {
          errors: true,
          warnings: false,
          runtimeErrors: true,
        },
        reconnect: true,
      },
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
      host: normalizedOptions.devServer.host,
      port: normalizedOptions.devServer.port,
      server: {
        options:
          normalizedOptions.devServer.sslKey &&
          normalizedOptions.devServer.sslCert
            ? {
                key: resolve(root, normalizedOptions.devServer.sslKey),
                cert: resolve(root, normalizedOptions.devServer.sslCert),
              }
            : {},
        type: normalizedOptions.devServer.ssl ? 'https' : 'http',
      },
      proxy: await getProxyConfig(
        root,
        normalizedOptions.devServer.proxyConfig
      ),
      onListening: (devServer) => {
        if (!devServer) {
          throw new Error('@rspack/dev-server is not defined');
        }

        const port =
          (devServer.server?.address() as { port: number })?.port ??
          normalizedOptions.devServer.port;
        console.log('Listening on port:', port);
      },
    } as DevServer,

    output: {
      ...defaultConfig.output,
      hashFunction: isProduction ? 'xxhash64' : undefined,
      publicPath: 'auto',
      clean: normalizedOptions.deleteOutputPath,
      path: normalizedOptions.outputPath.browser,
      cssFilename: `[name]${hashFormat.file}.css`,
      filename: `[name]${hashFormat.chunk}.js`,
      chunkFilename: `[name]${hashFormat.chunk}.js`,
      scriptType: 'module',
      module: true,
    },
    optimization: {
      chunkIds: normalizedOptions.namedChunks ? 'named' : 'deterministic',
      moduleIds: 'deterministic',
      ...(normalizedOptions.optimization && !isDevServer
        ? {
            minimize: true,
            runtimeChunk: false,
            splitChunks: {
              chunks: 'all',
              minChunks: 1,
              minSize: 20000,
              maxAsyncRequests: 30,
              maxInitialRequests: 30,
              cacheGroups: {
                default: normalizedOptions.commonChunk && {
                  chunks: 'async',
                  minChunks: 2,
                  priority: 10,
                },
                common: normalizedOptions.commonChunk && {
                  name: 'common',
                  chunks: 'async',
                  minChunks: 2,
                  enforce: true,
                  priority: 5,
                },
                vendors: false,
                defaultVendors: normalizedOptions.vendorChunk && {
                  name: 'vendor',
                  chunks: (chunk) => chunk.name === 'main',
                  enforce: true,
                  test: VENDORS_TEST,
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
          }),
    },
    plugins: [
      ...(defaultConfig.plugins ?? []),
      new NgRspackPlugin(
        {
          ...normalizedOptions,
          polyfills: ['zone.js'],
          hasServer: false,
        },
        i18n
      ),
    ],
  };
  const mergedConfig = rspackMerge(
    browserConfig,
    (rspackConfigOverrides as unknown) ?? {}
  );
  configs.unshift(mergedConfig);
  return configs;
}

export function handleConfigurations(
  defaultOptions: {
    options: AngularRspackPluginOptions;
    rspackConfigOverrides?: Partial<Configuration>;
  },
  configurations: Record<
    string,
    {
      options: Partial<AngularRspackPluginOptions>;
      rspackConfigOverrides?: Partial<Configuration>;
    }
  >,
  configurationModes: string[]
) {
  let mergedConfigurationBuildOptions = { ...defaultOptions.options };
  let mergedRspackConfigOverrides = defaultOptions.rspackConfigOverrides ?? {};
  for (const configurationName of configurationModes) {
    if (configurationName in configurations) {
      mergedConfigurationBuildOptions = deepMerge(
        mergedConfigurationBuildOptions,
        configurations[configurationName].options ?? {}
      );
      if (configurations[configurationName].rspackConfigOverrides) {
        mergedRspackConfigOverrides = rspackMerge(
          mergedRspackConfigOverrides,
          configurations[configurationName].rspackConfigOverrides
        );
      }
    }
  }
  return { mergedConfigurationBuildOptions, mergedRspackConfigOverrides };
}

export async function createConfig(
  defaultOptions: {
    options: AngularRspackPluginOptions;
    rspackConfigOverrides?: Partial<Configuration>;
  },
  configurations: Record<
    string,
    {
      options: Partial<AngularRspackPluginOptions>;
      rspackConfigOverrides?: Partial<Configuration>;
    }
  > = {},
  configEnvVar = 'NGRS_CONFIG'
): Promise<Configuration[]> {
  const configurationMode = process.env[configEnvVar] ?? 'production';
  const configurationModes = parseConfigurationMode(configurationMode);

  const { mergedConfigurationBuildOptions, mergedRspackConfigOverrides } =
    handleConfigurations(defaultOptions, configurations, configurationModes);

  return _createConfig(
    mergedConfigurationBuildOptions,
    mergedRspackConfigOverrides
  );
}

function parseConfigurationMode(configurationMode: string) {
  return configurationMode.split(',').map((m) => m.trim());
}
