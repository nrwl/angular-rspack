import {
  IndexHtmlGenerator,
  type FileInfo,
  type IndexHtmlGeneratorOptions,
  type IndexHtmlGeneratorProcessOptions,
} from '@angular/build/private';
import { Compilation, RspackPluginInstance, type Compiler } from '@rspack/core';
import { basename, dirname, extname } from 'node:path';
import { assertIsError } from '../utils/misc-helpers';
import { addError, addWarning } from '../utils/rspack-diagnostics';

const INDEX_HTML_SERVER = 'index.server.html';

export interface IndexHtmlPluginOptions
  extends IndexHtmlGeneratorOptions,
    Omit<IndexHtmlGeneratorProcessOptions, 'files'> {}

const PLUGIN_NAME = 'IndexHtmlPlugin';

export class IndexHtmlPlugin
  extends IndexHtmlGenerator
  implements RspackPluginInstance
{
  private _compilation: Compilation | undefined;
  get compilation(): Compilation {
    if (this._compilation) {
      return this._compilation;
    }

    throw new Error('compilation is undefined.');
  }

  constructor(
    override readonly options: IndexHtmlPluginOptions,
    private readonly isServer: boolean
  ) {
    super(options);
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      this._compilation = compilation;

      compilation.hooks.processAssets.tapPromise(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        async () => {
          const files: FileInfo[] = [];

          try {
            for (const chunk of compilation.chunks) {
              for (const file of chunk.files) {
                // https://github.com/web-infra-dev/rspack/blob/a2e1e21c7e1ed0f34e476ec270e3c5460c4a1a36/packages/rspack/src/config/defaults.ts#L606
                if (
                  file.endsWith('.hot-update.js') ||
                  file.endsWith('.hot-update.mjs')
                ) {
                  continue;
                }

                files.push({
                  name: chunk.name,
                  file,
                  extension: extname(file),
                });
              }
            }

            const { csrContent, ssrContent, warnings, errors } =
              await this.process({
                files,
                outputPath: dirname(this.options.outputPath),
                baseHref: this.options.baseHref,
                lang: this.options.lang,
              });

            const { RawSource } = compiler.rspack.sources;
            if (!this.isServer) {
              compilation.emitAsset(
                this.options.outputPath,
                new RawSource(csrContent)
              );
            } else if (ssrContent) {
              compilation.emitAsset(
                INDEX_HTML_SERVER,
                new RawSource(ssrContent)
              );
            }

            warnings.forEach((msg) => addWarning(compilation, msg));
            errors.forEach((msg) => addError(compilation, msg));
          } catch (error) {
            assertIsError(error);
            addError(compilation, error.message);
          }
        }
      );
    });
  }

  override async readAsset(path: string): Promise<string> {
    const data = this.compilation.assets[basename(path)].source();

    return typeof data === 'string' ? data : data.toString();
  }

  protected override async readIndex(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.compilation.inputFileSystem) {
        super.readIndex(path).then(resolve).catch(reject);
        return;
      }

      this.compilation.inputFileSystem.readFile(
        path,
        (err?: Error | null, data?: string | Buffer) => {
          if (err) {
            reject(err);
            return;
          }

          this.compilation.fileDependencies.add(path);
          resolve(data?.toString() ?? '');
        }
      );
    });
  }
}
