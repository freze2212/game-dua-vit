export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    if (body.winnerOrder && Array.isArray(body.winnerOrder)) {
      const config = {
        winnerOrder: body.winnerOrder.map(n => parseInt(n)),
        updatedAt: new Date().toISOString()
      };
      try {
        if (context && context.env && context.env.GAME_KV && typeof context.env.GAME_KV.put === 'function') {
          await context.env.GAME_KV.put('activeGameConfig', JSON.stringify(config));
        }
      } catch (kvErr) {}
      return new Response(JSON.stringify({ success: true, config }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {}

  return new Response(JSON.stringify({ error: 'Payload không hợp lệ' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}