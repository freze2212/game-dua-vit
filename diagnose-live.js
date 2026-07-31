import { chromium } from 'playwright';

async function diagnose() {
  console.log('🔍 Diagnosing Live Site: https://gameduavit.pages.dev/...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`💬 [CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`💥 [UNCAUGHT PAGE ERROR] ${err.message}\n${err.stack}`);
  });

  page.on('requestfailed', req => {
    console.error(`❌ [REQUEST FAILED] ${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.error(`⚠️ [HTTP ${res.status()}] ${res.url()}`);
    }
  });

  await page.goto('https://gameduavit.pages.dev/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  await browser.close();
}

diagnose().catch(console.error);
