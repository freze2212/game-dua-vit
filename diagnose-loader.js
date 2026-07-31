import { chromium } from 'playwright';

(async () => {
  console.log('🔍 Diagnosing stuck loader on https://game-dua-vit.vercel.app/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('UNCAUGHT EXCEPTION:', err));

  await page.goto('https://game-dua-vit.vercel.app/', { waitUntil: 'networkidle' });

  await page.waitForTimeout(4000);

  const loaderState = await page.evaluate(() => {
    return {
      hasExportRoot: typeof exportRoot !== 'undefined',
      settingsVisible: typeof exportRoot !== 'undefined' && exportRoot.settings ? exportRoot.settings.visible : null,
      loaderVisible: typeof exportRoot !== 'undefined' && exportRoot.settings && exportRoot.settings.loader ? exportRoot.settings.loader.visible : null,
      htmlLoaderDisplay: document.getElementById('loader') ? document.getElementById('loader').style.display : null
    };
  });

  console.log('LOADER STATE:', JSON.stringify(loaderState, null, 2));

  await browser.close();
})();
