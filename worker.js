// GLÓW · Cloudflare Worker proxy Anthropic Claude API'le.
// Eesmärk: peita Anthropic API võti serveri-poolele, et kasutaja ei peaks seda ise sisestama.
//
// PAIGALDUSJUHIS:
//   1. Loo Cloudflare konto (tasuta) — https://dash.cloudflare.com/sign-up
//   2. Mine "Workers & Pages" → "Create" → "Hello World"
//   3. Anna Worker'ile nimi (näit. "glow-api") → "Deploy"
//   4. Klõpsa "Edit code" → kustuta vaikekood → kleebi see fail tervikuna → "Deploy"
//   5. Mine "Settings" → "Variables and Secrets":
//        - Lisa "Secret" nimega ANTHROPIC_API_KEY ja väärtuseks sinu sk-ant-... võti
//   6. Kopeeri Worker'i URL (vasakul üleval, näit. https://glow-api.SINU-KONTO.workers.dev)
//   7. index.html-is asenda API_BASE väärtus selle URL'iga
//   8. Lisa allpool ALLOWED_ORIGINS hulka oma tegelik domeen kui see pole veel kohal

const ALLOWED_ORIGINS = [
  'https://glow4me.ee',
  'https://www.glow4me.ee',
  'https://glow-app-code.github.io',
  'http://localhost:8080',
  'http://localhost:5500',
];

const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MAX_BODY_SIZE = 20 * 1024 * 1024; // 20 MB — pildianalüüsiga kaasneb suur base64

function pickOrigin(reqOrigin) {
  if (ALLOWED_ORIGINS.includes(reqOrigin)) return reqOrigin;
  return ALLOWED_ORIGINS[0];
}

function corsHeaders(reqOrigin) {
  return {
    'Access-Control-Allow-Origin': pickOrigin(reqOrigin),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Glow-Referrer, X-Glow-User',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Tervisekontroll (debug)
    if (request.method === 'GET' && url.pathname === '/') {
      return jsonResponse({ status: 'ok', service: 'glow-api' }, 200, origin);
    }

    // Ainult /v1/messages teid lubatud
    if (request.method !== 'POST' || !url.pathname.endsWith('/v1/messages')) {
      return jsonResponse({ error: { message: 'Not found', type: 'not_found' } }, 404, origin);
    }

    // Origin valideerimine — kaitseb kuritarvituse vastu
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return jsonResponse({ error: { message: 'Origin not allowed', type: 'forbidden' } }, 403, origin);
    }

    // API võtme olemasolu kontroll
    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return jsonResponse({ error: { message: 'Server config error: ANTHROPIC_API_KEY puudub', type: 'server_config' } }, 500, origin);
    }

    // Loe body
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_BODY_SIZE) {
      return jsonResponse({ error: { message: 'Body too large', type: 'too_large' } }, 413, origin);
    }

    let body;
    try {
      body = await request.text();
      JSON.parse(body); // valideeri kui JSON
    } catch (e) {
      return jsonResponse({ error: { message: 'Invalid JSON body', type: 'bad_request' } }, 400, origin);
    }

    // Logime sõbra-soovituse päiseid (kasutame KV-d hiljem)
    // const referrer = request.headers.get('X-Glow-Referrer');
    // const userCode = request.headers.get('X-Glow-User');

    // Edasta päring Anthropic'ile
    try {
      const anthropicRes = await fetch(ANTHROPIC_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body,
      });

      const responseBody = await anthropicRes.text();
      return new Response(responseBody, {
        status: anthropicRes.status,
        headers: {
          'Content-Type': anthropicRes.headers.get('content-type') || 'application/json',
          ...corsHeaders(origin),
        },
      });
    } catch (e) {
      return jsonResponse({ error: { message: 'Upstream fetch failed: ' + (e.message || 'unknown'), type: 'upstream' } }, 502, origin);
    }
  },
};
