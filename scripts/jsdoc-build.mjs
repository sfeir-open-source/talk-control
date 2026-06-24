#!/usr/bin/env node
/**
 * Replaces vuepress-jsdoc: scans src/, generates per-file Markdown via jsdoc-to-markdown,
 * writes to docs-sources/developers/code/parts/ and regenerates the README index.
 */
import jsdoc2md from 'jsdoc-to-markdown';
import { mkdirSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'src');
const partsDir = join(root, 'docs-sources/developers/code/parts');

function findJsFiles(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    return entries.flatMap(entry => {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) return findJsFiles(full);
        if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('.spec.js')) return [full];
        return [];
    });
}

const generated = [];

for (const file of findJsFiles(srcDir)) {
    const relPath = relative(srcDir, file).replace(/\.js$/, '.md');
    const outFile = join(partsDir, relPath);

    const md = await jsdoc2md.render({ files: file });
    if (!md.trim()) continue;

    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, md);
    generated.push(relPath);
}

// Regenerate the README index grouped by top-level directory
const byGroup = generated.reduce((acc, f) => {
    const group = f.split('/')[0];
    (acc[group] ??= []).push(f);
    return acc;
}, {});

const indexLines = ['# API Reference\n'];
for (const [group, files] of Object.entries(byGroup).sort()) {
    indexLines.push(`## ${group.charAt(0).toUpperCase() + group.slice(1)}\n`);
    for (const f of files.sort()) {
        const name = basename(f, '.md');
        indexLines.push(`- [${name}](parts/${f})`);
    }
    indexLines.push('');
}

writeFileSync(join(root, 'docs-sources/developers/code/index.md'), indexLines.join('\n'));
console.log(`jsdoc-build: ${generated.length} file(s) generated in docs-sources/developers/code/parts/`);
