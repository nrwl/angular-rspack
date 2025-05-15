import { FileReplacement } from '@ng-rspack/compiler';
import { resolveFileReplacements } from './normalize-options';

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
