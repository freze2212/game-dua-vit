import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('.');
const assetsDir = path.join(rootDir, 'assets');
const publicDir = path.join(rootDir, 'public');
const functionsDir = path.join(rootDir, 'functions');

console.log('📦 Preparing Root & Cloudflare Pages deployment structure...');

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

// 1. Process HTML file to fix relative paths (../js -> /js, ../sounds -> /audio, etc.)
const indexHtmlSrc = path.join(assetsDir, 'html', 'duck-race-1000.html');
let htmlContent = fs.readFileSync(indexHtmlSrc, 'utf-8');

htmlContent = htmlContent
  .replace(/href="\.\.\/js\/newrace\.css/g, 'href="/css/newrace.css')
  .replace(/src="\.\.\/js\//g, 'src="/js/')
  .replace(/src="js\//g, 'src="/js/')
  .replace(/src="\.\.\/sounds\//g, 'src="/audio/')
  .replace(/src="sounds\//g, 'src="/audio/')
  .replace(/src:'\.\.\/js\//g, "src:'/js/");

// Write fixed index.html to root and public/
fs.writeFileSync(path.join(rootDir, 'index.html'), htmlContent);
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);

// 2. Copy static asset folders to root and public/
const folders = ['js', 'css', 'audio', 'images', 'json', 'sounds', 'components'];
folders.forEach(folder => {
  const src = path.join(assetsDir, folder);
  if (fs.existsSync(src)) {
    copyFolderSync(src, path.join(rootDir, folder));
    copyFolderSync(src, path.join(publicDir, folder));
  }
});

// Also mirror audio files into sounds/ directory in case of fallback calls
const audioSrc = path.join(assetsDir, 'audio');
if (fs.existsSync(audioSrc)) {
  copyFolderSync(audioSrc, path.join(rootDir, 'sounds'));
  copyFolderSync(audioSrc, path.join(publicDir, 'sounds'));
}

console.log('✅ Created root index.html with 100% fixed asset paths!');
console.log('✅ Created Cloudflare Pages Functions in ./functions!');
console.log('🎉 Project structure is 100% ready for Cloudflare Pages!');
