import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function research() {
  console.log('Launching browser to research target game site...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const assetUrls = [];

  page.on('response', async res => {
    const url = res.url();
    const status = res.status();
    const contentType = res.headers()['content-type'] || '';
    
    // Filter out ads/trackers, keep game relevant domain assets
    if (url.includes('online-stopwatch.com') || url.includes('duck') || contentType.includes('image') || contentType.includes('audio') || contentType.includes('javascript') || contentType.includes('json')) {
      assetUrls.push({
        url,
        status,
        contentType
      });
    }
  });

  page.on('console', msg => {
    if (!msg.text().includes('googletag') && !msg.text().includes('prebid')) {
      console.log('PAGE LOG:', msg.type(), msg.text());
    }
  });

  const targetUrl = 'https://www.online-stopwatch.com/duck-race/full-screen/?countdown=00:01:07&characterStyle=0';
  console.log(`Navigating to ${targetUrl}...`);

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('DOM Content Loaded. Waiting 5 seconds for game init...');
  await page.waitForTimeout(5000);

  const title = await page.title();
  console.log('Page Title:', title);

  // Inspect HTML elements (canvases, scripts, audio tags, iframes)
  const info = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({ id: c.id, className: c.className, width: c.width, height: c.height }));
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    const iframes = Array.from(document.querySelectorAll('iframe')).map(f => f.src);

    // Look for global game objects
    const globals = Object.keys(window).filter(k => 
      k.toLowerCase().includes('duck') || 
      k.toLowerCase().includes('race') || 
      k.toLowerCase().includes('game') ||
      k.toLowerCase().includes('timer') ||
      k.toLowerCase().includes('app')
    );

    return { canvases, scripts, iframes, globals };
  });

  console.log('Page Info:', JSON.stringify(info, null, 2));

  fs.writeFileSync('network_research.json', JSON.stringify({ info, assetUrls }, null, 2));
  console.log(`Research complete. Logged ${assetUrls.length} relevant network responses.`);

  await browser.close();
}

research().catch(err => {
  console.error('Research error:', err);
  process.exit(1);
});
