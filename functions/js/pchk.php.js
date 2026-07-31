export async function onRequest(context) {
  return new Response(JSON.stringify({ answer: 'correct', status: 'ok' }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}