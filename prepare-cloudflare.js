import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('.');
const assetsDir = path.join(rootDir, 'assets');
const publicDir = path.join(rootDir, 'public');
const functionsDir = path.join(rootDir, 'functions');

console.log('📦 Syncing all HTML files across repository...');

const htmlContent = fs.readFileSync(path.join(assetsDir, 'html', 'duck-race-1000.html'), 'utf-8');

fs.writeFileSync(path.join(rootDir, 'index.html'), htmlContent);
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);

// Copy static asset folders
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.statSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

const folders = ['js', 'css', 'audio', 'images', 'json', 'sounds', 'components'];
folders.forEach(folder => {
  const src = path.join(assetsDir, folder);
  if (fs.existsSync(src)) {
    copyFolderSync(src, path.join(rootDir, folder));
    copyFolderSync(src, path.join(publicDir, folder));
  }
});

console.log('✅ Synced all HTML & static asset files everywhere!');
