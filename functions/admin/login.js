export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    if (body.username === 'admin' && body.password === 'admin123') {
      return new Response(JSON.stringify({ success: true, redirect: '/admin/' }), {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'admin_session=valid_admin_token; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400'
        }
      });
    }
  } catch (e) {}

  return new Response(JSON.stringify({ success: false, error: 'Tài khoản hoặc mật khẩu không chính xác!' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}