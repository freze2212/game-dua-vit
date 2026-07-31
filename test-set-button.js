import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('🧪 Testing Set button on https://game-dua-vit.vercel.app/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('UNCAUGHT:', err));

  await page.goto('https://game-dua-vit.vercel.app/', { waitUntil: 'networkidle' });

  await page.waitForTimeout(3000);

  // Trigger settings complete (simulating clicking Set button)
  await page.evaluate(() => {
    if (typeof settings !== 'undefined' && settings.dispatchEvent) {
      settings.dispatchEvent({
        type: 'complete',
        data: {
          clock: { time: '12:00', ampm: 'AM' },
          timerMilliseconds: 10000,
          characterNum: 5,
          showNumbers: false,
          characterStyle: 0,
          display: 'MM:SS',
          isLogoVisible: false,
          list: ['Aaron', 'George', 'Rozalyn', 'Ilia', 'Rory']
        }
      });
    }
  });

  await page.waitForTimeout(2000);

  const screenshotPath = path.resolve('duck-race-after-set.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot after Set button click to:', screenshotPath);

  const loaderState = await page.evaluate(() => {
    return {
      settingsVisible: typeof exportRoot !== 'undefined' && exportRoot.settings ? exportRoot.settings.visible : null,
      loaderVisible: typeof exportRoot !== 'undefined' && exportRoot.settings && exportRoot.settings.loader ? exportRoot.settings.loader.visible : null
    };
  });
  console.log('LOADER STATE AFTER SET:', JSON.stringify(loaderState, null, 2));

  await browser.close();
})();
