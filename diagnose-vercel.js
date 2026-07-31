import { chromium } from 'playwright';

(async () => {
  console.log('🔍 Diagnosing https://game-dua-vit.vercel.app/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER UNCAUGHT EXCEPTION:', err));

  await page.goto('https://game-dua-vit.vercel.app/', { waitUntil: 'networkidle' });

  await page.waitForTimeout(5000);

  const loaderDisplay = await page.evaluate(() => {
    const el = document.getElementById('loader');
    return el ? getComputedStyle(el).display : 'NO LOADER';
  });
  console.log('LOADER DISPLAY STYLE:', loaderDisplay);

  const canvasStyle = await page.evaluate(() => {
    const c = document.getElementById('canvas');
    return c ? { display: getComputedStyle(c).display, width: c.width, height: c.height } : 'NO CANVAS';
  });
  console.log('CANVAS STYLE & SIZE:', canvasStyle);

  await browser.close();
  console.log('Done diagnosis!');
})();
