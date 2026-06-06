import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadScript } from './load.mjs';

const { sort_string, sort_entries } = loadScript('js/helper_functions.js');

test('sort_string', async (t) => {
    await t.test('earlier string sorts before later string', () => {
        assert.equal(sort_string('apple', 'banana'), -1);
    });
    await t.test('later string sorts after earlier string', () => {
        assert.equal(sort_string('banana', 'apple'), 1);
    });
    await t.test('comparison is case-insensitive', () => {
        assert.equal(sort_string('APPLE', 'apple'), 0);
    });
    await t.test('identical strings are equal', () => {
        assert.equal(sort_string('same', 'same'), 0);
    });
});

test('sort_entries', async (t) => {
    const makeEntries = () => [
        { Number: 3, Clue: 'Zeal', Entry: 'ARDOR' },
        { Number: 1, Clue: 'Apple',  Entry: 'FRUIT' },
        { Number: 2, Clue: 'Mango',  Entry: 'DRUPE' },
    ];

    await t.test('sorts by Number numerically', () => {
        const arr = makeEntries();
        sort_entries(arr, 'Number');
        assert.deepEqual(arr.map(e => e.Number), [1, 2, 3]);
    });
    await t.test('sorts by Clue alphabetically', () => {
        const arr = makeEntries();
        sort_entries(arr, 'Clue');
        assert.deepEqual(arr.map(e => e.Clue), ['Apple', 'Mango', 'Zeal']);
    });
    await t.test('sorts by Entry alphabetically', () => {
        const arr = makeEntries();
        sort_entries(arr, 'Entry');
        assert.deepEqual(arr.map(e => e.Entry), ['ARDOR', 'DRUPE', 'FRUIT']);
    });
    await t.test('unknown sort key leaves array unchanged', () => {
        const arr = makeEntries();
        const original = arr.map(e => e.Number);
        sort_entries(arr, 'Unknown');
        assert.deepEqual(arr.map(e => e.Number), original);
    });
});
