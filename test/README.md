# Mechapuzzle Tests

This directory contains the automated test suite for the Mechapuzzle project.

## Architecture

The project is a browser-based application, but the tests run in **Node.js** using the built-in `node:test` runner.

Since the source files in `js/` are written for the browser and do not use Node.js module exports, we use a utility called `load.mjs`. This script:
1. Reads the source JavaScript files as strings.
2. Executes them within a `node:vm` sandbox.
3. Extracts the global functions and variables from that sandbox for use in the test suite.

This allows us to test "pure" logic functions (like sorting, pattern matching, and URL parsing) without needing a browser environment or a complex transpilation step.

## Test Suite Overview

*   **`helper_functions.test.mjs`**: Tests for sorting strings and entry lists.
*   **`tabs.test.mjs`**: Tests for URL hash extraction and tab navigation logic.
*   **`theme.test.mjs`**: Tests for crossword-specific logic, including theme entry identification and common substring analysis.

## How to Run Tests

From the project root, you can run all tests using:

```powershell
npm test
```

To run a specific test file:

```powershell
node --test test/theme.test.mjs
```
