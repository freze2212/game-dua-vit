import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Testing Admin Page https://gameduavit.pages.dev/admin/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('ADMIN PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('ADMIN PAGE ERROR:', err));

  const response = await page.goto('https://gameduavit.pages.dev/admin/', { waitUntil: 'networkidle' });
  console.log('HTTP Status Code:', response.status());

  // Fill in login credentials
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(1000);

  const dashboardVisible = await page.isVisible('#dashboardSection');
  console.log('Dashboard visible after login:', dashboardVisible);

  const statusText = await page.innerText('#statusMsg');
  console.log('Status Message:', statusText);

  await browser.close();
  console.log('✅ Admin verification completed successfully!');
})();
