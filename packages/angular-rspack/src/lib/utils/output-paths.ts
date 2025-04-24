import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { I18nOptions } from '../models';

export function ensureOutputPaths(
  baseOutputPath: string,
  i18n: I18nOptions
): Map<string, string> {
  const outputPaths: [string, string][] = i18n.shouldInline
    ? [...i18n.inlineLocales].map((l) => [
        l,
        i18n.flatOutput
          ? baseOutputPath
          : join(baseOutputPath, i18n.locales[l].subPath),
      ])
    : [['', baseOutputPath]];

  for (const [, outputPath] of outputPaths) {
    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true });
    }
  }

  return new Map(outputPaths);
}
