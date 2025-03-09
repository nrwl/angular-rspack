import { FileReplacement } from '@ng-rspack/compiler';
import { getHasServer, HasServerOptions, resolveFileReplacements } from './normalize-options';
import { describe } from 'vitest';

describe('resolveFileReplacements', () => {

  it('should resolve file replacements', () => {
    const fileReplacements: FileReplacement[] = [
      { replace: 'replace', with: 'with' },
    ];
    const root = '/root';
    expect(resolveFileReplacements(fileReplacements, root)).toEqual([
      { replace: '/root/replace', with: '/root/with' },
    ]);
  })

})

describe('getHasServer', () => {

  it('should return false if server is not provided', () => {
    expect(getHasServer({ root: ''})).toBe(false);
  })

  it('should return false if ssrEntry is not provided', () => {
    expect(getHasServer({ server: 'server' } as HasServerOptions)).toBe(false);
  })

  it('should return false if server file does not exist', () => {
    expect(getHasServer({ server: 'server', ssrEntry: 'ssrEntry', root: '/not-existing-folder' })).toBe(false);
  })

  it('should return true if server and ssrEntry files exist', () => {
    expect(getHasServer({ server: 'server', ssrEntry: 'ssrEntry', root: __dirname })).toBe(true);
  })

})
