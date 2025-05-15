import { describe, expect, it } from 'vitest';
import { vol } from 'memfs';
import { getProxyConfig } from './dev-server-config-utils.ts';
import { MEMFS_VOLUME } from '@ng-rspack/testing-utils';
import * as loadEsm from './load-esm.ts';

describe('getProxyConfig integration', () => {
  const root = MEMFS_VOLUME;
  const loadEsmSpy = vi.spyOn(loadEsm, 'loadEsmModule');

  beforeEach(() => {
    loadEsmSpy.mockResolvedValue({
      default: [
        {
          context: ['/mjs'],
          foo: 'bar',
        },
      ],
    });

    vol.reset();
    vol.fromJSON(
      {
        'good.json': `{
  "/api": { "target": "http://example.com" },
}`,
        'bad.json': `{ /api: target }`,
        'config.js': `export default { "/js": { "foo": "baz" } }`,
        'config.mjs': `just here to make existsSync happy`,
        'config.cjs': `just here to make existsSync happy`,
      },
      MEMFS_VOLUME
    );
  });

  it('returns undefined when proxyConfig is undefined', async () => {
    const result = await getProxyConfig(root, undefined);
    expect(result).toBeUndefined();
  });

  it('throws if the file does not exist', async () => {
    await expect(getProxyConfig(root, 'no-such-file.json')).rejects.toThrow(
      /Proxy configuration file .*no-such-file\.json does not exist\./
    );
  });

  it('parses a valid JSON file and normalizes it', async () => {
    const cfg = await getProxyConfig(root, 'good.json');
    expect(cfg).toEqual([{ context: ['/api'], target: 'http://example.com' }]);
  });

  it('throws with detailed errors on invalid JSON', async () => {
    await expect(getProxyConfig(root, 'bad.json')).rejects.toThrow(
      /contains parse errors:/
    );
  });

  it('loads an ESM (.mjs) config and normalizes it', async () => {
    const cfg = await getProxyConfig(root, 'config.mjs');
    expect(cfg).toEqual([{ context: ['/mjs'], foo: 'bar' }]);
  });

  it.todo('loads a CommonJS (.cjs) config and normalizes it');
});
