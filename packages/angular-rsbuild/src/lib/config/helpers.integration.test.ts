import { deleteOutputDir } from './helpers.ts';
import { afterAll, beforeEach, expect } from 'vitest';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { vol } from 'memfs';
import { MEMFS_VOLUME } from '@ng-rspack/testing-utils';

describe('deleteOutputDir', () => {
  const readdirSpy = vi.spyOn(vol, 'readdir');
  const outputDir = join(MEMFS_VOLUME, 'delete-output-dir');

  beforeEach(() => {
    readdirSpy.mockClear();
  });

  afterAll(() => {
    readdirSpy.mockRestore();
  });

  it('should remove all folders and files in root', async () => {
    vol.fromJSON({
      [join(outputDir, 'sub-dir-1/file-1.txt')]: '',
      [join(outputDir, 'sub-dir-2/file-2.txt')]: '',
      [join(outputDir, 'sub-dir-3/file-3.txt')]: '',
    });

    await expect(readdir(outputDir)).resolves.toStrictEqual([
      'sub-dir-1',
      'sub-dir-2',
      'sub-dir-3',
    ]);
    await expect(
      deleteOutputDir(MEMFS_VOLUME, outputDir)
    ).resolves.not.toThrow();
    await expect(readdir(outputDir)).resolves.toStrictEqual([]);
  });

  it('should remove only folders and files listed in emptyOnly', async () => {
    vol.fromJSON({
      [join(outputDir, 'sub-dir-1/file-1.txt')]: '',
      [join(outputDir, 'sub-dir-2/file-2.txt')]: '',
      [join(outputDir, 'sub-dir-3/file-3.txt')]: '',
    });

    await expect(readdir(outputDir)).resolves.toStrictEqual([
      'sub-dir-1',
      'sub-dir-2',
      'sub-dir-3',
    ]);
    await expect(
      deleteOutputDir(MEMFS_VOLUME, outputDir, ['sub-dir-2'])
    ).resolves.not.toThrow();
    await expect(readdir(outputDir)).resolves.toStrictEqual(['sub-dir-2']);
  });

  it('should throw if root is project root', async () => {
    await expect(deleteOutputDir(MEMFS_VOLUME, MEMFS_VOLUME)).rejects.toThrow(
      'Output path MUST not be project root directory!'
    );
  });

  it('should not throw if output path does not exist', async () => {
    await expect(
      deleteOutputDir(MEMFS_VOLUME, 'non-existing-path')
    ).resolves.not.toThrow();
  });

  it('should throw if non ENOENT error', async () => {
    const otherError = new Error('permission denied') as Error & {
      code: string;
    };
    otherError.code = 'EACCES';
    readdirSpy.mockImplementationOnce(() => {
      throw otherError;
    });

    await expect(
      deleteOutputDir(MEMFS_VOLUME, 'no-permission-path')
    ).rejects.toThrow(otherError);
  });

  it('should work when called recursively', async () => {
    vol.fromJSON({
      [join(outputDir, 'sub-dir-1/sub-dir-1.1/file-1.txt')]: '',
      [join(outputDir, 'sub-dir-2/sub-dir-2.1/file-2.txt')]: '',
      [join(outputDir, 'sub-dir-3/sub-dir-3.1/file-3.txt')]: '',
    });

    await expect(readdir(outputDir)).resolves.toStrictEqual([
      'sub-dir-1',
      'sub-dir-2',
      'sub-dir-3',
    ]);

    await expect(
      deleteOutputDir(MEMFS_VOLUME, outputDir, ['sub-dir-1', 'sub-dir-1.1'])
    ).resolves.not.toThrow();
    await expect(readdir(join(outputDir, 'sub-dir-1'))).resolves.toStrictEqual([
      'sub-dir-1.1',
    ]);
  });
});
