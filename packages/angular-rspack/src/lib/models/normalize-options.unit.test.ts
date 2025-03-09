import { FileReplacement } from '@ng-rspack/compiler';
import {
  getHasServer,
  HasServerOptions,
  normalizeOptions,
  normalizeOptionsServerOptions,
  resolveFileReplacements,
} from './normalize-options';
import { describe, expect } from 'vitest';
import { vol } from 'memfs';
import { MEMFS_VOLUME } from '@ng-rspack/testing-utils';

describe('resolveFileReplacements', () => {
  it('should resolve file replacements', () => {
    const fileReplacements: FileReplacement[] = [
      { replace: 'replace', with: 'with' },
    ];
    const root = '/root';
    expect(resolveFileReplacements(fileReplacements, root)).toEqual([
      { replace: '/root/replace', with: '/root/with' },
    ]);
  });
});

describe('getHasServer', () => {
  afterEach(() => {
    vol.reset();
  });

  it('should return false if server is not provided', () => {
    expect(getHasServer({ root: '' })).toBe(false);
  });

  it('should return false if ssrEntry is not provided', () => {
    expect(getHasServer({ server: 'server' } as HasServerOptions)).toBe(false);
  });

  it('should return false if server file does not exist', () => {
    expect(
      getHasServer({
        server: 'main.ts',
        ssrEntry: 'server.main.ts',
        root: '/not-existing-folder',
      })
    ).toBe(false);
  });

  it('should return true if server and ssrEntry files exist', () => {
    vol.fromJSON(
      {
        'main.ts': '',
        'server.main.ts': '',
      },
      MEMFS_VOLUME
    );

    expect(
      getHasServer({
        server: 'main.ts',
        ssrEntry: 'server.main.ts',
        root: MEMFS_VOLUME,
      })
    ).toBe(true);
  });
});

describe('normalizeOptionsServerOptions', () => {
  it('should return hasServer false options if getHasServer is false', () => {
    expect(
      normalizeOptionsServerOptions({
        root: MEMFS_VOLUME,
      })
    ).toStrictEqual({ hasServer: false });
  });

  it('should return hasServer true as well as the server and ssrEntry options if getHasServer is true', () => {
    vol.fromJSON(
      {
        'main.ts': '',
        'server.main.ts': '',
      },
      MEMFS_VOLUME
    );

    expect(
      normalizeOptionsServerOptions({
        server: 'main.ts',
        ssrEntry: 'server.main.ts',
        root: MEMFS_VOLUME,
      })
    ).toStrictEqual({
      hasServer: true,
      server: 'main.ts',
      ssrEntry: 'server.main.ts',
    });
  });
});

describe('normalizeOptions', () => {
  it('should normalize options default options', () => {
    expect(normalizeOptions()).toStrictEqual({
      root: process.cwd(),
      aot: true,
      hasServer: false,
      inlineStyleLanguage: 'css',
      skipTypeChecking: false,
      polyfills: [],
      index: './src/index.html',
      browser: './src/main.ts',
      assets: ['./public'],
      styles: ['./src/styles.css'],
      scripts: [],
      fileReplacements: [],
      tsConfig: expect.stringMatching(/tsconfig.app.json$/),
      useTsProjectReferences: false,
    });
  });

  it('should normalize options server options', () => {
    vol.fromJSON(
      {
        'main.ts': '',
        'server.main.ts': '',
      },
      MEMFS_VOLUME
    );

    expect(
      normalizeOptions({
        root: MEMFS_VOLUME,
        server: 'main.ts',
        ssrEntry: 'server.main.ts',
      })
    ).toStrictEqual({
      root: MEMFS_VOLUME,
      server: 'main.ts',
      ssrEntry: 'server.main.ts',
      hasServer: true,
      aot: true,
      inlineStyleLanguage: 'css',
      skipTypeChecking: false,
      polyfills: [],
      index: './src/index.html',
      browser: './src/main.ts',
      assets: ['./public'],
      styles: ['./src/styles.css'],
      scripts: [],
      fileReplacements: [],
      tsConfig: expect.stringMatching(/tsconfig.app.json$/),
      useTsProjectReferences: false,
    });
  });
});
