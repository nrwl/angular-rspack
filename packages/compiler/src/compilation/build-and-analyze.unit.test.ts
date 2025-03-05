import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildAndAnalyzeWithParallelCompilation } from './build-and-analyze'; // Adjust path accordingly
import { ParallelCompilation } from '@angular/build/src/tools/angular/compilation/parallel-compilation';
import { JavaScriptTransformer } from '@angular/build/src/tools/esbuild/javascript-transformer';

describe('buildAndAnalyzeWithParallelCompilation', () => {
  const mockEmitAffectedFiles = vi.fn();

  const mockTransformData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTransformData.mockImplementation((_file, content) =>
      Promise.resolve(`transformed(${content})`)
    );
    mockEmitAffectedFiles.mockResolvedValue([
      { filename: 'C:/path/to/file.ts', contents: 'console.log("Hello");' },
      { filename: '/home/user/project/file2.ts', contents: 'const a = 42;' },
    ]);
  });

  it('should call emitAffectedFiles and iterate over result of emitted files', async () => {
    const parallelCompilation = {
      emitAffectedFiles: mockEmitAffectedFiles,
    } as unknown as ParallelCompilation;
    const javascriptTransformer = {
      transformData: mockTransformData,
    } as unknown as JavaScriptTransformer;
    const typescriptFileCache = new Map<string, string | Uint8Array>();

    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();
    expect(mockEmitAffectedFiles).toHaveBeenCalledTimes(1);
  });

  it('should call transformData for each file emitted by emitAffectedFiles', async () => {
    const parallelCompilation = {
      emitAffectedFiles: mockEmitAffectedFiles,
    } as unknown as ParallelCompilation;
    const javascriptTransformer = {
      transformData: mockTransformData,
    } as unknown as JavaScriptTransformer;
    const typescriptFileCache = new Map<string, string | Uint8Array>();

    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();
    expect(mockTransformData).toHaveBeenCalledTimes(2);
    expect(mockTransformData).toHaveBeenNthCalledWith(
      1,
      '/path/to/file.ts',
      'console.log("Hello");',
      true,
      false
    );
    expect(mockTransformData).toHaveBeenNthCalledWith(
      2,
      '/home/user/project/file2.ts',
      'const a = 42;',
      true,
      false
    );
  });

  it('should add emitted files to cache', async () => {
    const parallelCompilation = {
      emitAffectedFiles: mockEmitAffectedFiles,
    } as unknown as ParallelCompilation;
    const javascriptTransformer = {
      transformData: mockTransformData,
    } as unknown as JavaScriptTransformer;
    const typescriptFileCache = new Map<string, string | Uint8Array>();

    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();

    expect(typescriptFileCache.size).toBe(2);
    expect(typescriptFileCache.has('/path/to/file.ts')).toBe(true);
    expect(typescriptFileCache.has('/home/user/project/file2.ts')).toBe(true);
  });

  it('should transform and cache emitted TypeScript files', async () => {
    const parallelCompilation = {
      emitAffectedFiles: mockEmitAffectedFiles,
    } as unknown as ParallelCompilation;
    const javascriptTransformer = {
      transformData: mockTransformData,
    } as unknown as JavaScriptTransformer;
    const typescriptFileCache = new Map<string, string | Uint8Array>();

    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();

    expect(mockEmitAffectedFiles).toHaveBeenCalledTimes(1);
    expect(mockTransformData).toHaveBeenCalledTimes(2);
    expect(typescriptFileCache.size).toBe(2);

    expect(typescriptFileCache.has('/path/to/file.ts')).toBe(true);
    expect(typescriptFileCache.has('/home/user/project/file2.ts')).toBe(true);

    expect(typescriptFileCache.get('/path/to/file.ts')).toBe(
      'transformed(console.log("Hello");)'
    );
    expect(typescriptFileCache.get('/home/user/project/file2.ts')).toBe(
      'transformed(const a = 42;)'
    );
  });
});
