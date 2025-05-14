import { createConfig } from './create-config';
import { osAgnosticPath } from '@ng-rspack/testing-utils';
import { beforeAll, beforeEach, expect } from 'vitest';
import * as normalizeModule from '../models/normalize-options.ts';
import { DEFAULT_PLUGIN_ANGULAR_OPTIONS } from '../models/normalize-options.ts';

describe('createConfig', () => {
  const argvSpy = vi.spyOn(process, 'argv', 'get');
  const normalizeOptionsSpy = vi.spyOn(normalizeModule, 'normalizeOptions');

  beforeAll(() => {
    argvSpy.mockReturnValue([]);
    normalizeOptionsSpy.mockReturnValue(DEFAULT_PLUGIN_ANGULAR_OPTIONS);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.todo('should create a CSR config', async () => {
    const config = await createConfig({
      options: {
        inlineStyleLanguage: 'scss',
        tsConfig: './tsconfig.app.json',
        aot: true,
      },
    });
    expect(
      `import type { RsbuildConfig } from '@rsbuild/core';\nconst config: RsbuildConfig = ${JSON.stringify(
        {
          ...config,
          root: config.root ? osAgnosticPath(config.root) : undefined,
          source: {
            tsconfigPath: config.source?.tsconfigPath
              ? osAgnosticPath(config.source?.tsconfigPath)
              : undefined,
          },
        },
        null,
        2
      )}`
    ).toMatchFileSnapshot('__snapshots__/create-config.csr.ts');
  });

  it.todo('should create a SSR config', async () => {
    const config = await createConfig({
      options: {
        server: './src/main.server.ts',
        ssr: { entry: './src/server.ts' },
        inlineStyleLanguage: 'scss',
        tsConfig: './tsconfig.app.json',
      },
    });

    expect(
      `import type { RsbuildConfig } from '@rsbuild/core';\nconst config: RsbuildConfig = ${JSON.stringify(
        {
          ...config,
          root: config.root ? osAgnosticPath(config.root) : undefined,
          source: {
            tsconfigPath: config.source?.tsconfigPath
              ? osAgnosticPath(config.source?.tsconfigPath)
              : undefined,
          },
        },
        null,
        2
      )}`
    ).toMatchFileSnapshot('__snapshots__/create-config.ssr.ts');
  });
});
