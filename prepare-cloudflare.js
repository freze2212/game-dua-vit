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

// 1. Copy duck-race-1000.html to root index.html and public/index.html
const indexHtmlSrc = path.join(assetsDir, 'html', 'duck-race-1000.html');
if (fs.existsSync(indexHtmlSrc)) {
  fs.copyFileSync(indexHtmlSrc, path.join(rootDir, 'index.html'));
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(indexHtmlSrc, path.join(publicDir, 'index.html'));
}

// 2. Copy static asset folders to root and public/
const folders = ['js', 'css', 'audio', 'images', 'json', 'sounds', 'components'];
folders.forEach(folder => {
  const src = path.join(assetsDir, folder);
  if (fs.existsSync(src)) {
    copyFolderSync(src, path.join(rootDir, folder));
    copyFolderSync(src, path.join(publicDir, folder));
  }
});

// 3. Prepare functions/ for Cloudflare Pages serverless APIs
const apiDir = path.join(functionsDir, 'api');
const adminDir = path.join(functionsDir, 'admin');
fs.mkdirSync(apiDir, { recursive: true });
fs.mkdirSync(adminDir, { recursive: true });

// Write functions/api/game-config.js
fs.writeFileSync(path.join(apiDir, 'game-config.js'), `
export async function onRequestGet(context) {
  let config = { winnerOrder: [3, 1, 2], updatedAt: new Date().toISOString() };
  try {
    if (context.env && context.env.GAME_KV) {
      const stored = await context.env.GAME_KV.get('activeGameConfig');
      if (stored) config = JSON.parse(stored);
    }
  } catch (e) {}

  return new Response(JSON.stringify(config), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
`.trim());

// Write functions/api/set-winner.js
fs.writeFileSync(path.join(apiDir, 'set-winner.js'), `
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    if (body.winnerOrder && Array.isArray(body.winnerOrder)) {
      const config = {
        winnerOrder: body.winnerOrder.map(n => parseInt(n)),
        updatedAt: new Date().toISOString()
      };
      if (context.env && context.env.GAME_KV) {
        await context.env.GAME_KV.put('activeGameConfig', JSON.stringify(config));
      }
      return new Response(JSON.stringify({ success: true, config }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {}

  return new Response(JSON.stringify({ error: 'Payload không hợp lệ' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
`.trim());

console.log('✅ Created root index.html and asset folders!');
console.log('✅ Created Cloudflare Pages Functions in ./functions!');
console.log('🎉 Project structure is 100% ready for Cloudflare Pages!');
