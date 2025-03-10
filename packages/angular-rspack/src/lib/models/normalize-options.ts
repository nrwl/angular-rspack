import { FileReplacement } from '@nx/angular-rspack-compiler';
import { AngularRspackPluginOptions } from './angular-rspack-plugin-options';
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

export type HasServerOptions = Pick<
  AngularRspackPluginOptions,
  'server' | 'ssrEntry' | 'root'
>;

export function getHasServer({
  server,
  ssrEntry,
  root,
}: HasServerOptions): boolean {
  return !!(
    server &&
    ssrEntry &&
    existsSync(join(root, server)) &&
    existsSync(join(root, ssrEntry))
  );
}

export const DEFAULT_NORMALIZED_OPTIONS: Omit<
  AngularRspackPluginOptions,
  'root' | 'tsConfig' | 'fileReplacements' | 'ssrEntry' | 'server' | 'hasServer'
> = {
  index: './src/index.html',
  browser: './src/main.ts',
  polyfills: [],
  assets: ['./public'],
  styles: ['./src/styles.css'],
  scripts: [],
  aot: true,
  inlineStyleLanguage: 'css',
  skipTypeChecking: false,
  useTsProjectReferences: false,
} as const;

export function normalizeOptions(
  options: Partial<AngularRspackPluginOptions> = {}
): AngularRspackPluginOptions {
  const {
    root = process.cwd(),
    fileReplacements = [],
    server,
    ssrEntry,
    devServer,
    ...restOptions
  } = options;

  return {
    ...DEFAULT_NORMALIZED_OPTIONS,
    ...restOptions,
    root,
    tsConfig: options.tsConfig ?? join(root, 'tsconfig.app.json'),
    fileReplacements: resolveFileReplacements(fileReplacements, root),
    ...normalizeOptionsServerOptions({ server, ssrEntry, root }),
    devServer: devServer
      ? {
          ...devServer,
          port: devServer.port ?? 4200,
        }
      : {
          port: 4200,
        },
  };
}

export function normalizeOptionsServerOptions({
  server,
  ssrEntry,
  root,
}: Pick<AngularRspackPluginOptions, 'root' | 'server' | 'ssrEntry'>) {
  if (!getHasServer({ server, ssrEntry, root })) {
    return { hasServer: false };
  }

  return {
    hasServer: true,
    server,
    ssrEntry,
  };
}
