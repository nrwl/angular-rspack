import { FileReplacement } from '@nx/angular-rspack-compiler';
import type {
  PluginAngularOptions,
  DevServerOptions,
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
  root,
}: Pick<PluginAngularOptions, 'server' | 'ssr' | 'root'>): boolean {
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

export const DEFAULT_PLUGIN_ANGULAR_OPTIONS: PluginAngularOptions = {
  root: process.cwd(),
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
  outputHashing: 'all',
  useTsProjectReferences: false,
  skipTypeChecking: false,
  devServer: {
    port: 4200,
  },
};

export function normalizeOptions(
  options: Partial<PluginAngularOptions> = {}
): NormalizedPluginAngularOptions {
  const {
    root = DEFAULT_PLUGIN_ANGULAR_OPTIONS.root,
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

  return {
    ...DEFAULT_PLUGIN_ANGULAR_OPTIONS,
    ...restOptions,
    ...(root != null ? { root } : {}),
    ...(server != null ? { server } : {}),
    ...(ssr != null ? { ssr: normalizedSsr } : {}),
    optimization: normalizedOptimization,
    advancedOptimizations,
    aot,
    outputHashing: options.outputHashing ?? 'all',
    fileReplacements: resolveFileReplacements(fileReplacements, root),
    hasServer: getHasServer({ server, ssr: normalizedSsr, root }),
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
