// Loads a project JS file into a vm sandbox so pure functions can be called
// from Node without a browser environment.
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import assert from 'node:assert/strict';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadScript(relPath) {
    const context = createContext({ console });
    const code = readFileSync(join(__dirname, '..', relPath), 'utf8');
    runInContext(code, context);
    return context;
}

// deepStrictEqual across the vm realm boundary: structuredClone normalizes the vm-realm prototypes so that the
// assertion compares values, not identities
export const assertVmDeepEqual = (actual, expected) =>
    assert.deepStrictEqual(structuredClone(actual), expected);
