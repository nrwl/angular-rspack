import type {
  FileReplacement,
  InlineStyleLanguage,
  StylePreprocessorOptions,
} from '@nx/angular-rspack-compiler';

export interface DevServerOptions {
  port?: number;
  ssl?: boolean;
  sslKey?: string;
  sslCert?: string;
  proxyConfig?: string;
}

export interface OptimizationOptions {
  scripts?: boolean;
  styles?: boolean;
  fonts?: boolean;
}

export type OutputHashing = 'none' | 'all' | 'media' | 'bundles';
export type HashFormat = {
  chunk: string;
  extract: string;
  file: string;
  script: string;
};

export interface OutputPath {
  base: string;
  browser: string;
  server: string;
  media: string;
}

export interface SourceMap {
  scripts: boolean;
  styles: boolean;
  hidden: boolean;
  vendor: boolean;
}

export interface PluginAngularOptions {
  index: string;
  browser: string;
  /**
   * Defines global identifiers that will be replaced with a specified constant value when found in any JavaScript or TypeScript code including libraries.
   * The value will be used directly.
   * String values must be put in quotes.
   */
  define?: Record<string, string>;
  /**
   * Delete the output path before building.
   */
  deleteOutputPath?: boolean;
  /**
   * Exclude the listed external dependencies from being bundled into the bundle. Instead, the created bundle relies on these dependencies to be available during runtime.
   */
  externalDependencies?: string[];
  server?: string;
  ssr?:
    | boolean
    | {
        entry: string;
        experimentalPlatform?: 'node' | 'neutral';
      };
  polyfills: string[];
  preserveSymlinks?: boolean;
  assets: string[];
  styles: string[];
  scripts: string[];
  outputPath: string | OutputPath;
  fileReplacements: FileReplacement[];
  aot: boolean;
  inlineStyleLanguage: InlineStyleLanguage;
  tsConfig: string;
  sourceMap?: boolean | Partial<SourceMap>;
  optimization?: boolean | OptimizationOptions;
  outputHashing?: OutputHashing;
  hasServer: boolean;
  skipTypeChecking: boolean;
  useTsProjectReferences?: boolean;
  namedChunks?: boolean;
  commonChunk?: boolean;
  vendorChunk?: boolean;
  stylePreprocessorOptions?: StylePreprocessorOptions;
  devServer?: DevServerOptions;
  root?: string;
}

export interface NormalizedPluginAngularOptions extends PluginAngularOptions {
  advancedOptimizations: boolean;
  devServer: Omit<DevServerOptions, 'port'> &
    Required<Pick<DevServerOptions, 'port'>>;
  externalDependencies: string[];
  optimization: boolean | OptimizationOptions;
  outputHashing: OutputHashing;
  outputPath: OutputPath;
  root: string;
  sourceMap: SourceMap;
}
