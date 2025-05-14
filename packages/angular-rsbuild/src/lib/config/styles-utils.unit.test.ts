import { beforeEach, describe, expect } from 'vitest';
import { getStylePlugins } from './styles-utils.ts';
import { type NormalizedPluginAngularOptions } from '../models/plugin-options.ts';
import { type StylePreprocessorOptions } from '@angular-devkit/build-angular';
import * as pluginSassModule from '@rsbuild/plugin-sass';
import * as pluginLessModule from '@rsbuild/plugin-less';
import { Sass } from '@nx/angular-rspack-compiler';

vi.mock('@rsbuild/plugin-sass', () => {
  return {
    pluginSass: vi.fn(() => ({
      name: 'mock-rsbuild:sass',
      setup: vi.fn(),
    })),
  };
});

vi.mock('@rsbuild/plugin-less', () => {
  return {
    pluginLess: vi.fn(() => ({
      name: 'mock-rsbuild:less',
      setup: vi.fn(),
    })),
  };
});

describe('getStylePlugins', () => {
  const pluginSassSpy = vi.spyOn(pluginSassModule, 'pluginSass');
  const pluginLessSpy = vi.spyOn(pluginLessModule, 'pluginLess');

  beforeEach(() => {
    pluginSassSpy.mockClear();
    pluginLessSpy.mockClear();
  });

  afterAll(() => {
    pluginSassSpy.mockReset();
    pluginLessSpy.mockReset();
  });

  it('should return an empty array if no configuration is passed', () => {
    expect(getStylePlugins({} as NormalizedPluginAngularOptions)).toStrictEqual(
      []
    );
  });

  it.each(['sass', 'scss'])(
    'should have default sass plugin if inlineStyleLanguage is %s',
    (language) => {
      expect(
        getStylePlugins({
          inlineStyleLanguage: language,
          sourceMap: { styles: true },
        } as NormalizedPluginAngularOptions)
      ).toStrictEqual([expect.objectContaining({ name: 'mock-rsbuild:sass' })]);

      expect(pluginSassSpy).toHaveBeenCalledTimes(1);
      expect(pluginSassSpy).toHaveBeenCalledWith({
        sassLoaderOptions: {
          sourceMap: true,
        },
      });
    }
  );

  it.each(['sass', 'scss'])(
    'should have default sass plugin if inlineStyleLanguage is %s and includePaths is empty array',
    (language) => {
      expect(
        getStylePlugins({
          inlineStyleLanguage: language,
          sourceMap: { styles: true },
          stylePreprocessorOptions: {
            includePaths: [],
          } as StylePreprocessorOptions,
        } as NormalizedPluginAngularOptions)
      ).toStrictEqual([expect.objectContaining({ name: 'mock-rsbuild:sass' })]);

      expect(pluginSassSpy).toHaveBeenCalledTimes(1);
      expect(pluginSassSpy).toHaveBeenCalledWith({
        sassLoaderOptions: {
          sourceMap: true,
        },
      });
    }
  );

  it.each(['sass', 'scss'])(
    'should have sass plugin if inlineStyleLanguage is %s and includePaths is given',
    (language) => {
      const includePaths = ['path/to/include1', 'path/to/include2'];
      expect(
        getStylePlugins({
          inlineStyleLanguage: language,
          sourceMap: { styles: true },
          stylePreprocessorOptions: {
            includePaths,
          } as StylePreprocessorOptions,
        } as NormalizedPluginAngularOptions)
      ).toStrictEqual([expect.objectContaining({ name: 'mock-rsbuild:sass' })]);

      expect(pluginSassSpy).toHaveBeenCalledTimes(1);
      expect(pluginSassSpy).toHaveBeenCalledWith({
        sassLoaderOptions: {
          sourceMap: true,
          sassOptions: {
            includePaths,
          },
        },
      });
    }
  );

  it.each(['sass', 'scss'])(
    'should have default sass plugin if inlineStyleLanguage is %s and sass options is an empty object',
    (language) => {
      expect(
        getStylePlugins({
          inlineStyleLanguage: language,
          sourceMap: { styles: true },
          stylePreprocessorOptions: {
            sass: {},
          } as StylePreprocessorOptions,
        } as NormalizedPluginAngularOptions)
      ).toStrictEqual([expect.objectContaining({ name: 'mock-rsbuild:sass' })]);

      expect(pluginSassSpy).toHaveBeenCalledTimes(1);
      expect(pluginSassSpy).toHaveBeenCalledWith({
        sassLoaderOptions: {
          sourceMap: true,
        },
      });
    }
  );

  it.each(['sass', 'scss'])(
    'should have sass plugin if inlineStyleLanguage is %s and sass options is given',
    (language) => {
      const sass: Sass = {
        futureDeprecations: ['fs-importer-cwd'],
        fatalDeprecations: [],
        silenceDeprecations: [],
      };
      expect(
        getStylePlugins({
          inlineStyleLanguage: language,
          sourceMap: { styles: true },
          stylePreprocessorOptions: {
            sass,
          } as StylePreprocessorOptions,
        } as NormalizedPluginAngularOptions)
      ).toStrictEqual([expect.objectContaining({ name: 'mock-rsbuild:sass' })]);

      expect(pluginSassSpy).toHaveBeenCalledTimes(1);
      expect(pluginSassSpy).toHaveBeenCalledWith({
        sassLoaderOptions: {
          sourceMap: true,
          sassOptions: sass,
        },
      });
    }
  );

  it('should have default less plugin if inlineStyleLanguage is less', () => {
    expect(
      getStylePlugins({
        inlineStyleLanguage: 'less',
        sourceMap: { styles: true },
      } as NormalizedPluginAngularOptions)
    ).toStrictEqual([expect.objectContaining({ name: 'mock-rsbuild:less' })]);

    expect(pluginLessSpy).toHaveBeenCalledTimes(1);
    expect(pluginLessSpy).toHaveBeenCalledWith({
      lessLoaderOptions: {
        sourceMap: true,
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    });
  });

  it('should have less plugin if inlineStyleLanguage is less and includePaths is given', () => {
    const includePaths = ['path/to/include1', 'path/to/include2'];
    expect(
      getStylePlugins({
        inlineStyleLanguage: 'less',
        sourceMap: { styles: true },
        stylePreprocessorOptions: {
          includePaths,
        } as StylePreprocessorOptions,
      } as NormalizedPluginAngularOptions)
    ).toStrictEqual([expect.objectContaining({ name: 'mock-rsbuild:less' })]);

    expect(pluginLessSpy).toHaveBeenCalledTimes(1);
    expect(pluginLessSpy).toHaveBeenCalledWith({
      lessLoaderOptions: {
        sourceMap: true,
        lessOptions: {
          javascriptEnabled: true,
          paths: includePaths,
        },
      },
    });
  });
});
