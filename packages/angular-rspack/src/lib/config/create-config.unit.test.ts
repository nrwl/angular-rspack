import { _createConfig, createConfig } from './create-config';
import { beforeEach, expect } from 'vitest';
import { AngularRspackPluginOptions } from '../models';
import { NgRspackPlugin } from '../plugins/ng-rspack';

describe('_createConfig', () => {
  const configBase: AngularRspackPluginOptions = {
    root: '',
    browser: './src/main.ts',
    index: './src/index.html',
    tsConfig: './tsconfig.base.json',
    inlineStyleLanguage: 'css',
    polyfills: [],
    styles: [],
    assets: [],
    fileReplacements: [],
    scripts: [],
    aot: true,
    hasServer: false,
    skipTypeChecking: false,
  };

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', '');
    vi.stubEnv('NGRS_CONFIG', '');
  });

  it('should create config for mode "production" if env variable NODE_ENV is "production"', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(_createConfig(configBase)).toStrictEqual([
      expect.objectContaining({ mode: 'production' }),
    ]);
  });

  it.each(['development', 'not-production'])(
    'should create config for mode "development" if env variable NODE_ENV is "%s"',
    (nodeEnv) => {
      vi.stubEnv('NODE_ENV', nodeEnv);

      expect(_createConfig(configBase)).toStrictEqual([
        expect.objectContaining({ mode: 'development' }),
      ]);
    }
  );
});

describe('createConfig', () => {
  const configBase: AngularRspackPluginOptions = {
    root: '',
    browser: './src/main.ts',
    index: './src/index.html',
    tsConfig: './tsconfig.base.json',
    inlineStyleLanguage: 'css',
    polyfills: [],
    styles: [],
    assets: [],
    fileReplacements: [],
    scripts: [],
    aot: true,
    hasServer: false,
    skipTypeChecking: false,
  };

  it('should create config from options', () => {
    expect(createConfig({ options: configBase })).toStrictEqual([
      expect.objectContaining({
        mode: 'development',
        devServer: expect.objectContaining({
          port: 4200,
        }),
        plugins: [
          {
            pluginOptions: {
              ...configBase,
              useTsProjectReferences: false,
              polyfills: ['zone.js'],
              devServer: {
                port: 4200,
              },
            },
          },
        ],
      }),
    ]);
  });

  it('should allow changing the devServer port', () => {
    expect(
      createConfig({
        options: {
          ...configBase,
          devServer: {
            port: 8080,
          },
        },
      })
    ).toStrictEqual([
      expect.objectContaining({
        devServer: expect.objectContaining({
          port: 8080,
        }),
      }),
    ]);
  });

  it.each([
    ['development', 'dev', true],
    ['production', 'prod', false],
  ])(
    'should create config for mode "development" if env variable NGRS_CONFIG is "%s"',
    (configuration, fileNameSegment, skipTypeChecking) => {
      vi.stubEnv('NGRS_CONFIG', configuration);

      const c = createConfig(
        { options: configBase },
        {
          development: {
            options: {
              browser: './src/dev.main.ts',
              skipTypeChecking: true,
            },
          },
          production: {
            options: {
              browser: './src/prod.main.ts',
              skipTypeChecking: false,
            },
          },
        }
      );
      expect(c).toStrictEqual([
        expect.objectContaining({
          plugins: [expect.any(NgRspackPlugin)],
        }),
      ]);

      const ngRspackPlugin = c[0].plugins?.[0] as NgRspackPlugin;
      expect(ngRspackPlugin.pluginOptions).toStrictEqual(
        expect.objectContaining({
          browser: `./src/${fileNameSegment}.main.ts`,
          skipTypeChecking,
        })
      );
    }
  );
});
