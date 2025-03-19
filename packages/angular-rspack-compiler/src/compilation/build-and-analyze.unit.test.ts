import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildAndAnalyzeWithParallelCompilation } from './build-and-analyze';
import { ParallelCompilation } from '@angular/build/src/tools/angular/compilation/parallel-compilation';
import { JavaScriptTransformer } from '@angular/build/src/tools/esbuild/javascript-transformer';

describe('buildAndAnalyzeWithParallelCompilation', () => {
  let parallelCompilation: ParallelCompilation;
  let javascriptTransformer: JavaScriptTransformer;
  let typescriptFileCache: Map<string, string | Uint8Array>;
  const mockEmitAffectedFiles = vi.fn();
  const mockTransformData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockTransformData.mockImplementation((_file, _) =>
      Promise.resolve('MOCK_TRANSFORMED')
    );

    parallelCompilation = {
      emitAffectedFiles: mockEmitAffectedFiles,
    } as unknown as ParallelCompilation;
    javascriptTransformer = {
      transformData: mockTransformData,
    } as unknown as JavaScriptTransformer;
    typescriptFileCache = new Map<string, string | Uint8Array>();
  });

  it('should call emitAffectedFiles and iterate over result of emitted files', async () => {
    mockEmitAffectedFiles.mockResolvedValue([
      { filename: 'file1.ts', contents: '' },
      { filename: 'file2.ts', contents: '' },
    ]);

    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();
    expect(mockEmitAffectedFiles).toHaveBeenCalledTimes(1);
    expect(mockTransformData).toHaveBeenCalledTimes(2);
  });

  it('should normalize file names before emitting', async () => {
    mockEmitAffectedFiles.mockResolvedValue([
      { filename: 'C:/file.ts', contents: '' },
    ]);

    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();

    expect(mockTransformData).toHaveBeenNthCalledWith(
      1,
      '/file.ts',
      '',
      true,
      false
    );
  });

  it('should add emitted files to cache', async () => {
    mockEmitAffectedFiles.mockResolvedValue([
      { filename: 'file.ts', contents: '' },
    ]);
    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();

    expect(typescriptFileCache.size).toBe(1);
    expect(typescriptFileCache.has('file.ts')).toBe(true);
    expect(typescriptFileCache.get('file.ts')).toEqual(expect.any(String));
  });

  it('should transform the file content', async () => {
    mockEmitAffectedFiles.mockResolvedValue([
      { filename: 'file.ts', contents: '' },
    ]);
    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();

    expect(mockTransformData).toHaveBeenCalledTimes(1);
    expect(typescriptFileCache.get('file.ts')).toBe('MOCK_TRANSFORMED');
  });
});
