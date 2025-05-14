import {
  defineConfig,
  mergeRsbuildConfig,
  type RsbuildConfig,
  RsbuildPlugin,
} from '@rsbuild/core';
import { dirname, resolve } from 'path';
import { PluginAngularOptions } from '../models/plugin-options';
import { normalizeOptions } from '../models/normalize-options';
import { pluginAngular } from '../plugin/plugin-angular';
import { pluginHoistedJsTransformer } from '../plugin/plugin-hoisted-js-transformer';
import { getOutputHashFormat } from './helpers';
import { getProxyConfig } from './dev-server-config-utils';
import { getStylePlugins } from './styles-utils';

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

  const stylePlugins: RsbuildPlugin[] = getStylePlugins(normalizedOptions);

  const { root } = normalizedOptions;
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
              port: normalizedOptions.devServer.port,
              host: 'localhost',
            },
            hmr: false,
            liveReload: true,
          }
        : undefined),
    },
    server: {
      host: 'localhost',
      port: normalizedOptions.devServer.port,
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
        config.resolve.symlinks = normalizedOptions.preserveSymlinks;
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
            ...normalizedOptions.define,
          },
        },
        output: {
          target: 'web',
          filename: {
            js: `[name]${hashFormat.chunk}.js`,
            css: `[name]${hashFormat.file}.css`,
          },
          sourceMap: {
            js: normalizedOptions.sourceMap.scripts ? 'source-map' : false,
            css: normalizedOptions.sourceMap.styles,
          },
          distPath: {
            root: normalizedOptions.outputPath.browser,
            js: '',
            media: normalizedOptions.outputPath.media,
            assets: normalizedOptions.outputPath.media,
          },
          cleanDistPath: normalizedOptions.deleteOutputPath,
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
                  ...normalizedOptions.define,
                },
              },
              output: {
                target: 'node',
                polyfill: 'entry',
                distPath: { root: normalizedOptions.outputPath.server },
                cleanDistPath: normalizedOptions.deleteOutputPath,
                externals: normalizedOptions.externalDependencies,
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
  const modeOverrides = (!isDefault && isModeConfigured && configurations[configurationMode]?.options)
    || {};

  const mergedBuildOptionsOptions = {
    ...defaultOptions.options,
    ...modeOverrides,
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
