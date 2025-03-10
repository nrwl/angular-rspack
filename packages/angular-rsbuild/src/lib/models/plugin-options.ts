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

export interface PluginAngularOptions {
  root: string;
  index: string;
  browser: string;
  server?: string;
  ssr?:
    | boolean
    | {
        entry: string;
        experimentalPlatform?: 'node' | 'neutral';
      };
  polyfills: string[];
  assets: string[];
  styles: string[];
  scripts: string[];
  fileReplacements: FileReplacement[];
  aot: boolean;
  inlineStyleLanguage: InlineStyleLanguage;
  tsConfig: string;
  optimization?: boolean | OptimizationOptions;
  outputHashing?: OutputHashing;
  hasServer: boolean;
  skipTypeChecking: boolean;
  useTsProjectReferences?: boolean;
  stylePreprocessorOptions?: StylePreprocessorOptions;
  devServer?: DevServerOptions;
}

export interface NormalizedPluginAngularOptions extends PluginAngularOptions {
  advancedOptimizations: boolean;
  devServer: DevServerOptions & { port: number };
  optimization: boolean | OptimizationOptions;
  outputHashing: OutputHashing;
}
