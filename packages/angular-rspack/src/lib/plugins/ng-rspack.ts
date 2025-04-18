import {
  Compiler,
  CopyRspackPlugin,
  DefinePlugin,
  EntryPlugin,
  HtmlRspackPlugin,
  ProgressPlugin,
  RspackPluginInstance,
} from '@rspack/core';
import { posix, relative, resolve } from 'node:path';
import { RxjsEsmResolutionPlugin } from './rxjs-esm-resolution';
import { AngularRspackPlugin } from './angular-rspack-plugin';
import { I18nInlinePlugin } from './i18n-inline-plugin';
import {
  I18nOptions,
  NormalizedAngularRspackPluginOptions,
  OutputPath,
} from '../models';
import { AngularSsrDevServer } from './angular-ssr-dev-server';

export class NgRspackPlugin implements RspackPluginInstance {
  pluginOptions: NormalizedAngularRspackPluginOptions;
  i18n: I18nOptions | undefined;

  constructor(
    options: NormalizedAngularRspackPluginOptions,
    i18nOptions?: I18nOptions
  ) {
    this.pluginOptions = options;
    this.i18n = i18nOptions;
  }

  apply(compiler: Compiler) {
    const root = this.pluginOptions.root;
    const isProduction = process.env['NODE_ENV'] === 'production';
    const isDevServer = process.env['WEBPACK_SERVE'];

    const polyfills = this.pluginOptions.polyfills ?? [];
    if (polyfills.length > 0) {
      compiler.hooks.entryOption.tap('NgRspackPlugin', (context, entry) => {
        const keys = Object.keys(entry);
        for (const key of keys) {
          if (key === 'styles') {
            continue;
          }
          const entryValue = entry[key];
          entryValue.import = [...polyfills, ...entryValue.import];
        }
      });
    }
    if (!this.pluginOptions.hasServer) {
      const scripts = this.pluginOptions.globalScripts ?? [];
      for (const script of scripts) {
        for (const file of script.files) {
          new EntryPlugin(compiler.context, file, {
            name: isProduction ? script.name : undefined,
          }).apply(compiler);
        }
      }
      if (this.pluginOptions.index) {
        new HtmlRspackPlugin({
          minify: false,
          inject: 'body',
          scriptLoading: 'module',
          template: this.pluginOptions.index.input,
        }).apply(compiler);
      }
      if (
        this.pluginOptions.ssr &&
        typeof this.pluginOptions.ssr === 'object' &&
        this.pluginOptions.ssr.entry !== undefined
      ) {
        new AngularSsrDevServer(
          this.pluginOptions.outputPath as OutputPath
        ).apply(compiler);
      }
    }
    if (!isDevServer) {
      new ProgressPlugin().apply(compiler);
    }
    new DefinePlugin({
      ngDevMode: isProduction ? 'false' : {},
      ngJitMode: this.pluginOptions.aot ? undefined : 'true',
      ngServerMode: this.pluginOptions.hasServer,
      ...(this.pluginOptions.define ?? {}),
    }).apply(compiler);
    if (this.pluginOptions.assets) {
      new CopyRspackPlugin({
        patterns: (this.pluginOptions.assets ?? []).map((asset) => {
          let { input, output = '' } = asset;
          input = resolve(root, input).replace(/\\/g, '/');
          input = input.endsWith('/') ? input : input + '/';
          output = output.endsWith('/') ? output : output + '/';

          if (output.startsWith('..')) {
            throw new Error(
              'An asset cannot be written to a location outside of the output path.'
            );
          }

          return {
            context: input,
            to: output.replace(/^\//, ''),
            from: asset.glob,
            noErrorOnMissing: true,
            force: true,
            globOptions: {
              dot: true,
              ignore: [
                '.gitkeep',
                '**/.DS_Store',
                '**/Thumbs.db',
                ...(asset.ignore ?? []),
              ],
            },
          };
        }),
      }).apply(compiler);
    }
    if (this.pluginOptions.extractLicenses) {
      const { LicenseWebpackPlugin } = require('license-webpack-plugin');
      new LicenseWebpackPlugin({
        stats: {
          warnings: false,
          errors: false,
        },
        perChunkOutput: false,
        outputFilename: posix.join(
          relative(
            this.pluginOptions.outputPath.browser,
            this.pluginOptions.outputPath.base
          ),
          '3rdpartylicenses.txt'
        ),
        skipChildCompilers: true,
      }).apply(compiler as any);
    }
    if (this.i18n?.shouldInline) {
      new I18nInlinePlugin(this.pluginOptions, this.i18n).apply(compiler);
    }
    new RxjsEsmResolutionPlugin().apply(compiler);
    new AngularRspackPlugin(this.pluginOptions, this.i18n).apply(compiler);
  }
}
