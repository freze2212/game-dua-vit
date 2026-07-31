import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('🧪 Testing timer bStart click on http://localhost:3000/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  await page.waitForTimeout(1000);

  // Click Start button on timer
  await page.evaluate(() => {
    if (typeof exportRoot !== 'undefined' && exportRoot.timer && exportRoot.timer.bStart) {
      exportRoot.timer.bStart.dispatchEvent('mousedown');
    }
  });

  await page.waitForTimeout(2000);

  const screenshotPath = path.resolve('timer-start-click-screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
})();
