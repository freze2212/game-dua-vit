import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching browser verification for https://gameduavit.pages.dev ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  await page.goto('https://gameduavit.pages.dev/', { waitUntil: 'networkidle' });
  console.log('Title:', await page.title());

  // Wait 3 seconds to confirm CreateJS canvas initialization
  await page.waitForTimeout(3000);

  const loaderDisplay = await page.evaluate(() => {
    const el = document.getElementById('loader');
    return el ? el.style.display : 'none';
  });
  console.log('Loader display status:', loaderDisplay);

  const canvasExists = await page.evaluate(() => {
    const c = document.getElementById('canvas');
    return c ? { width: c.width, height: c.height } : null;
  });
  console.log('Canvas dimensions:', canvasExists);

  await browser.close();
  console.log('✅ Verification completed!');
})();
