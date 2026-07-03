#!/usr/bin/env node
/**
 * Copies reveal.js's built dist/ from node_modules into the showcase, so the demo
 * page always serves whatever version is pinned in package.json instead of a
 * hand-vendored copy. Target is gitignored (matches the generic `dist` rule).
 */
import { cpSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const source = join(root, 'node_modules/reveal.js/dist');
const target = join(root, 'showcase/resources/reveal/dist');

rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

console.log(`reveal.js dist synced to ${target}`);
