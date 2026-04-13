export async function onRequestGet() {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'card-optimizer',
    timestamp: new Date().toISOString(),
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
