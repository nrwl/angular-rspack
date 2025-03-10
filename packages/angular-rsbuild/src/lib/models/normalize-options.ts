import { FileReplacement } from '@nx/angular-rspack-compiler';
import { PluginAngularOptions } from './plugin-options';
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
  ssrEntry,
  root,
}: Pick<PluginAngularOptions, 'server' | 'ssrEntry' | 'root'>): boolean {
  return !!(
    server &&
    ssrEntry &&
    existsSync(join(root, server)) &&
    existsSync(join(root, ssrEntry))
  );
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
  ssrEntry: undefined,
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
  useTsProjectReferences: false,
  skipTypeChecking: false,
  devServer: {
    port: 4200,
  },
};

export function normalizeOptions(
  options: Partial<PluginAngularOptions> = {}
): PluginAngularOptions {
  const {
    root = DEFAULT_PLUGIN_ANGULAR_OPTIONS.root,
    fileReplacements = [],
    server,
    ssrEntry,
    optimization,
    ...restOptions
  } = options;

  validateOptimization(optimization);
  const normalizedOptimization = optimization !== false; // @TODO: Add support for optimization options

  return {
    ...DEFAULT_PLUGIN_ANGULAR_OPTIONS,
    ...restOptions,
    ...(root != null ? { root } : {}),
    ...(server != null ? { server } : {}),
    ...(ssrEntry != null ? { ssrEntry } : {}),
    optimization: normalizedOptimization,
    fileReplacements: resolveFileReplacements(fileReplacements, root),
    hasServer: getHasServer({ server, ssrEntry, root }),
  };
}
