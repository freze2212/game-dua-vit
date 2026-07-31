export async function onRequestGet(context) {
  let config = { winnerOrder: [3, 1, 2], updatedAt: new Date().toISOString() };
  try {
    if (context.env && context.env.GAME_KV) {
      const stored = await context.env.GAME_KV.get('activeGameConfig');
      if (stored) config = JSON.parse(stored);
    }
  } catch (e) { }

  return new Response(JSON.stringify(config), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}