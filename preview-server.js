import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 6033;
const ASSETS_DIR = path.resolve('assets');

// In-memory custom API state
let activeGameConfig = {
  winnerOrder: [3, 1, 2], // Default: Duck #3 wins 1st, Duck #1 2nd, Duck #2 3rd
  updatedAt: new Date().toISOString()
};

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // 1. API Endpoint: GET /api/game-config
  if (reqUrl === '/api/game-config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(activeGameConfig));
  }

  // 2. API Endpoint: POST /api/set-winner
  if (reqUrl === '/api/set-winner' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (payload.winnerOrder && Array.isArray(payload.winnerOrder)) {
          activeGameConfig.winnerOrder = payload.winnerOrder.map(n => parseInt(n));
          activeGameConfig.updatedAt = new Date().toISOString();
          console.log(`🎯 [API UPDATED] New Winner Order set to:`, activeGameConfig.winnerOrder);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, config: activeGameConfig }));
        }
      } catch (err) { }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid payload' }));
    });
    return;
  }

  // 3. Embedded Control Panel Page: GET /
  if (reqUrl === '/') {
    const dashboardHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Bảng Điều Khiển API Đua Vịt - Custom API Control</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { margin: 0; color: #38bdf8; }
    .header p { color: #94a3b8; }
    .card { background: #1e293b; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); max-width: 900px; margin: 0 auto 20px auto; border: 1px solid #334155; }
    .form-group { display: flex; gap: 15px; align-items: center; justify-content: center; margin: 15px 0; }
    label { font-weight: bold; color: #e2e8f0; }
    select { padding: 8px 16px; border-radius: 6px; background: #334155; color: white; border: 1px solid #475569; font-size: 1rem; }
    button { background: #0284c7; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1rem; transition: 0.2s; }
    button:hover { background: #0369a1; }
    .status { margin-top: 10px; text-align: center; color: #4ade80; font-weight: bold; }
    .game-container { max-width: 1000px; margin: 0 auto; background: #000; border-radius: 12px; overflow: hidden; border: 2px solid #38bdf8; height: 600px; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🦆 Bảng Điều Khiển API Đua Vịt</h1>
    <p>Thiết lập kết quả cuộc đua qua API & kiểm tra game chạy trực tiếp</p>
  </div>

  <div class="card">
    <h3>⚙️ Cấu hình Thứ Hạng Vịt về đích (API Control Payload):</h3>
    <div class="form-group">
      <div>
        <label>🥇 Hạng 1 (Winner):</label>
        <select id="p1">
          <option value="1">Vịt #1</option>
          <option value="2">Vịt #2</option>
          <option value="3" selected>Vịt #3</option>
        </select>
      </div>
      <div>
        <label>🥈 Hạng 2:</label>
        <select id="p2">
          <option value="1" selected>Vịt #1</option>
          <option value="2">Vịt #2</option>
          <option value="3">Vịt #3</option>
        </select>
      </div>
      <div>
        <label>🥉 Hạng 3:</label>
        <select id="p3">
          <option value="1">Vịt #1</option>
          <option value="2" selected>Vịt #2</option>
          <option value="3">Vịt #3</option>
        </select>
      </div>
    </div>
    <div style="text-align: center;">
      <button onclick="updateApiConfig()">💾 Lưu Cấu Hình API & Reset Game</button>
      <div id="statusMsg" class="status">Cấu hình API hiện tại: Vịt #3 -> Vịt #1 -> Vịt #2</div>
    </div>
  </div>

  <div class="game-container">
    <iframe id="gameFrame" src="/game"></iframe>
  </div>

  <script>
    async function updateApiConfig() {
      const p1 = parseInt(document.getElementById('p1').value);
      const p2 = parseInt(document.getElementById('p2').value);
      const p3 = parseInt(document.getElementById('p3').value);

      if (new Set([p1, p2, p3]).size !== 3) {
        alert('Vui lòng chọn 3 con vịt khác nhau cho các vị trí hạng 1, 2, 3!');
        return;
      }

      const res = await fetch('/api/set-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerOrder: [p1, p2, p3] })
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('statusMsg').innerText = '✅ API Cập nhật thành công! Thứ tự API set: Vịt #' + p1 + ' ➔ Vịt #' + p2 + ' ➔ Vịt #' + p3;
        // Reload game iframe to apply new API
        document.getElementById('gameFrame').src = '/game?t=' + Date.now();
      }
    }
  </script>
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(dashboardHtml);
  }

  // 4. Game Iframe Page: GET /game
  if (reqUrl === '/game') {
    const htmlPath = path.join(ASSETS_DIR, 'html', 'duck-race-1000.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(htmlPath));
    }
  }

  // 5. Serve static files from subfolders
  const filename = path.basename(reqUrl);
  const ext = path.extname(filename).toLowerCase();

  let targetFile = null;
  const searchFolders = ['js', 'css', 'audio', 'images', 'json', 'html'];
  for (const folder of searchFolders) {
    const candidate = path.join(ASSETS_DIR, folder, filename);
    if (fs.existsSync(candidate)) {
      targetFile = candidate;
      break;
    }
  }

  if (!targetFile) {
    for (const folder of searchFolders) {
      const folderPath = path.join(ASSETS_DIR, folder);
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        const matched = files.find(f => f.startsWith(path.parse(filename).name));
        if (matched) {
          targetFile = path.join(folderPath, matched);
          break;
        }
      }
    }
  }

  if (targetFile && fs.existsSync(targetFile)) {
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return res.end(fs.readFileSync(targetFile));
  }

  // Fallback server.php
  if (reqUrl.includes('server.php') || reqUrl.includes('pchk.php')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ answer: 'correct', status: 'ok' }));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`\n===============================================================`);
  console.log(`🦆 DUCK RACE CUSTOM API CONTROL SERVER IS RUNNING!`);
  console.log(`🌐 Control Panel & Game: http://localhost:${PORT}`);
  console.log(`📡 API Config Endpoint: http://localhost:${PORT}/api/game-config`);
  console.log(`===============================================================\n`);
});
