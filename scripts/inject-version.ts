/**
 * Inject version from package.json into all source files
 * Runs during build to ensure single source of truth
 */

import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const version = packageJson.version;

console.log(`📦 Injecting version: ${version}`);

const files = [
  { file: 'src/worker.ts', pattern: /version: '[\d.]+'/g },
  { file: 'src/mcp/mcp-server.ts', pattern: /version: '[\d.]+'/g },
  { file: 'wrangler.toml', pattern: /# Version: [\d.]+/g },
];

let updated = 0;
files.forEach(({ file, pattern }) => {
  if (!fs.existsSync(file)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  const content = fs.readFileSync(file, 'utf-8');
  const newContent = content.replace(pattern, `version: '${version}'`);

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf-8');
    console.log(`✅ Updated: ${file}`);
    updated++;
  } else {
    console.log(`ℹ️  No changes needed: ${file}`);
  }
});

console.log(`✅ Version injection complete: ${updated} files updated`);
