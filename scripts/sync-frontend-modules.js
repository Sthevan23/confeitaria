const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

const root = path.join(__dirname, '..');
const srcRoot = path.join(root, 'frontend', 'src');
const destRoot = path.join(root, 'frontend', 'public', 'js');

for (const folder of ['shared', 'site', 'admin']) {
  copyDir(path.join(srcRoot, folder), path.join(destRoot, folder));
}

console.log('Synced frontend/src → frontend/public/js');
