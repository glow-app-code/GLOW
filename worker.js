// GLÓW · Cloudflare Worker
// Sisaldab: Anthropic proxy + magic-link autentimine + Stripe maksed + KV kasutajaandmed
//
// PAIGALDUS:
//   1. Cloudflare → Workers → glow-api → Settings → Bindings
//        - KV namespace binding: GLOW_KV (loo enne: Storage → KV → Create namespace "glow-users")
//   2. Settings → Variables and Secrets:
//        - ANTHROPIC_API_KEY (juba olemas)
//        - STRIPE_SECRET_KEY (Test mode: sk_test_...)
//        - STRIPE_WEBHOOK_SECRET (whsec_... — loo webhook peale)
//        - RESEND_API_KEY (re_... — https://resend.com)
//        - FROM_EMAIL = "GLÓW <info@glow4me.ee>"
//        - APP_URL = "https://glow4me.ee"

const ALLOWED_ORIGINS = [
  'https://glow4me.ee',
  'https://www.glow4me.ee',
  'https://glow-app-code.github.io',
  'http://localhost:8080',
  'http://localhost:5500',
];

const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const STRIPE_API = 'https://api.stripe.com/v1';
const MAX_BODY_SIZE = 20 * 1024 * 1024;
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 päeva
const MAGIC_LINK_TTL = 60 * 10; // 10 min
const FREE_CREDITS = 3;
const REFERRAL_BONUS = 5;

// Krediit-paketid (peavad kattuma index.html PACKAGES-iga)
const PACKAGES = {
  'pkg_10':  { count: 10,  amount_cents: 99,   name: '10 analüüsi' },
  'pkg_50':  { count: 50,  amount_cents: 450,  name: '50 analüüsi' },
  'pkg_100': { count: 100, amount_cents: 799,  name: '100 analüüsi' },
  'pkg_200': { count: 200, amount_cents: 1299, name: '200 analüüsi' },
};

// ============ ABIFUNKTSIOONID ============

function pickOrigin(reqOrigin) {
  if (ALLOWED_ORIGINS.includes(reqOrigin)) return reqOrigin;
  return ALLOWED_ORIGINS[0];
}

function corsHeaders(reqOrigin) {
  return {
    'Access-Control-Allow-Origin': pickOrigin(reqOrigin),
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Glow-Referrer, X-Glow-User',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(body, status = 200, origin = '') {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

function generateToken(len = 32) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function generateRefCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GLW';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 4; i++) code += chars[bytes[i] % chars.length];
  return code;
}

function isValidEmail(e) {
  return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length < 200;
}

async function getSession(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/);
  if (!m) return null;
  const token = m[1].trim();
  const sess = await env.GLOW_KV.get('session:' + token, 'json');
  if (!sess || sess.expiresAt < Date.now()) return null;
  return { token, email: sess.email };
}

