import { describe, expect, it } from 'vitest';
import {
  assertIsError,
  getJsonErrorLineColumn,
  normalizeProxyConfiguration,
} from './dev-server-config-utils.ts';

describe('getJsonErrorLineColumn', () => {
  it('should return line and column of the error', () => {
    const brokenJson = `
      {
      "test": {
      "id": 1a,
      }
      }`;

    const errMsg = `Expected ',' or '}' after property value in JSON at position 38`;
    expect(() => JSON.parse(brokenJson)).toThrow(errMsg);

    const match = /position (\d+)/.exec(errMsg); // Extract the position from the error message (38)
    const offset = match ? Number(match[1]) : 0;
    const { line, column } = getJsonErrorLineColumn(offset, brokenJson);
    expect(`Parse error at line ${line}, column ${column}`).toBe(
      `Parse error at line 4, column 14`
    );
  });

  it('should return line and column 0 if offset it 0', () => {
    expect(getJsonErrorLineColumn(0, '')).toStrictEqual({
      column: 1,
      line: 1,
    });
  });
});

describe('assertIsError', () => {
  it('does nothing for a genuine Error instance', () => {
    const e = new Error('oops');
    expect(() => assertIsError(e)).not.toThrow();
  });

  it('accepts a plain object with name and message (e.g. RxJS error)', () => {
    const rxError = { name: 'TypeError', message: 'bad type' };
    expect(() => assertIsError(rxError)).not.toThrow();
    // After narrowing, TS knows it’s Error-like:
    assertIsError(rxError);
    expect(rxError.name).toBe('TypeError');
    expect(rxError.message).toBe('bad type');
  });

  it('throws if value is not Error-like', () => {
    const badValues = [
      null,
      undefined,
      123,
      'err',
      { foo: 'bar' },
      { name: 'X' },
      { message: 'Y' },
    ];
    for (const val of badValues) {
      expect(() => assertIsError(val as any)).toThrow(
        'catch clause variable is not an Error instance'
      );
    }
  });
});

describe('normalizeProxyConfiguration', () => {
  it('returns the same array when given an array of proxy configs', () => {
    const input = [
      { context: ['/api'], target: 'http://localhost:3000' },
      { context: ['/auth'], changeOrigin: true },
    ];

    expect(normalizeProxyConfiguration(input)).toBe(input);
  });

  it('converts multiple-object proxy configs to an array with matching entries', () => {
    const input = {
      '/api': { target: 'http://example.com' },
      '/auth': { changeOrigin: true, secure: false },
    };
    expect(normalizeProxyConfiguration(input)).toEqual([
      { context: ['/api'], target: 'http://example.com' },
      { context: ['/auth'], changeOrigin: true, secure: false },
    ]);
  });

  it('returns an empty array when given an empty proxy object', () => {
    expect(normalizeProxyConfiguration({})).toEqual([]);
  });
});
