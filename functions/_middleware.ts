const ALLOWED_ORIGINS = [
  'https://cards.keylightdigital.com',
  'https://card-optimizer.pages.dev',
]

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  if (ALLOWED_ORIGINS.includes(origin)) return true
  if (origin.startsWith('http://localhost:')) return true
  if (origin.endsWith('.card-optimizer.pages.dev')) return true
  return false
}

export async function onRequest(context: { request: Request; next: () => Promise<Response> }) {
  const origin = context.request.headers.get('Origin')
  const allowedOrigin = isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0]

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    })
  }

  const response = await context.next()

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'Access-Control-Allow-Origin': allowedOrigin,
      'Vary': 'Origin',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