async function getOrCreateUser(env, email) {
  const key = 'user:' + email.toLowerCase();
  let user = await env.GLOW_KV.get(key, 'json');
  if (!user) {
    user = {
      email: email.toLowerCase(),
      credits: FREE_CREDITS,
      referralCode: generateRefCode(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await env.GLOW_KV.put(key, JSON.stringify(user));
    await env.GLOW_KV.put('ref:' + user.referralCode, user.email);
  }
  return user;
}

async function updateUserCredits(env, email, delta) {
  const key = 'user:' + email.toLowerCase();
  const user = await env.GLOW_KV.get(key, 'json');
  if (!user) return null;
  user.credits = Math.max(0, (user.credits || 0) + delta);
  user.updatedAt = Date.now();
  await env.GLOW_KV.put(key, JSON.stringify(user));
  return user;
}

// ============ RESEND E-MAIL ============

async function sendMagicLinkEmail(env, email, link) {
  const from = env.FROM_EMAIL || 'GLÓW <onboarding@resend.dev>';
  const body = {
    from,
    to: [email],
    subject: '✦ Sinu GLÓW sisselogimise link',
    html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0e0c0b;font-family:Georgia,serif">
<div style="max-width:520px;margin:40px auto;padding:40px 32px;background:linear-gradient(135deg,#1a1614,#0e0c0b);border:1px solid #c9a96e;border-radius:12px">
  <div style="text-align:center;margin-bottom:32px">
    <div style="font-size:44px;color:#fff;letter-spacing:0.25em;font-weight:300">GL<em style="color:#c9a96e">Ó</em>W</div>
    <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.4em;color:#d4957a;text-transform:uppercase;margin-top:6px">AI · STIILIASSISTENT</div>
  </div>
  <h2 style="color:#fff;text-align:center;font-weight:600;margin:0 0 16px;font-size:22px">Tere tulemast tagasi ✦</h2>
  <p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.6;text-align:center;margin:0 0 28px">Klõpsa allolevat nuppu, et logida sisse GLÓW rakendusse. Link kehtib <strong style="color:#e8c97e">10 minutit</strong>.</p>
  <div style="text-align:center;margin-bottom:28px">
    <a href="${link}" style="display:inline-block;padding:16px 32px;background:#c9a96e;color:#0e0c0b;text-decoration:none;border-radius:6px;font-family:'Courier New',monospace;font-size:12px;letter-spacing:0.25em;font-weight:700">LOGI SISSE →</a>
  </div>
  <p style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6;text-align:center;margin:0 0 20px">Kui nupp ei tööta, kopeeri see link brauserisse:<br><span style="color:#c9a96e;word-break:break-all;font-size:12px">${link}</span></p>
  <div style="border-top:1px solid rgba(201,169,110,0.2);padding-top:20px;text-align:center">
    <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 6px">Kui sa ei taotlenud sisselogimist, ignoreeri seda kirja.</p>
    <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0">glow4me.ee · AI Stiiliassistent</p>
  </div>
</div></body></html>`,
  };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.ok;
}

// ============ STRIPE ============

async function stripeCreateCheckout(env, opts) {
  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('payment_method_types[]', 'card');
  params.set('line_items[0][price_data][currency]', 'eur');
  params.set('line_items[0][price_data][product_data][name]', opts.name);
  params.set('line_items[0][price_data][unit_amount]', String(opts.amount_cents));
  params.set('line_items[0][quantity]', '1');
  params.set('success_url', opts.successUrl);
  params.set('cancel_url', opts.cancelUrl);
  params.set('customer_email', opts.email);
  params.set('metadata[user_email]', opts.email);
  params.set('metadata[pkg_id]', opts.pkgId);
  params.set('metadata[credit_count]', String(opts.creditCount));

  const res = await fetch(STRIPE_API + '/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ? data.error.message : 'Stripe error');
  return data;
}

// Stripe webhook allkirja kontroll (HMAC-SHA256)
async function verifyStripeWebhook(env, rawBody, sigHeader) {
  if (!sigHeader) return false;
  const parts = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')));
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const payload = t + '.' + rawBody;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expected = Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, '0')).join('');
  return expected === v1;
}

// ============ MARSSRUUDID ============

async function handleAuthRequestLink(request, env, origin) {
  const { email } = await request.json();
  if (!isValidEmail(email)) return json({ error: 'Invalid email' }, 400, origin);

  const token = generateToken();
  const expiresAt = Date.now() + MAGIC_LINK_TTL * 1000;
  await env.GLOW_KV.put(
    'magiclink:' + token,
    JSON.stringify({ email: email.toLowerCase(), expiresAt }),
    { expirationTtl: MAGIC_LINK_TTL }
  );

  const appUrl = env.APP_URL || 'https://glow4me.ee';
  const link = appUrl + '/?verify=' + token;

  const ok = await sendMagicLinkEmail(env, email, link);
  if (!ok) return json({ error: 'Failed to send email' }, 500, origin);
  return json({ sent: true }, 200, origin);
}

async function handleAuthVerify(url, env, origin) {
  const token = url.searchParams.get('token');
  if (!token) return json({ error: 'Missing token' }, 400, origin);

  const link = await env.GLOW_KV.get('magiclink:' + token, 'json');
  if (!link || link.expiresAt < Date.now()) {
    return json({ error: 'Link expired or invalid' }, 400, origin);
  }
  await env.GLOW_KV.delete('magiclink:' + token);

  await getOrCreateUser(env, link.email);

  const sessionToken = generateToken();
  const sessionExpires = Date.now() + SESSION_TTL * 1000;
  await env.GLOW_KV.put(
    'session:' + sessionToken,
    JSON.stringify({ email: link.email, expiresAt: sessionExpires }),
    { expirationTtl: SESSION_TTL }
  );

  return json({ token: sessionToken, email: link.email }, 200, origin);
}

async function handleApiMe(request, env, origin) {
  const sess = await getSession(request, env);
  if (!sess) return json({ error: 'Unauthorized' }, 401, origin);
  const user = await getOrCreateUser(env, sess.email);
  return json({
    email: user.email,
    credits: user.credits,
    referralCode: user.referralCode,
  }, 200, origin);
}

async function handleApiCheckout(request, env, origin) {
  const sess = await getSession(request, env);
  if (!sess) return json({ error: 'Unauthorized — please log in first' }, 401, origin);
  const { pkgId } = await request.json();
  const pkg = PACKAGES[pkgId];
  if (!pkg) return json({ error: 'Invalid package' }, 400, origin);

  const appUrl = env.APP_URL || 'https://glow4me.ee';
  const checkout = await stripeCreateCheckout(env, {
    email: sess.email,
    pkgId,
    name: 'GLÓW · ' + pkg.name,
    amount_cents: pkg.amount_cents,
    creditCount: pkg.count,
    successUrl: appUrl + '/?checkout=success&session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: appUrl + '/?checkout=cancel',
  });
  return json({ url: checkout.url, sessionId: checkout.id }, 200, origin);
}

async function handleStripeWebhook(request, env) {
  const rawBody = await request.text();
  const sig = request.headers.get('Stripe-Signature');
  const ok = await verifyStripeWebhook(env, rawBody, sig);
  if (!ok) return new Response('Invalid signature', { status: 400 });

  const event = JSON.parse(rawBody);
  const dedupKey = 'webhook:' + event.id;
  const seen = await env.GLOW_KV.get(dedupKey);
  if (seen) return new Response('OK (dedup)', { status: 200 });
  await env.GLOW_KV.put(dedupKey, '1', { expirationTtl: 60 * 60 * 24 });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.metadata && session.metadata.user_email;
    const creditCount = parseInt(session.metadata.credit_count || '0', 10);
    if (email && creditCount > 0) {
      await updateUserCredits(env, email, creditCount);
    }
  }
  return new Response('OK', { status: 200 });
}

async function handleAnthropicProxy(request, env, origin) {
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_SIZE) return json({ error: { message: 'Body too large' } }, 413, origin);

  let body;
  try {
    body = await request.text();
    JSON.parse(body);
  } catch (e) {
    return json({ error: { message: 'Invalid JSON' } }, 400, origin);
  }

  // Sisselogitud kasutaja — vähenda serveri krediiti
  const sess = await getSession(request, env);
  if (sess) {
    const user = await getOrCreateUser(env, sess.email);
    if (user.credits <= 0) {
      return json({ error: { message: 'Krediit otsas — palun täienda saldot' } }, 402, origin);
    }
    await updateUserCredits(env, sess.email, -1);
  }
  // Anonüümne kasutaja — usaldab localStorage krediiti (MVP)

  try {
    const anthropicRes = await fetch(ANTHROPIC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
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
    return json({ error: { message: 'Upstream fetch failed: ' + (e.message || 'unknown') } }, 502, origin);
  }
}

// ============ PEAROUTER ============

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const path = url.pathname.replace(/\/+$/, '') || '/';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Health check
    if (request.method === 'GET' && path === '/') {
      return json({ status: 'ok', service: 'glow-api', ts: Date.now() }, 200, origin);
    }

    // Stripe webhook — pole origin-check
    if (request.method === 'POST' && path === '/webhook/stripe') {
      return handleStripeWebhook(request, env);
    }

    // Kõik muud POST-id peavad tulema lubatud origin'ist
    if (!ALLOWED_ORIGINS.includes(origin) && request.method !== 'GET') {
      return json({ error: 'Origin not allowed' }, 403, origin);
    }

    // API marssruudid
    try {
      if (request.method === 'POST' && path === '/auth/request-link') {
        return await handleAuthRequestLink(request, env, origin);
      }
      if (request.method === 'GET' && path === '/auth/verify') {
        return await handleAuthVerify(url, env, origin);
      }
      if (request.method === 'GET' && path === '/api/me') {
        return await handleApiMe(request, env, origin);
      }
      if (request.method === 'POST' && path === '/api/checkout') {
        return await handleApiCheckout(request, env, origin);
      }
      if (request.method === 'POST' && (path === '/v1/messages' || path.endsWith('/v1/messages'))) {
        return await handleAnthropicProxy(request, env, origin);
      }
    } catch (e) {
      return json({ error: { message: e.message || 'Internal error' } }, 500, origin);
    }

    return json({ error: { message: 'Not found', type: 'not_found' } }, 404, origin);
  },
};
