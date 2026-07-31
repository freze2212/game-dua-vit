function parseCookies(request) {
  const list = {};
  try {
    const rc = request.headers.get('Cookie') || request.headers.get('cookie');
    if (rc) {
      const pairs = rc.split(';');
      for (let i = 0; i < pairs.length; i++) {
        const parts = pairs[i].split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim();
          try {
            list[key] = decodeURIComponent(val);
          } catch (e) {
            list[key] = val;
          }
        }
      }
    }
  } catch (e) {}
  return list;
}

function getLoginHtml() {
  return '<!DOCTYPE html>' +
'<html lang="vi">' +
'<head>' +
'<meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'<title>Đăng Nhập Admin - Cấu Hình Kết Quả Đua Vịt</title>' +
'<style>' +
'* { box-sizing: border-box; font-family: "Inter", sans-serif; }' +
'body { margin: 0; padding: 0; min-height: 100vh; background: radial-gradient(circle at top right, #1e1b4b, #0f172a); display: flex; align-items: center; justify-content: center; color: #f8fafc; }' +
'.login-card { background: rgba(30, 41, 59, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); }' +
'.logo-container { text-align: center; margin-bottom: 24px; }' +
'.logo-icon { font-size: 48px; display: inline-block; margin-bottom: 8px; }' +
'h2 { margin: 0 0 6px 0; text-align: center; color: #38bdf8; font-size: 22px; font-weight: 700; }' +
'p.subtitle { margin: 0 0 24px 0; text-align: center; color: #94a3b8; font-size: 14px; }' +
'.form-group { margin-bottom: 20px; }' +
'label { display: block; margin-bottom: 8px; color: #cbd5e1; font-size: 14px; font-weight: 500; }' +
'input { width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 8px; color: white; font-size: 15px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }' +
'input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); }' +
'button { width: 100%; padding: 14px; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); transition: transform 0.1s, opacity 0.2s; }' +
'button:hover { opacity: 0.95; }' +
'.error-msg { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; padding: 10px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; text-align: center; display: none; }' +
'</style>' +
'</head>' +
'<body>' +
'<div class="login-card">' +
'<div class="logo-container"><div class="logo-icon">&#129414;</div><h2>TRANG QUẢN TRỊ ADMIN</h2><p class="subtitle">Đăng nhập để cấu hình kết quả đua vịt/ngựa</p></div>' +
'<div id="errorMsg" class="error-msg"></div>' +
'<form id="loginForm" onsubmit="handleLogin(event)">' +
'<div class="form-group"><label for="username">Tài khoản Admin</label><input type="text" id="username" placeholder="Nhập tài khoản admin..." required autocomplete="off"></div>' +
'<div class="form-group"><label for="password">Mật khẩu</label><input type="password" id="password" placeholder="Nhập mật khẩu..." required></div>' +
'<button type="submit">&#128274; Đăng Nhập</button>' +
'</form>' +
'</div>' +
'<script>' +
'async function handleLogin(e){e.preventDefault();const username=document.getElementById("username").value.trim();const password=document.getElementById("password").value.trim();const errBox=document.getElementById("errorMsg");errBox.style.display="none";try{const res=await fetch("/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});const data=await res.json();if(data.success){window.location.href=data.redirect||"/admin/";}else{errBox.innerText=data.error||"Đăng nhập thất bại!";errBox.style.display="block";}}catch(err){errBox.innerText="Lỗi kết nối máy chủ!";errBox.style.display="block";}}' +
'</script>' +
'</body>' +
'</html>';
}

function getDashboardHtml(w1, w2, w3) {
  return '<!DOCTYPE html>' +
'<html lang="vi">' +
'<head>' +
'<meta charset="UTF-8">' +
'<title>Admin Dashboard</title>' +
'</head>' +
'<body>' +
'<h2>ADMIN DASHBOARD OK</h2>' +
'<p>Winner 1: ' + w1 + '</p>' +
'<p>Winner 2: ' + w2 + '</p>' +
'<p>Winner 3: ' + w3 + '</p>' +
'</body>' +
'</html>';
}

export async function onRequest(context) {
  try {
    let isAuthenticated = false;
    try {
      const cookies = parseCookies(context.request);
      isAuthenticated = cookies && cookies.admin_session === 'valid_admin_token';
    } catch (e) {}

    let w1 = 3, w2 = 1, w3 = 2;

    const html = isAuthenticated ? getDashboardHtml(w1, w2, w3) : getLoginHtml();
    const encoder = new TextEncoder();
    const bytes = encoder.encode(html);

    return new Response(bytes, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (err) {
    const encoder = new TextEncoder();
    return new Response(encoder.encode(getLoginHtml()), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}