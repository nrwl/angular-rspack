import { logger, RsbuildPlugin } from '@rsbuild/core';
import {
  buildAndAnalyzeWithParallelCompilation,
  JavaScriptTransformer,
  DiagnosticModes,
  JS_ALL_EXT_REGEX,
  maxWorkers,
  setupCompilationWithParallelCompilation,
  PartialMessage,
} from '@nx/angular-rspack-compiler';
import type { NormalizedPluginAngularOptions } from '../models/plugin-options';

export const pluginHoistedJsTransformer = (
  options: NormalizedPluginAngularOptions
): RsbuildPlugin => ({
  name: 'plugin-hoisted-js-transformer',
  post: ['plugin-angular'],
  setup(api) {
    const config = api.getRsbuildConfig();
    const typescriptFileCache = new Map<string, string | Uint8Array>();
    let watchMode = false;
    let isServer = options.hasServer;
    const typeCheckResults: {
      errors: PartialMessage[] | undefined;
      warnings: PartialMessage[] | undefined;
    } = { errors: undefined, warnings: undefined };
    const javascriptTransformer = new JavaScriptTransformer(
      {
        /**
         * Matches https://github.com/angular/angular-cli/blob/33ed6e875e509ebbaa0cbdb57be9e932f9915dff/packages/angular/build/src/tools/esbuild/angular/compiler-plugin.ts#L89
         * where pluginOptions.sourcemap is set https://github.com/angular/angular-cli/blob/61d98fde122468978de9b17bd79761befdbf2fac/packages/angular/build/src/tools/esbuild/compiler-plugin-options.ts#L34
         */
        sourcemap: !!(
          options.sourceMap.scripts &&
          (options.sourceMap.hidden ? 'external' : true)
        ),
        thirdPartySourcemaps: options.sourceMap.vendor,
        // @TODO: it should be `pluginOptions.advancedOptimizations` but it currently fails the build
        advancedOptimizations: false,
        jit: !options.aot,
      },
      maxWorkers()
    );
    api.onBeforeStartDevServer(() => {
      watchMode = true;
    });

    api.modifyRspackConfig((config, { environment }) => {
      isServer = isServer && environment.name === 'server';
      return config;
    });

    api.onBeforeEnvironmentCompile(async () => {
      const parallelCompilation = await setupCompilationWithParallelCompilation(
        config,
        {
          ...options,
          root: options.root,
        }
      );
      await buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      );
      if (!options.skipTypeChecking) {
        const { errors, warnings } = await parallelCompilation.diagnoseFiles(
          DiagnosticModes.All
        );
        typeCheckResults.errors = errors;
        typeCheckResults.warnings = warnings;
      }
      await parallelCompilation.close();
    });

    api.onAfterBuild(() => {
      if (typeCheckResults.errors || typeCheckResults.warnings) {
        for (const error of typeCheckResults.errors ?? []) {
          logger.error(formatDiagnostics(error, true));
        }
        for (const warning of typeCheckResults.warnings ?? []) {
          logger.warn(formatDiagnostics(warning));
        }
        if (typeCheckResults.errors?.length) {
          throw new Error('Type checking failed.');
        }
      }
    });

    api.transform({ test: JS_ALL_EXT_REGEX }, ({ code, resource }) => {
      if (!code.includes('@angular')) {
        return code;
      }
      const existingTransform = typescriptFileCache.get(resource);
      if (existingTransform) {
        if (typeof existingTransform === 'string') {
          return existingTransform;
        } else {
          return Buffer.from(existingTransform).toString();
        }
      }
      return javascriptTransformer
        .transformData(resource, code, false, false)
        .then((contents: Uint8Array) => {
          const transformedCode = Buffer.from(contents).toString('utf8');
          typescriptFileCache.set(resource, transformedCode);
          return transformedCode;
        });
    });

    api.expose('plugin-hoisted-js-transformer', {
      typescriptFileCache,
    });
  },
});

function formatDiagnostics(message: PartialMessage, isError = false) {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const cyan = '\x1b[36m';
  const yellow = '\x1b[33m';
  const red = '\x1b[31m';

  const lineWidth = 70; // Adjust width to fit your needs
  const topBorder = '─'.repeat(lineWidth);
  const borderColor = isError ? red : yellow;

  return `
${bold}${borderColor}${topBorder}${reset}
${reset}${cyan}${message.location?.file}:${message.location?.line}:${message.location?.column}${reset}

${reset}${bold}${borderColor}${message.text}${reset}
`;
}
