function parseCookies(request) {
  const list = {};
  const rc = request.headers.get('Cookie');
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
  }
  return list;
}

function renderLoginPage() {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đăng Nhập Admin - Cấu Hình Kết Quả Đua Vịt</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
    body {
      margin: 0; padding: 0; min-height: 100vh;
      background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
      display: flex; align-items: center; justify-content: center;
      color: #f8fafc;
    }
    .login-card {
      background: rgba(30, 41, 59, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 40px;
      width: 100%; max-width: 420px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .logo-container { text-align: center; margin-bottom: 24px; }
    .logo-icon { font-size: 48px; display: inline-block; margin-bottom: 8px; }
    h2 { margin: 0 0 6px 0; text-align: center; color: #38bdf8; font-size: 22px; font-weight: 700; }
    p.subtitle { margin: 0 0 24px 0; text-align: center; color: #94a3b8; font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; color: #cbd5e1; font-size: 14px; font-weight: 500; }
    input {
      width: 100%; padding: 12px 16px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid #334155; border-radius: 8px;
      color: white; font-size: 15px; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); }
    button {
      width: 100%; padding: 14px;
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      color: white; border: none; border-radius: 8px;
      font-size: 16px; font-weight: 600; cursor: pointer;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
      transition: transform 0.1s, opacity 0.2s;
    }
    button:hover { opacity: 0.95; }
    .error-msg {
      background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5; padding: 10px; border-radius: 8px; font-size: 13px; margin-bottom: 16px;
      text-align: center; display: none;
    }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="logo-container">
      <div class="logo-icon">🦆</div>
      <h2>TRANG QUẢN TRỊ ADMIN</h2>
      <p class="subtitle">Đăng nhập để cấu hình kết quả đua vịt/ngựa</p>
    </div>
    <div id="errorMsg" class="error-msg"></div>
    <form id="loginForm" onsubmit="handleLogin(event)">
      <div class="form-group">
        <label for="username">Tài khoản Admin</label>
        <input type="text" id="username" placeholder="Nhập tài khoản admin..." required autocomplete="off">
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input type="password" id="password" placeholder="Nhập mật khẩu..." required>
      </div>
      <button type="submit">🔒 Đăng Nhập</button>
    </form>
  </div>
  <script>
    async function handleLogin(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const errBox = document.getElementById('errorMsg');
      errBox.style.display = 'none';

      try {
        const res = await fetch('/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = data.redirect || '/admin/';
        } else {
          errBox.innerText = data.error || 'Đăng nhập thất bại!';
          errBox.style.display = 'block';
        }
      } catch (err) {
        errBox.innerText = 'Lỗi kết nối máy chủ!';
        errBox.style.display = 'block';
      }
    }
  </script>
</body>
</html>`;
}

function renderDashboardPage(winnerOrder) {
  const o = Array.isArray(winnerOrder) ? winnerOrder : [3, 1, 2];
  const s1_1 = o[0] === 1 ? 'selected' : '';
  const s1_2 = o[0] === 2 ? 'selected' : '';
  const s1_3 = o[0] === 3 ? 'selected' : '';

  const s2_1 = o[1] === 1 ? 'selected' : '';
  const s2_2 = o[1] === 2 ? 'selected' : '';
  const s2_3 = o[1] === 3 ? 'selected' : '';

  const s3_1 = o[2] === 1 ? 'selected' : '';
  const s3_2 = o[2] === 2 ? 'selected' : '';
  const s3_3 = o[2] === 3 ? 'selected' : '';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bảng Điều Khiển Admin - Cấu Hình Kết Quả Đua Vịt</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; min-height: 100vh; }
    .top-bar { display: flex; justify-content: space-between; align-items: center; max-width: 800px; margin: 0 auto 20px auto; background: #1e293b; padding: 15px 25px; border-radius: 12px; border: 1px solid #334155; }
    .top-bar h2 { margin: 0; color: #38bdf8; font-size: 20px; display: flex; align-items: center; gap: 10px; }
    .user-actions { display: flex; align-items: center; gap: 12px; }
    .btn-home { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 13px; transition: 0.2s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-home:hover { background: #0369a1; }
    .badge-admin { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .btn-logout { background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; transition: 0.2s; }
    .btn-logout:hover { background: #b91c1c; }
    .card { background: #1e293b; padding: 30px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); max-width: 800px; margin: 0 auto 20px auto; border: 1px solid #334155; }
    .card h3 { margin-top: 0; color: #f8fafc; font-size: 18px; border-bottom: 1px solid #334155; padding-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .local-notice { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
    .form-group { display: flex; gap: 20px; align-items: center; justify-content: center; margin: 25px 0; flex-wrap: wrap; }
    .select-item { display: flex; flex-direction: column; gap: 8px; text-align: left; }
    label { font-weight: 600; color: #cbd5e1; font-size: 14px; }
    select { padding: 12px 18px; border-radius: 8px; background: #0f172a; color: white; border: 1px solid #475569; font-size: 16px; outline: none; cursor: pointer; min-width: 180px; }
    select:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); }
    .btn-primary { background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: white; border: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px; transition: 0.2s; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3); margin-top: 10px; }
    .btn-primary:hover { opacity: 0.95; transform: translateY(-1px); }
    .status { margin-top: 20px; text-align: center; color: #38bdf8; font-weight: 600; font-size: 16px; background: rgba(15, 23, 42, 0.5); padding: 12px; border-radius: 8px; border: 1px solid #334155; }
    .action-row { margin-top: 24px; text-align: center; display: flex; justify-content: center; gap: 15px; }
  </style>
</head>
<body>
  <div class="top-bar">
    <h2>⚙️ ADMIN KẾT QUẢ ĐUA VỊT</h2>
    <div class="user-actions">
      <a href="/" target="_blank" class="btn-home">🏠 Trang Chủ Game</a>
      <span class="badge-admin">👤 Admin</span>
      <form action="/admin/logout" method="POST" style="margin:0;">
        <button type="submit" class="btn-logout">🚪 Đăng xuất</button>
      </form>
    </div>
  </div>

  <div class="card">
    <h3>🎯 Cấu Hình Thứ Hạng Vịt/Ngựa Về Đích</h3>
    <div class="local-notice">
      🔒 <b>Cloudflare Serverless:</b> Cấu hình được đồng bộ trên Cloudflare Edge Network.
    </div>

    <div class="form-group">
      <div class="select-item">
        <label>🥇 Hạng 1 (Winner):</label>
        <select id="p1">
          <option value="1" ${s1_1}>Vịt #1</option>
          <option value="2" ${s1_2}>Vịt #2</option>
          <option value="3" ${s1_3}>Vịt #3</option>
        </select>
      </div>
      <div class="select-item">
        <label>🥈 Hạng 2:</label>
        <select id="p2">
          <option value="1" ${s2_1}>Vịt #1</option>
          <option value="2" ${s2_2}>Vịt #2</option>
          <option value="3" ${s2_3}>Vịt #3</option>
        </select>
      </div>
      <div class="select-item">
        <label>🥉 Hạng 3:</label>
        <select id="p3">
          <option value="1" ${s3_1}>Vịt #1</option>
          <option value="2" ${s3_2}>Vịt #2</option>
          <option value="3" ${s3_3}>Vịt #3</option>
        </select>
      </div>
    </div>

    <div style="text-align: center;">
      <button class="btn-primary" onclick="updateApiConfig()">💾 Lưu Cấu Hình Kết Quả</button>
      <div id="statusMsg" class="status">Cấu hình API hiện tại: Vịt #${o[0]} ➔ Vịt #${o[1]} ➔ Vịt #${o[2]}</div>
    </div>

    <div class="action-row">
      <a href="/" target="_blank" class="btn-home" style="padding: 12px 24px; font-size: 15px;">🕹️ Mở Trang Chủ Đua Vịt Để Test</a>
    </div>
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

      try {
        const res = await fetch('/api/set-winner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ winnerOrder: [p1, p2, p3] })
        });
        const data = await res.json();
        if (data.success) {
          document.getElementById('statusMsg').innerText = '✅ API Cập nhật thành công! Thứ tự set: Vịt #' + p1 + ' ➔ Vịt #' + p2 + ' ➔ Vịt #' + p3;
        } else {
          alert('Lỗi: ' + (data.error || 'Không thể cập nhật cấu hình API!'));
        }
      } catch (err) {
        alert('Lỗi kết nối máy chủ API!');
      }
    }
  </script>
</body>
</html>`;
}

export async function onRequestGet(context) {
  try {
    const cookies = parseCookies(context.request);
    const isAuthenticated = cookies.admin_session === 'valid_admin_token';

    let winnerOrder = [3, 1, 2];
    try {
      if (context.env && context.env.GAME_KV) {
        const stored = await context.env.GAME_KV.get('activeGameConfig');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.winnerOrder)) {
            winnerOrder = parsed.winnerOrder;
          }
        }
      }
    } catch (e) {}

    const html = isAuthenticated ? renderDashboardPage(winnerOrder) : renderLoginPage();

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (err) {
    return new Response(`DEBUG ERROR: ${err.name} - ${err.message}\nStack: ${err.stack}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}