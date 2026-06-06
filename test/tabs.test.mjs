import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript } from './load.mjs';

const { getHash } = loadScript('js/tabs.js');

test('getHash', async (t) => {
    await t.test('extracts fragment from a full URL', () => {
        assert.equal(getHash('https://example.com#grid'), 'grid');
    });
    await t.test('extracts fragment when URL is only a hash', () => {
        assert.equal(getHash('#theme'), 'theme');
    });
    await t.test('uses the last # when multiple are present', () => {
        assert.equal(getHash('foo#bar#baz'), 'baz');
    });
    await t.test('returns the full string when no # is present', () => {
        assert.equal(getHash('nohash'), 'nohash');
    });
});
