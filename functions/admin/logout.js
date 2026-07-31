export async function onRequest(context) {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin/',
      'Set-Cookie': 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  });
}