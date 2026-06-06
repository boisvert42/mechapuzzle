import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript, assertVmDeepEqual } from './load.mjs';

const {
    getIndicesOfStringsOfAtLeastMinLength,
    longestCommonSubstringsFromMultipleStrings,
    addKeyValuePairToMultimap,
    getCluesPreOrPostfixedWith,
} = loadScript('js/theme.js');

test('getIndicesOfStringsOfAtLeastMinLength', async (t) => {
    await t.test('empty input returns empty array', () => {
        assertVmDeepEqual(getIndicesOfStringsOfAtLeastMinLength([], 5), []);
    });
    await t.test('no strings meet min length', () => {
        assertVmDeepEqual(getIndicesOfStringsOfAtLeastMinLength(['AB', 'CD'], 3), []);
    });
    await t.test('exactly at min length is included', () => {
        assertVmDeepEqual(getIndicesOfStringsOfAtLeastMinLength(['ABC'], 3), ['0']);
    });
    await t.test('one short of min length is excluded', () => {
        assertVmDeepEqual(getIndicesOfStringsOfAtLeastMinLength(['AB'], 3), []);
    });
    await t.test('returns string indices of qualifying entries', () => {
        assertVmDeepEqual(
            getIndicesOfStringsOfAtLeastMinLength(['AB', 'CDE', 'FG', 'HIJK'], 3),
            ['1', '3']
        );
    });
});

test('longestCommonSubstringsFromMultipleStrings', async (t) => {
    await t.test('no arguments returns empty string sentinel', () => {
        assert.strictEqual(longestCommonSubstringsFromMultipleStrings(), '');
    });
    await t.test('single string returns that string', () => {
        assertVmDeepEqual(longestCommonSubstringsFromMultipleStrings('CAKE'), ['CAKE']);
    });
    await t.test('two strings sharing a suffix', () => {
        assertVmDeepEqual(longestCommonSubstringsFromMultipleStrings('CAKE', 'BAKE'), ['AKE']);
    });
    await t.test('two strings sharing a longer suffix', () => {
        assertVmDeepEqual(longestCommonSubstringsFromMultipleStrings('MOONBEAM', 'SUNBEAM'), ['NBEAM']);
    });
    await t.test('three strings sharing a common prefix', () => {
        assertVmDeepEqual(longestCommonSubstringsFromMultipleStrings('ABCDE', 'ABCFG', 'ABXYZ'), ['AB']);
    });
    await t.test('no common characters returns empty string', () => {
        assertVmDeepEqual(longestCommonSubstringsFromMultipleStrings('ABC', 'DEF'), ['']);
    });
});

test('addKeyValuePairToMultimap', async (t) => {
    await t.test('creates array for new key', () => {
        const m = {};
        addKeyValuePairToMultimap(m, 'k', 'v');
        assertVmDeepEqual(m, { k: ['v'] });
    });
    await t.test('does not duplicate an existing value', () => {
        const m = {};
        addKeyValuePairToMultimap(m, 'k', 'v');
        addKeyValuePairToMultimap(m, 'k', 'v');
        assertVmDeepEqual(m, { k: ['v'] });
    });
    await t.test('appends a distinct value to an existing key', () => {
        const m = {};
        addKeyValuePairToMultimap(m, 'k', 'v1');
        addKeyValuePairToMultimap(m, 'k', 'v2');
        assertVmDeepEqual(m, { k: ['v1', 'v2'] });
    });
});

test('getCluesPreOrPostfixedWith', async (t) => {
    const clues = [
        { number: 1, text: '*Leading star' },
        { number: 2, text: 'Trailing star*' },
        { number: 3, text: 'No star here' },
    ];
    // entries is 1-based: index = clue array position + 1
    const entries = { 1: 'ENTRY1', 2: 'ENTRY2', 3: 'ENTRY3' };

    await t.test('returns prefixed and postfixed clues with their entries', () => {
        const result = getCluesPreOrPostfixedWith(clues, '*', entries, 'A');
        assertVmDeepEqual(result.clues, ['1A [*Leading star]', '2A [Trailing star*]']);
        assertVmDeepEqual(result.entries, ['ENTRY1', 'ENTRY2']);
    });
    await t.test('empty clue list returns empty result', () => {
        assertVmDeepEqual(
            getCluesPreOrPostfixedWith([], '*', {}, 'A'),
            { clues: [], entries: [] }
        );
    });
    await t.test('no matching clues returns empty result', () => {
        const noMatch = [{ number: 1, text: 'No star here' }];
        assertVmDeepEqual(
            getCluesPreOrPostfixedWith(noMatch, '*', entries, 'D'),
            { clues: [], entries: [] }
        );
    });
});
