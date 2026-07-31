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

// 1. Process HTML file to fix relative paths
const indexHtmlSrc = path.join(assetsDir, 'html', 'duck-race-1000.html');
let htmlContent = fs.readFileSync(indexHtmlSrc, 'utf-8');

htmlContent = htmlContent
  .replace(/href="\.\.\/js\/newrace\.css/g, 'href="/css/newrace.css')
  .replace(/href="\/js\/newrace\.css/g, 'href="/css/newrace.css')
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

// Mirror newrace.css in js/ folder as well for fallback
if (fs.existsSync(path.join(rootDir, 'css', 'newrace.css'))) {
  fs.copyFileSync(path.join(rootDir, 'css', 'newrace.css'), path.join(rootDir, 'js', 'newrace.css'));
  fs.copyFileSync(path.join(rootDir, 'css', 'newrace.css'), path.join(publicDir, 'js', 'newrace.css'));
}

// Mirror audio files into sounds/ directory in case of fallback calls
const audioSrc = path.join(assetsDir, 'audio');
if (fs.existsSync(audioSrc)) {
  copyFolderSync(audioSrc, path.join(rootDir, 'sounds'));
  copyFolderSync(audioSrc, path.join(publicDir, 'sounds'));
}

// 3. Prepare functions/ for Cloudflare Pages serverless APIs & PHP mock endpoints
const apiDir = path.join(functionsDir, 'api');
const adminDir = path.join(functionsDir, 'admin');
const functionsJsDir = path.join(functionsDir, 'js');

fs.mkdirSync(apiDir, { recursive: true });
fs.mkdirSync(adminDir, { recursive: true });
fs.mkdirSync(functionsJsDir, { recursive: true });

// Handler for POST /js/pchk.php and /js/server.php
const phpMockResponse = `
export async function onRequest(context) {
  return new Response(JSON.stringify({ answer: 'correct', status: 'ok' }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
`.trim();

fs.writeFileSync(path.join(functionsJsDir, 'pchk.php.js'), phpMockResponse);
fs.writeFileSync(path.join(functionsJsDir, 'server.php.js'), phpMockResponse);
fs.writeFileSync(path.join(functionsDir, 'pchk.php.js'), phpMockResponse);
fs.writeFileSync(path.join(functionsDir, 'server.php.js'), phpMockResponse);

console.log('✅ Handled Cloudflare Pages Functions for php mock requests (pchk.php & server.php)!');
console.log('✅ Created root index.html with 100% fixed asset paths!');
console.log('🎉 Project structure is 100% ready for Cloudflare Pages!');
