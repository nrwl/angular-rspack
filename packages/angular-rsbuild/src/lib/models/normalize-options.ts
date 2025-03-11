import { FileReplacement } from '@nx/angular-rspack-compiler';
import {
  PluginAngularOptions,
  type DevServerOptions,
  OutputPath,
  NormalizedPluginAngularOptions,
} from './plugin-options';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

/**
 * Resolves file replacement paths to absolute paths based on the provided root directory.
 *
 * @param fileReplacements - Array of file replacements with relative paths.
 * @param root - The root directory to resolve the paths against.
 * @returns Array of file replacements resolved against the root.
 */
export function resolveFileReplacements(
  fileReplacements: FileReplacement[],
  root: string
): FileReplacement[] {
  return fileReplacements.map((fileReplacement) => ({
    replace: resolve(root, fileReplacement.replace),
    with: resolve(root, fileReplacement.with),
  }));
}

export function getHasServer({
  server,
  ssr,
}: Pick<PluginAngularOptions, 'server' | 'ssr'>): boolean {
  const root = process.cwd();
  return !!(
    server &&
    ssr &&
    (ssr as { entry: string }).entry &&
    existsSync(join(root, server)) &&
    existsSync(join(root, (ssr as { entry: string }).entry))
  );
}

export function validateSsr(ssr: PluginAngularOptions['ssr']) {
  if (!ssr) {
    return;
  }
  if (ssr === true) {
    throw new Error(
      'The "ssr" option should be an object or false. Please check the documentation.'
    );
  }
  if (typeof ssr === 'object')
    if (!ssr.entry) {
      throw new Error(
        'The "ssr" option should have an "entry" property. Please check the documentation.'
      );
    } else if (ssr.experimentalPlatform === 'neutral') {
      console.warn(
        'The "ssr.experimentalPlatform" option is not currently supported. Node will be used as the platform.'
      );
    }
}

export function validateOptimization(
  optimization: PluginAngularOptions['optimization']
) {
  if (typeof optimization === 'boolean' || optimization === undefined) {
    return;
  }
  if (typeof optimization === 'object')
    console.warn(
      'The "optimization" option currently only supports a boolean value. Please check the documentation.'
    );
}

function validateChunkOptions(options: Partial<PluginAngularOptions>) {
  if (options.namedChunks !== undefined) {
    console.warn(`The "namedChunks" option is not supported with Rsbuild.`);
  }
  if (options.commonChunk !== undefined) {
    console.warn(`The "commonChunk" option is not supported with Rsbuild.`);
  }
  if (options.vendorChunk !== undefined) {
    console.warn(`The "vendorChunk" option is not supported with Rsbuild.`);
  }
}

export const DEFAULT_PLUGIN_ANGULAR_OPTIONS: PluginAngularOptions = {
  index: './src/index.html',
  browser: './src/main.ts',
  server: undefined,
  ssr: undefined,
  fileReplacements: [],
  hasServer: false,
  polyfills: [],
  assets: ['./public'],
  styles: ['./src/styles.css'],
  scripts: [],
  aot: true,
  inlineStyleLanguage: 'css',
  tsConfig: join(process.cwd(), 'tsconfig.app.json'),
  optimization: true,
  outputPath: normalizeOutputPath(process.cwd(), undefined),
  outputHashing: 'all',
  useTsProjectReferences: false,
  namedChunks: false,
  skipTypeChecking: false,
  devServer: {
    port: 4200,
  },
};

export function normalizeOptions(
  options: Partial<PluginAngularOptions> = {}
): NormalizedPluginAngularOptions {
  const root = process.cwd();
  const {
    fileReplacements = [],
    server,
    ssr,
    optimization,
    devServer,
    ...restOptions
  } = options;

  validateSsr(ssr);

  const normalizedSsr = !ssr
    ? false
    : typeof ssr === 'object'
    ? {
        entry: ssr.entry,
        experimentalPlatform: 'node' as const, // @TODO: Add support for neutral platform
      }
    : ssr;

  validateOptimization(optimization);
  const normalizedOptimization = optimization !== false; // @TODO: Add support for optimization options
  const aot = options.aot ?? true;
  const advancedOptimizations = aot && normalizedOptimization;

  validateChunkOptions(options);

  return {
    ...DEFAULT_PLUGIN_ANGULAR_OPTIONS,
    ...restOptions,
    ...(server != null ? { server } : {}),
    ...(ssr != null ? { ssr: normalizedSsr } : {}),
    optimization: normalizedOptimization,
    outputPath: normalizeOutputPath(root, options.outputPath),
    advancedOptimizations,
    aot,
    outputHashing: options.outputHashing ?? 'all',
    namedChunks: options.namedChunks ?? false,
    fileReplacements: resolveFileReplacements(fileReplacements, root),
    hasServer: getHasServer({ server, ssr: normalizedSsr }),
    devServer: normalizeDevServer(devServer),
  };
}

function normalizeDevServer(
  devServer: DevServerOptions | undefined
): DevServerOptions & { port: number } {
  const defaultPort = 4200;

  if (!devServer) {
    return { port: defaultPort };
  }

  return {
    ...devServer,
    port: devServer.port ?? defaultPort,
  };
}

/**
 * This is slightly different to the Rspack solution as Rsbuild will use only relative paths
 * from the base directory provided as the outputPath.
 */
export function normalizeOutputPath(
  root: string,
  outputPath: string | OutputPath | undefined
): OutputPath {
  const defaultBase = join(root, 'dist');
  const defaultBrowser = join(defaultBase, 'browser');
  if (!outputPath) {
    return {
      base: defaultBase,
      browser: defaultBrowser,
      server: join(defaultBase, 'server'),
      media: 'media',
    };
  }

  if (typeof outputPath === 'string') {
    if (!outputPath.startsWith(root)) {
      outputPath = join(root, outputPath);
    }
    return {
      base: outputPath,
      browser: join(outputPath, 'browser'),
      server: join(outputPath, 'server'),
      media: 'media',
    };
  }
  const providedBase = outputPath.base ?? defaultBase;
  const providedBrowser = outputPath.browser ?? join(providedBase, 'browser');
  return {
    base: providedBase,
    browser: providedBrowser,
    server: outputPath.server ?? join(outputPath.base ?? defaultBase, 'server'),
    media: outputPath.media ?? 'media',
  };
}
