function parseCookies(request) {
  const list = {};
  const rc = request.headers.get('Cookie');
  if (rc) {
    const pairs = rc.split(';');
    for (let i = 0; i < pairs.length; i++) {
      const parts = pairs[i].split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      list[key] = decodeURIComponent(val);
    }
  }
  return list;
}

function getLoginHtml() {
  return '<!DOCTYPE html>' +
'<html lang="vi">' +
'<head>' +
'<meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'<title>Admin Login - Duck Race</title>' +
'<style>' +
'body{margin:0;padding:0;min-height:100vh;background:#0f172a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;}' +
'.card{background:#1e293b;padding:40px;border-radius:12px;width:100%;max-width:400px;box-shadow:0 10px 25px rgba(0,0,0,0.5);border:1px solid #334155;}' +
'h2{margin:0 0 10px 0;color:#38bdf8;text-align:center;}' +
'p{margin:0 0 20px 0;color:#94a3b8;text-align:center;font-size:14px;}' +
'.form-group{margin-bottom:15px;}' +
'label{display:block;margin-bottom:5px;font-size:14px;color:#cbd5e1;}' +
'input{width:100%;padding:10px;border-radius:6px;background:#0f172a;border:1px solid #475569;color:#fff;box-sizing:border-box;}' +
'button{width:100%;padding:12px;background:#0284c7;color:#fff;border:none;border-radius:6px;font-weight:bold;cursor:pointer;font-size:16px;margin-top:10px;}' +
'.error{background:rgba(239,68,68,0.2);border:1px solid #ef4444;color:#fca5a5;padding:8px;border-radius:6px;margin-bottom:15px;display:none;text-align:center;font-size:13px;}' +
'</style>' +
'</head>' +
'<body>' +
'<div class="card">' +
'<h2>🦆 ADMIN LOGIN</h2>' +
'<p>Đăng nhập để cấu hình kết quả đua vịt</p>' +
'<div id="err" class="error"></div>' +
'<form onsubmit="doLogin(event)">' +
'<div class="form-group"><label>Tài khoản</label><input type="text" id="u" required></div>' +
'<div class="form-group"><label>Mật khẩu</label><input type="password" id="p" required></div>' +
'<button type="submit">🔒 Đăng Nhập</button>' +
'</form>' +
'</div>' +
'<script>' +
'async function doLogin(e){e.preventDefault();const u=document.getElementById("u").value,p=document.getElementById("p").value,err=document.getElementById("err");err.style.display="none";try{const r=await fetch("/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u,password:p})}),d=await r.json();if(d.success){window.location.href="/admin/";}else{err.innerText=d.error||"Thất bại";err.style.display="block";}}catch(x){err.innerText="Lỗi kết nối";err.style.display="block";}}' +
'</script>' +
'</body>' +
'</html>';
}

