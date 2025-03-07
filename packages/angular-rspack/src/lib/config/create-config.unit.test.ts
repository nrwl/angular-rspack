import { createConfig, withConfigurations } from './create-config';
import { beforeEach, expect } from 'vitest';
import { AngularRspackPluginOptions } from '../models';

describe('createConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', '');
    vi.stubEnv('NGRS_CONFIG', '');
  });

  it.each(['development', 'not-production'])(
    'should create config for mode "development" if env variable NODE_ENV is "%s"',
    (nodeEnv) => {
      // ARRANGE
      vi.stubEnv('NODE_ENV', nodeEnv);

      // ACT
      const config = createConfig({
        root: '',
        browser: './src/main.ts',
        index: './src/index.html',
        tsconfigPath: './tsconfig.app.json',
        inlineStylesExtension: 'css',
        polyfills: [],
        styles: [],
        assets: [],
        fileReplacements: [],
        scripts: [],
        jit: false,
        hasServer: false,
        skipTypeChecking: false,
      });

      // ASSERT
      expect(config[0]).toEqual(
        expect.objectContaining({
          target: 'web',
          mode: 'development',
          output: expect.objectContaining({ path: 'dist/browser' }),
        })
      );
    }
  );

  describe('withConfigurations', () => {
    const runWithConfigurations = () => {
      return withConfigurations(
        {
          options: {
            root: '',
            browser: './src/main.ts',
            index: './src/index.html',
            tsconfigPath: './tsconfig.app.json',
            inlineStylesExtension: 'css',
            polyfills: [],
            styles: [],
            assets: [],
            fileReplacements: [],
            scripts: [],
            jit: false,
            hasServer: false,
            skipTypeChecking: false,
          },
        },
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
    };

    it.each(['development', 'production'])(
      'should create config for mode "development" if env variable NGRS_CONFIG is "%s"',
      (configuration) => {
        // ARRANGE
        vi.stubEnv('NGRS_CONFIG', configuration);

        // ACT
        const config = runWithConfigurations();

        // ASSERT
        const plugins = config[0].plugins;
        const NgRspackPlugin = plugins?.find(
          (plugin) => plugin?.constructor.name === 'NgRspackPlugin'
        );
        expect(NgRspackPlugin).toBeDefined();
        expect(
          // @ts-expect-error - TS cannot index correctly because of multiple potential types
          NgRspackPlugin['pluginOptions'] as AngularRspackPluginOptions
        ).toEqual(
          expect.objectContaining({
            browser:
              configuration === 'development'
                ? './src/dev.main.ts'
                : './src/prod.main.ts',
            skipTypeChecking: configuration === 'development',
          })
        );
      }
    );
  });
});
