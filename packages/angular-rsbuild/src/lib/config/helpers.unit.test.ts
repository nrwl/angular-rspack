import { describe, it, expect } from 'vitest';
import { getOutputHashFormat } from './helpers';

describe('getOutputHashFormat', () => {
  const defaultLength = 8;
  const tpl = (len = defaultLength) => `.[contenthash:${len}]`;

  it('returns no hashes when outputHashing is "none"', () => {
    expect(getOutputHashFormat('none')).toEqual({
      chunk: '',
      extract: '',
      file: '',
      script: '',
    });
  });

  it('returns file hashes only for "media"', () => {
    expect(getOutputHashFormat('media')).toEqual({
      chunk: '',
      extract: '',
      file: tpl(),
      script: '',
    });
  });

  it('returns chunk, extract and script hashes for "bundles"', () => {
    expect(getOutputHashFormat('bundles')).toEqual({
      chunk: tpl(),
      extract: tpl(),
      file: '',
      script: tpl(),
    });
  });

  it('returns hashes everywhere for "all"', () => {
    expect(getOutputHashFormat('all')).toEqual({
      chunk: tpl(),
      extract: tpl(),
      file: tpl(),
      script: tpl(),
    });
  });

  it('uses the provided length for the template', () => {
    const len = 16;
    expect(getOutputHashFormat('all', len)).toEqual({
      chunk: tpl(len),
      extract: tpl(len),
      file: tpl(len),
      script: tpl(len),
    });
    expect(getOutputHashFormat('media', len)).toEqual({
      chunk: '',
      extract: '',
      file: tpl(len),
      script: '',
    });
  });

  it('defaults to "none" when outputHashing is undefined', () => {
    expect(getOutputHashFormat(undefined)).toEqual({
      chunk: '',
      extract: '',
      file: '',
      script: '',
    });
  });

  it('treats unknown values as "none"', () => {
    expect(getOutputHashFormat('foobar')).toEqual({
      chunk: '',
      extract: '',
      file: '',
      script: '',
    });
  });
});