function getDashboardHtml(w1, w2, w3) {
  return '<!DOCTYPE html>' +
'<html lang="vi">' +
'<head>' +
'<meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'<title>Admin Dashboard - Duck Race</title>' +
'<style>' +
'body{margin:0;padding:20px;background:#0f172a;color:#fff;font-family:sans-serif;}' +
'.top{display:flex;justify-content:space-between;align-items:center;max-width:800px;margin:0 auto 20px auto;background:#1e293b;padding:15px 20px;border-radius:10px;border:1px solid #334155;}' +
'h2{margin:0;color:#38bdf8;font-size:20px;}' +
'.btn{background:#dc2626;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;}' +
'.home-btn{background:#0284c7;color:#fff;text-decoration:none;padding:8px 16px;border-radius:6px;font-weight:bold;font-size:13px;}' +
'.card{background:#1e293b;padding:25px;border-radius:12px;max-width:800px;margin:0 auto;border:1px solid #334155;}' +
'.group{display:flex;gap:15px;justify-content:center;margin:20px 0;flex-wrap:wrap;}' +
'select{padding:10px 15px;border-radius:6px;background:#0f172a;color:#fff;border:1px solid #475569;font-size:15px;min-width:150px;}' +
'.save-btn{background:#0284c7;color:#fff;border:none;padding:12px 30px;border-radius:6px;font-size:16px;font-weight:bold;cursor:pointer;}' +
'.status{margin-top:15px;text-align:center;color:#38bdf8;font-weight:bold;}' +
'</style>' +
'</head>' +
'<body>' +
'<div class="top">' +
'<h2>⚙️ ADMIN KẾT QUẢ ĐUA VỊT</h2>' +
'<div>' +
'<a href="/" target="_blank" class="home-btn" style="margin-right:10px;">🏠 Trang Chủ Game</a>' +
'<form action="/admin/logout" method="POST" style="display:inline;"><button type="submit" class="btn">🚪 Đăng xuất</button></form>' +
'</div>' +
'</div>' +
'<div class="card">' +
'<h3>🎯 Cấu Hình Thứ Hạng Vịt Về Đích</h3>' +
'<div class="group">' +
'<div><label>🥇 Hạng 1:</label><br><select id="p1">' +
'<option value="1"' + (w1===1?' selected':'') + '>Vịt #1</option>' +
'<option value="2"' + (w1===2?' selected':'') + '>Vịt #2</option>' +
'<option value="3"' + (w1===3?' selected':'') + '>Vịt #3</option>' +
'</select></div>' +
'<div><label>🥈 Hạng 2:</label><br><select id="p2">' +
'<option value="1"' + (w2===1?' selected':'') + '>Vịt #1</option>' +
'<option value="2"' + (w2===2?' selected':'') + '>Vịt #2</option>' +
'<option value="3"' + (w2===3?' selected':'') + '>Vịt #3</option>' +
'</select></div>' +
'<div><label>🥉 Hạng 3:</label><br><select id="p3">' +
'<option value="1"' + (w3===1?' selected':'') + '>Vịt #1</option>' +
'<option value="2"' + (w3===2?' selected':'') + '>Vịt #2</option>' +
'<option value="3"' + (w3===3?' selected':'') + '>Vịt #3</option>' +
'</select></div>' +
'</div>' +
'<div style="text-align:center;">' +
'<button onclick="saveConfig()" class="save-btn">💾 Lưu Cấu Hình Kết Quả</button>' +
'<div id="st" class="status">Cấu hình API hiện tại: Vịt #' + w1 + ' ➔ Vịt #' + w2 + ' ➔ Vịt #' + w3 + '</div>' +
'</div>' +
'</div>' +
'<script>' +
'async function saveConfig(){const p1=parseInt(document.getElementById("p1").value),p2=parseInt(document.getElementById("p2").value),p3=parseInt(document.getElementById("p3").value);if(new Set([p1,p2,p3]).size!==3){alert("Chọn 3 vịt khác nhau!");return;}try{const r=await fetch("/api/set-winner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({winnerOrder:[p1,p2,p3]})}),d=await r.json();if(d.success){document.getElementById("st").innerText="✅ API cập nhật thành công! Vịt #"+p1+" ➔ Vịt #"+p2+" ➔ Vịt #"+p3;}else{alert(d.error||"Lỗi");}}catch(x){alert("Lỗi kết nối API");}}' +
'</script>' +
'</body>' +
'</html>';
}

export async function onRequestGet(context) {
  try {
    const cookies = parseCookies(context.request);
    const isAuthenticated = cookies.admin_session === 'valid_admin_token';

    let w1 = 3, w2 = 1, w3 = 2;
    try {
      if (context.env && context.env.GAME_KV) {
        const stored = await context.env.GAME_KV.get('activeGameConfig');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.winnerOrder) && parsed.winnerOrder.length >= 3) {
            w1 = parseInt(parsed.winnerOrder[0]) || 3;
            w2 = parseInt(parsed.winnerOrder[1]) || 1;
            w3 = parseInt(parsed.winnerOrder[2]) || 2;
          }
        }
      }
    } catch (e) {}

    const html = isAuthenticated ? getDashboardHtml(w1, w2, w3) : getLoginHtml();

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (err) {
    return new Response('Server Error: ' + err.message, { status: 500 });
  }
}