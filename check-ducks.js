import { chromium } from 'playwright';

(async () => {
  console.log('🔍 Checking ducks on https://game-dua-vit.vercel.app/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('UNCAUGHT:', err));

  await page.goto('https://game-dua-vit.vercel.app/', { waitUntil: 'networkidle' });

  await page.waitForTimeout(5000);

  const state = await page.evaluate(() => {
    return {
      hasExportRoot: typeof exportRoot !== 'undefined',
      exportRootChildren: (typeof exportRoot !== 'undefined' && exportRoot.children) ? exportRoot.children.length : 0,
      charactersNum: typeof charactersNum !== 'undefined' ? charactersNum : null,
      coreData: typeof coreData !== 'undefined' ? coreData : null,
      hasStage: typeof stage !== 'undefined'
    };
  });
  console.log('GAME STATE:', JSON.stringify(state, null, 2));

  await browser.close();
})();
