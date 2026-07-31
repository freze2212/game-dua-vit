export async function onRequest(context) {
  try {
    const hasReq = !!(context && context.request);
    const cookieHeader = hasReq ? (context.request.headers.get('cookie') || context.request.headers.get('Cookie') || '') : '';
    return new Response(`HasReq: ${hasReq} | CookieHeader: ${cookieHeader}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (err) {
    return new Response(`Caught Error: ${err.message}`, { status: 200 });
  }
}