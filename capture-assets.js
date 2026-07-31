import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve('assets');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function captureAssets() {
  console.log('🚀 Starting Playwright Duck Race Asset & API Capture...');

  ensureDir(ASSETS_DIR);
  ensureDir(path.join(ASSETS_DIR, 'images'));
  ensureDir(path.join(ASSETS_DIR, 'audio'));
  ensureDir(path.join(ASSETS_DIR, 'js'));
  ensureDir(path.join(ASSETS_DIR, 'css'));
  ensureDir(path.join(ASSETS_DIR, 'json'));
  ensureDir(path.join(ASSETS_DIR, 'html'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const capturedManifest = [];

  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    const contentType = response.headers()['content-type'] || '';

    if (status !== 200) return;
    if (url.includes('doubleclick') || url.includes('google-analytics') || url.includes('fuseplatform') || url.includes('intentiq') || url.includes('amazon-adsystem') || url.includes('rubiconproject') || url.includes('smartadserver') || url.includes('btloader') || url.includes('publift')) {
      return;
    }

    try {
      const buffer = await response.body().catch(() => null);
      if (!buffer || buffer.length === 0) return;

      const parsedUrl = new URL(url);
      let pathname = parsedUrl.pathname;
      let filename = path.basename(pathname);

      if (!filename || filename === '/' || filename.includes('full-screen')) {
        filename = 'index.html';
      }

      filename = filename.split('?')[0];
      const ext = path.extname(filename).toLowerCase();

      let subDir = 'other';
      if (contentType.includes('image') || ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        subDir = 'images';
      } else if (contentType.includes('audio') || ['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
        subDir = 'audio';
      } else if (contentType.includes('javascript') || ext === '.js') {
        subDir = 'js';
      } else if (contentType.includes('css') || ext === '.css') {
        subDir = 'css';
      } else if (contentType.includes('json') || ext === '.json') {
        subDir = 'json';
      } else if (contentType.includes('html') || ext === '.html' || ext === '') {
        subDir = 'html';
        if (!filename.endsWith('.html')) filename += '.html';
      }

      let targetPath = path.join(ASSETS_DIR, subDir, filename);
      if (fs.existsSync(targetPath) && filename !== 'index.html') {
        const hashStr = Math.abs(hashCode(url)).toString(16);
        targetPath = path.join(ASSETS_DIR, subDir, `${path.parse(filename).name}_${hashStr}${path.parse(filename).ext || ''}`);
      }

      fs.writeFileSync(targetPath, buffer);
      console.log(`[SAVED] [${subDir.toUpperCase()}] ${path.basename(targetPath)} (${buffer.length} bytes) <- ${url}`);

      capturedManifest.push({
        url,
        type: subDir,
        localPath: targetPath,
        size: buffer.length
      });
    } catch (err) {
      // Ignore individual response errors
    }
  });

  // Direct game frame URL
  const gameFrameUrl = 'https://www.online-stopwatch.com/html5/race-timers-2025/duck-race-1000/?countdown=00:01:07&characterStyle=0';
  console.log(`Navigating to Duck Race game frame: ${gameFrameUrl}`);

  await page.goto(gameFrameUrl, { waitUntil: 'domcontentloaded' });
  console.log('Page loaded. Waiting for game assets and audio/sprites to load...');
  await page.waitForTimeout(10000);

  // Extract game JS logic variables and config from window object
  const gameDetails = await page.evaluate(() => {
    const info = {};
    if (window.exportRoot) {
      info.exportRootProperties = Object.keys(window.exportRoot);
    }
    if (window.images) {
      info.loadedImages = Object.keys(window.images);
    }
    if (window.createjs) {
      info.createjsVersion = window.createjs.Sound ? 'Sound Loaded' : 'Sound Not Loaded';
    }
    // Inspect local storage or config parameters
    info.locationSearch = window.location.search;
    return info;
  });

  console.log('🎮 Duck Race Internal Details:', JSON.stringify(gameDetails, null, 2));
  fs.writeFileSync(path.join(ASSETS_DIR, 'json', 'game_details.json'), JSON.stringify(gameDetails, null, 2));

  fs.writeFileSync(path.join(ASSETS_DIR, 'json', 'assets_manifest.json'), JSON.stringify(capturedManifest, null, 2));
  console.log(`✅ Capture Complete! Total assets saved: ${capturedManifest.length}`);

  await browser.close();
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

captureAssets().catch(err => {
  console.error('Capture process failed:', err);
  process.exit(1);
});
