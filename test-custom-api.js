import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function testCustomApi() {
  console.log('===============================================================');
  console.log('🎯 CUSTOM API DUCK RACE OUTCOME VERIFICATION TEST');
  console.log('===============================================================\n');

  const isGui = process.argv.includes('--gui');

  const targetWinnerOrder = [2, 3, 1]; // Duck #2 (1st), Duck #3 (2nd), Duck #1 (3rd)
  console.log(`📡 Sending POST /api/set-winner payload:`, { winnerOrder: targetWinnerOrder });

  try {
    const res = await fetch('http://localhost:3000/api/set-winner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerOrder: targetWinnerOrder })
    });
    const apiData = await res.json();
    console.log(`📩 Server API Response:`, apiData);
  } catch (err) {
    console.error('Failed to reach local server API:', err.message);
  }

  const browser = await chromium.launch({ 
    headless: !isGui,
    slowMo: isGui ? 100 : 0
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`💬 [BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  const gameUrl = 'http://localhost:3000/game?countdown=00:00:05&characterStyle=0';
  console.log(`\n🕹️ Navigating to Local Game URL: ${gameUrl}`);

  await page.goto(gameUrl, { waitUntil: 'domcontentloaded' });
  console.log('⏳ Waiting 4s for ducks to finish initial loading...');
  await page.waitForTimeout(4000);

  console.log('▶️ Dispatching mousedown on Start Button...');
  await page.evaluate(() => {
    if (window.exportRoot && window.exportRoot.timer && window.exportRoot.timer.bStart) {
      window.exportRoot.timer.bStart.dispatchEvent('mousedown');
    }
  });

  console.log('⏳ Waiting 8s for race to finish...');
  await page.waitForTimeout(8000);

  const actualResults = await page.evaluate(() => {
    const results = [];
    const finishOrder = window.finishCharacters || window.lastRaceFinishOrder || [];
    finishOrder.forEach((w, rank) => {
      results.push({
        rank: rank + 1,
        duckNumber: parseInt(w.number || w.id || rank + 1),
        name: w.name || `Duck #${w.number || rank + 1}`
      });
    });
    return results;
  });

  console.log('\n===============================================================');
  console.log('🏁 [TEST RESULTS & LOG COMPARISON]');
  console.log('===============================================================');

  console.log(`\n🎯 EXPECTED API ORDER: Duck #${targetWinnerOrder[0]} ➔ Duck #${targetWinnerOrder[1]} ➔ Duck #${targetWinnerOrder[2]}`);
  console.log('\n📊 ACTUAL GAME PODIUM RESULT:');
  if (actualResults.length > 0) {
    console.table(actualResults);
  }

  const actualOrder = actualResults.map(r => r.duckNumber);
  const matched = JSON.stringify(actualOrder.slice(0, 3)) === JSON.stringify(targetWinnerOrder);

  console.log('---------------------------------------------------------------');
  if (matched) {
    console.log('🎉 ✅ TEST PASSED: Game finished EXACTLY according to the custom API settings!');
    console.log(`   Duck #${targetWinnerOrder[0]} won 1st Place as specified by API.`);
  } else {
    console.log('❌ TEST FAILED: Game finish order differed from API payload!');
  }
  console.log('---------------------------------------------------------------\n');

  if (isGui) {
    console.log('👀 Browser UI window is open for review. Closing in 5 seconds...');
    await page.waitForTimeout(5000);
  }

  await browser.close();
}

testCustomApi().catch(err => {
  console.error('Custom API test error:', err);
  process.exit(1);
});
