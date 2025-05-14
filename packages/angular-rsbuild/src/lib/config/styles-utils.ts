import { RsbuildPlugin } from '@rsbuild/core';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginLess } from '@rsbuild/plugin-less';
import { NormalizedPluginAngularOptions } from '../models/plugin-options';

export function getStylePlugins(
  options: Pick<
    NormalizedPluginAngularOptions,
    'inlineStyleLanguage' | 'stylePreprocessorOptions' | 'sourceMap'
  >
): RsbuildPlugin[] {
  const { inlineStyleLanguage, stylePreprocessorOptions, sourceMap } = options;
  const { includePaths = [], sass } = stylePreprocessorOptions ?? {};

  if (inlineStyleLanguage === undefined || inlineStyleLanguage === 'css') {
    return [];
  }

  if (inlineStyleLanguage === 'scss' || inlineStyleLanguage === 'sass') {
    const defaultSassOptions = {
      sassLoaderOptions: {
        sourceMap: sourceMap.styles,
      },
    };

    const sassOptions = {
      ...(includePaths.length > 0 ? { includePaths } : {}),
      ...(sass ?? {}),
    };

    if (Object.keys(sassOptions).length === 0) {
      return [pluginSass(defaultSassOptions)];
    }

    return [
      pluginSass({
        ...defaultSassOptions,
        sassLoaderOptions: {
          ...defaultSassOptions.sassLoaderOptions,
          sassOptions,
        },
      }),
    ];
  }

  const defaultLessOptions = {
    lessLoaderOptions: {
      sourceMap: sourceMap.styles,
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  };

  if (includePaths.length === 0) {
    return [pluginLess(defaultLessOptions)];
  }

  return [
    pluginLess({
      ...defaultLessOptions,
      lessLoaderOptions: {
        ...defaultLessOptions.lessLoaderOptions,
        lessOptions: {
          ...defaultLessOptions.lessLoaderOptions.lessOptions,
          paths: includePaths,
        },
      },
    }),
  ];
}
