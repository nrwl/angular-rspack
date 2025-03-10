import {
  defineConfig,
  type RsbuildConfig,
  mergeRsbuildConfig,
  RsbuildPlugin,
} from '@rsbuild/core';
import { dirname, resolve } from 'path';
import { OutputPath, PluginAngularOptions } from '../models/plugin-options';
import { normalizeOptions } from '../models/normalize-options';
import { pluginAngular } from '../plugin/plugin-angular';
import { pluginHoistedJsTransformer } from '../plugin/plugin-hoisted-js-transformer';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginLess } from '@rsbuild/plugin-less';
import { getOutputHashFormat } from './helpers';
import { getProxyConfig } from './dev-server-config-utils';
import { join } from 'node:path';

export async function _createConfig(
  pluginOptions: Partial<PluginAngularOptions>,
  rsbuildConfigOverrides?: Partial<RsbuildConfig>
): Promise<RsbuildConfig> {
  const normalizedOptions = normalizeOptions(pluginOptions);
  const hashFormat = getOutputHashFormat(normalizedOptions.outputHashing);
  const browserPolyfills = [...normalizedOptions.polyfills, 'zone.js'];
  const serverPolyfills = [
    ...normalizedOptions.polyfills,
    'zone.js/node',
    '@angular/platform-server/init',
  ];

  const isRunningDevServer = process.argv.at(2) === 'dev';
  const isProd = process.env.NODE_ENV === 'production';

  const stylePlugins: RsbuildPlugin[] = [];

  if (
    normalizedOptions.inlineStyleLanguage === 'scss' ||
    normalizedOptions.inlineStyleLanguage === 'sass'
  ) {
    if (
      normalizedOptions.stylePreprocessorOptions?.includePaths ||
      normalizedOptions.stylePreprocessorOptions?.sass
    ) {
      stylePlugins.push(
        pluginSass({
          sassLoaderOptions: {
            sassOptions: {
              includePaths:
                normalizedOptions.stylePreprocessorOptions?.includePaths,
              ...(normalizedOptions.stylePreprocessorOptions?.sass ?? {}),
            },
          },
        })
      );
    } else {
      stylePlugins.push(pluginSass());
    }
  } else if (normalizedOptions.inlineStyleLanguage === 'less') {
    if (normalizedOptions.stylePreprocessorOptions?.includePaths) {
      stylePlugins.push(
        pluginLess({
          lessLoaderOptions: {
            lessOptions: {
              javascriptEnabled: true,
              paths: normalizedOptions.stylePreprocessorOptions?.includePaths,
            },
          },
        })
      );
    } else {
      stylePlugins.push(
        pluginLess({
          lessLoaderOptions: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        })
      );
    }
  }

  const root = process.cwd();
  const rsbuildPluginAngularConfig = defineConfig({
    root,
    source: {
      tsconfigPath: normalizedOptions.tsConfig,
    },
    plugins: [pluginHoistedJsTransformer(normalizedOptions), ...stylePlugins],
    mode:
      // mode is set to production to enable optimizations
      normalizedOptions.optimization === false
        ? 'development'
        : isProd
        ? 'production'
        : 'development',
    dev: {
      ...(isRunningDevServer && normalizedOptions.hasServer
        ? {
            writeToDisk: (file) => !file.includes('.hot-update.'),
            client: {
              port: normalizedOptions.devServer?.port ?? 4200,
              host: 'localhost',
            },
            hmr: false,
            liveReload: true,
          }
        : undefined),
    },
    server: {
      host: 'localhost',
      port: normalizedOptions.devServer?.port ?? 4200,
      htmlFallback: false,
      historyApiFallback: {
        index: '/index.html',
        rewrites: [{ from: /^\/$/, to: 'index.html' }],
      },
      https:
        normalizedOptions.devServer?.sslKey &&
        normalizedOptions.devServer?.sslCert
          ? {
              key: resolve(root, normalizedOptions.devServer.sslKey),
              cert: resolve(root, normalizedOptions.devServer.sslCert),
            }
          : undefined,
      proxy: await getProxyConfig(
        root,
        normalizedOptions.devServer?.proxyConfig
      ),
    },
    tools: {
      rspack(config) {
        config.resolve ??= {};
        config.resolve.extensionAlias = {};
      },
    },
    environments: {
      browser: {
        plugins: [pluginAngular(normalizedOptions)],
        source: {
          preEntry: [...browserPolyfills, ...normalizedOptions.styles],
          entry: {
            index: normalizedOptions.browser,
          },
          define: {
            ...(isProd ? { ngDevMode: 'false' } : undefined),
            ngJitMode: normalizedOptions.aot ? undefined : 'true', // @TODO: use normalizedOptions
          },
        },
        output: {
          target: 'web',
          filename: {
            js: `[name]${hashFormat.chunk}.js`,
            css: `[name]${hashFormat.file}.css`,
          },
          distPath: {
            root: normalizedOptions.outputPath.browser,
            js: '',
            media: normalizedOptions.outputPath.media,
            assets: normalizedOptions.outputPath.media,
          },
          copy: normalizedOptions.assets.map((srcPath) => ({
            from: srcPath,
            to: dirname(srcPath),
          })),
        },
        html: {
          template: normalizedOptions.index,
        },
      },
      ...(normalizedOptions.hasServer
        ? {
            server: {
              plugins: [pluginAngular(normalizedOptions)],
              source: {
                preEntry: [...serverPolyfills],
                entry: {
                  server: (normalizedOptions.ssr as { entry: string }).entry,
                },
                define: {
                  ngServerMode: true,
                  ...(isProd ? { ngDevMode: 'false' } : undefined),
                  ngJitMode: normalizedOptions.aot ? undefined : 'true', // @TODO: use normalizedOptions
                },
              },
              output: {
                target: 'node',
                polyfill: 'entry',
                distPath: { root: normalizedOptions.outputPath.server },
              },
            },
          }
        : {}),
    },
  });

  const userDefinedConfig = defineConfig(rsbuildConfigOverrides || {});
  return mergeRsbuildConfig(rsbuildPluginAngularConfig, userDefinedConfig);
}

export async function createConfig(
  defaultOptions: {
    options: Partial<PluginAngularOptions>;
    rsbuildConfigOverrides?: Partial<RsbuildConfig>;
  },
  configurations: Record<
    string,
    {
      options: Partial<PluginAngularOptions>;
      rsbuildConfigOverrides?: Partial<RsbuildConfig>;
    }
  > = {},
  configEnvVar = 'NGRS_CONFIG'
): Promise<RsbuildConfig> {
  const configurationMode = process.env[configEnvVar] ?? 'production';
  const isDefault = configurationMode === 'default';
  const isModeConfigured = configurationMode in configurations;

  const mergedBuildOptionsOptions = {
    ...defaultOptions.options,
    ...((!isDefault && isModeConfigured
      ? configurations[configurationMode]?.options
      : {}) ?? {}),
  };

  let mergedRsbuildConfigOverrides =
    defaultOptions.rsbuildConfigOverrides ?? {};
  if (
    !isDefault &&
    isModeConfigured &&
    configurations[configurationMode]?.rsbuildConfigOverrides
  ) {
    mergedRsbuildConfigOverrides = mergeRsbuildConfig(
      mergedRsbuildConfigOverrides,
      configurations[configurationMode]?.rsbuildConfigOverrides ?? {}
    );
  }

  return await _createConfig(
    mergedBuildOptionsOptions,
    mergedRsbuildConfigOverrides
  );
}
