import { describe, expect } from 'vitest';
import {
  DEFAULT_PLUGIN_ANGULAR_OPTIONS,
  getHasServer,
  normalizeOptions,
  normalizeOutputPath,
  resolveFileReplacements,
} from './normalize-options.ts';
import { vol } from 'memfs';

import { MEMFS_VOLUME } from '@ng-rspack/testing-utils';
import { PluginAngularOptions } from './plugin-options';

describe('resolveFileReplacements', () => {
  it('should work with empty results', () => {
    const root = '/root';

    expect(resolveFileReplacements([], root)).toStrictEqual([]);
  });

  it('should return the given FileReplacement with `replace` and `with` paths starting with given root', () => {
    const file = '../src/lib/../main.ts';
    const root = '/repos/project';

    expect(
      resolveFileReplacements([{ replace: file, with: file }], root)
    ).toStrictEqual([
      {
        replace: '/repos/src/main.ts',
        with: '/repos/src/main.ts',
      },
    ]);
  });

  it('should return the given FileReplacement with `replace` and `with` paths resolved against the given root', () => {
    const file = 'src/main.ts';
    const root = '/root';

    expect(
      resolveFileReplacements([{ replace: file, with: file }], root)
    ).toStrictEqual([
      {
        replace: `${root}/${file}`,
        with: `${root}/${file}`,
      },
    ]);
  });
});

describe('getHasServer', () => {
  beforeEach(() => {
    vol.fromJSON(
      {
        'server.js': 'export default { "server": true }',
        'ssr-entry.js': 'export default { "ssr-entry": true }',
      },
      MEMFS_VOLUME
    );
    vi.stubGlobal('process', { cwd: () => MEMFS_VOLUME });
  });

  it('should return true if both server and ssr.entry files exist', () => {
    const result = getHasServer({
      server: 'server.js',
      ssr: { entry: 'ssr-entry.js' },
    });

    expect(result).toBe(true);
  });

  it('should return false if server file is not provides', () => {
    const result = getHasServer({
      ssr: { entry: 'ssr-entry.js' },
    });

    expect(result).toBe(false);
  });

  it('should return false if ssr.entry file is not provides', () => {
    const result = getHasServer({
      server: 'server.js',
    });

    expect(result).toBe(false);
  });

  it('should return false if neither file are not provides', () => {
    const result = getHasServer({});

    expect(result).toBe(false);
  });

  it('should return false if server file does not exist', () => {
    const result = getHasServer({
      server: 'non-existing-server.js',
      ssr: { entry: 'ssr-entry.js' },
    });

    expect(result).toBe(false);
  });

  it('should return false if ssr.entry file does not exist', () => {
    const result = getHasServer({
      server: 'server.js',
      ssr: { entry: 'non-existing-ssr-entry.js' },
    });

    expect(result).toBe(false);
  });

  it('should return false if neither server nor ssr.entry exists', () => {
    const result = getHasServer({
      server: 'non-existing-server.js',
      ssr: { entry: 'non-existing-ssr-entry.js' },
    });

    expect(result).toBe(false);
  });
});

describe('normalizeOptions', () => {
  let defaultOptions: PluginAngularOptions;

  beforeEach(() => {
    // Need to reset the default options with the stubbed value for process.cwd()
    defaultOptions = {
      ...DEFAULT_PLUGIN_ANGULAR_OPTIONS,
      outputPath: normalizeOutputPath(process.cwd(), undefined),
    };
  });

  it('should apply default values when no options are provided', () => {
    const result = normalizeOptions();

    expect(result).toStrictEqual({
      ...defaultOptions,
      advancedOptimizations: true,
    });
  });

  it('should apply default values when empty options are provided', () => {
    const result = normalizeOptions({});

    expect(result).toStrictEqual({
      ...defaultOptions,
      advancedOptimizations: true,
    });
  });

  it('should set optimization to false when provided in options', () => {
    const result = normalizeOptions({ optimization: false });

    expect(result).toStrictEqual({
      ...defaultOptions,
      optimization: false,
      advancedOptimizations: false,
    });
  });

  it('should ignore passed hasServer option', () => {
    expect(normalizeOptions({ hasServer: true }).hasServer).toStrictEqual(
      false
    );
  });

  it('should set hasServer option based on provided of server and ssr-entry files', () => {
    vol.fromJSON(
      {
        'server.js': 'export default { "server": true }',
        'ssr-entry.js': 'export default { "ssr-entry": true }',
      },
      MEMFS_VOLUME
    );

    expect(
      normalizeOptions({
        server: 'server.js',
        ssr: { entry: 'ssr-entry.js' },
      }).hasServer
    ).toStrictEqual(true);
  });

  it('should resolve the paths of fileReplacements if given', () => {
    const fileReplacements = [
      { replace: 'src/main.ts', with: 'src/main.prod.ts' },
    ];

    const resolvedFileReplacements = normalizeOptions({
      fileReplacements,
    }).fileReplacements;

    expect(resolvedFileReplacements).toStrictEqual([
      {
        replace: `${MEMFS_VOLUME}/src/main.ts`,
        with: `${MEMFS_VOLUME}/src/main.prod.ts`,
      },
    ]);
  });
});
