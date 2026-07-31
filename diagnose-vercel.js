import { chromium } from 'playwright';

(async () => {
  console.log('🔍 Diagnosing https://game-dua-vit.vercel.app/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER UNCAUGHT EXCEPTION:', err));
  page.on('requestfailed', req => console.error('FAILED REQUEST:', req.url(), req.failure().errorText));

  await page.goto('https://game-dua-vit.vercel.app/', { waitUntil: 'networkidle' });

  await page.waitForTimeout(5000);

  const loaderText = await page.evaluate(() => {
    const el = document.getElementById('loader');
    return el ? el.innerText : 'NO LOADER EL';
  });
  console.log('CURRENT LOADER TEXT:', loaderText);

  await browser.close();
  console.log('Done diagnosis!');
})();
