import { createConfig } from './create-config';
import { beforeAll, beforeEach, expect } from 'vitest';
import * as normalizeModule from '../models/normalize-options.ts';
import { DEFAULT_PLUGIN_ANGULAR_OPTIONS } from '../models/normalize-options.ts';
import * as rsbuildCoreModule from '@rsbuild/core';
import type { NormalizedPluginAngularOptions } from '../models/plugin-options.ts';

vi.mock('@rsbuild/core');

describe('createConfig', () => {
  const argvSpy = vi.spyOn(process, 'argv', 'get');
  const normalizeOptionsSpy = vi.spyOn(normalizeModule, 'normalizeOptions');
  const defineConfigSpy = vi.spyOn(rsbuildCoreModule, 'defineConfig');
  const defaultNormalizedOptions: NormalizedPluginAngularOptions = {
    ...DEFAULT_PLUGIN_ANGULAR_OPTIONS,
    advancedOptimizations: true,
    devServer: { port: 4200 },
    optimization: true,
    outputHashing: 'all',
  };

  beforeAll(() => {
    argvSpy.mockReturnValue([]);
    normalizeOptionsSpy.mockReturnValue(defaultNormalizedOptions);
    defineConfigSpy.mockReturnValue({});
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', '');
  });

  it.each(['development', 'not-production'])(
    'should create config for mode "development" if env variable NODE_ENV is "%s"',
    async (nodeEnv) => {
      vi.stubEnv('NODE_ENV', nodeEnv);

      await expect(createConfig({ options: {} })).resolves.not.toThrow();

      expect(defineConfigSpy).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'development' })
      );
    }
  );

  it('should create config for mode "production" if env variable NODE_ENV is "production"', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    await expect(createConfig({ options: {} })).resolves.not.toThrow();

    expect(defineConfigSpy).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'production' })
    );
  });

  it('should have dev property defined if the process started with "dev" argument and a server is configured', async () => {
    argvSpy.mockReturnValue(['irrelevant', 'irrelevant', 'dev']);
    normalizeOptionsSpy.mockReturnValue({
      ...defaultNormalizedOptions,
      ssr: { entry: 'main.ts' },
      hasServer: true,
    });

    await expect(createConfig({ options: {} })).resolves.not.toThrow();

    expect(defineConfigSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        dev: {
          client: {
            host: 'localhost',
            port: 4200,
          },
          hmr: false,
          liveReload: true,
          writeToDisk: expect.any(Function),
        },
      })
    );
  });

  it('should create config without dev property configured if not running dev server', async () => {
    argvSpy.mockReturnValue([]);

    await expect(createConfig({ options: {} })).resolves.not.toThrow();

    expect(defineConfigSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        dev: {},
      })
    );
  });

  it('should used definedConfig for both passed objects', async () => {
    defineConfigSpy.mockImplementation((config) => config);
    normalizeOptionsSpy.mockImplementation(
      (options) => options as NormalizedPluginAngularOptions
    );

    await expect(
      createConfig({
        options: {
          polyfills: [],
          styles: [],
          assets: [],
          outputPath: {
            base: 'dist',
            browser: 'dist/browser',
            server: 'dist/server',
            media: 'dist/browser/media',
          },
          sourceMap: {
            scripts: true,
            styles: true,
            hidden: false,
            vendor: false,
          },
        },
        rsbuildConfigOverrides: {
          source: {
            tsconfigPath: 'tsconfig.random.json',
          },
        },
      })
    ).resolves.not.toThrow();
    expect(defineConfigSpy).toHaveBeenCalledTimes(2);
    expect(defineConfigSpy).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        source: {
          tsconfigPath: 'tsconfig.random.json',
        },
      })
    );
  });

  it('should allow changing the devServer port', async () => {
    defineConfigSpy.mockImplementation((config) => config);
    normalizeOptionsSpy.mockImplementation(
      (options) => options as NormalizedPluginAngularOptions
    );

    await expect(
      createConfig({
        options: {
          polyfills: [],
          styles: [],
          assets: [],
          outputPath: {
            base: 'dist',
            browser: 'dist/browser',
            server: 'dist/server',
            media: 'dist/browser/media',
          },
          sourceMap: {
            scripts: true,
            styles: true,
            hidden: false,
            vendor: false,
          },
          devServer: {
            port: 8080,
          },
        },
      })
    ).resolves.not.toThrow();
    expect(defineConfigSpy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        server: expect.objectContaining({ port: 8080 }),
      })
    );
  });
});
