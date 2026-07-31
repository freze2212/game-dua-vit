import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('📸 Taking screenshot of https://game-dua-vit.vercel.app/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto('https://game-dua-vit.vercel.app/', { waitUntil: 'networkidle' });

  // Wait 3 seconds for animation
  await page.waitForTimeout(3000);

  const screenshotPath = path.resolve('duck-game-screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
})();
