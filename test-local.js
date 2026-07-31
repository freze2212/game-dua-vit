import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('🧪 Testing local http://localhost:3000/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  page.on('console', msg => console.log('LOCAL CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('LOCAL UNCAUGHT:', err));

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  await page.waitForTimeout(3000);

  const screenshotPath = path.resolve('local-screen.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot of local page to:', screenshotPath);

  await browser.close();
})();
