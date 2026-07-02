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

function generateSixDigitCode() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const num = (bytes[0] << 16) + (bytes[1] << 8) + bytes[2];
  return String(num % 1000000).padStart(6, '0');
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

async function sendMagicLinkEmail(env, email, link, code) {
  const from = env.FROM_EMAIL || 'GLÓW <onboarding@resend.dev>';
  const displayCode = code || '------';
  const body = {
    from,
    to: [email],
    subject: '✦ Sinu GLÓW kood: ' + displayCode,
    html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0e0c0b;font-family:Georgia,serif">
<div style="max-width:520px;margin:40px auto;padding:40px 32px;background:linear-gradient(135deg,#1a1614,#0e0c0b);border:1px solid #c9a96e;border-radius:12px">
  <div style="text-align:center;margin-bottom:28px">
    <div style="font-size:44px;color:#fff;letter-spacing:0.25em;font-weight:300">GL<em style="color:#c9a96e">Ó</em>W</div>
    <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.4em;color:#d4957a;text-transform:uppercase;margin-top:6px">AI · STIILIASSISTENT</div>
  </div>
  <h2 style="color:#fff;text-align:center;font-weight:600;margin:0 0 8px;font-size:22px">Tere tulemast tagasi ✦</h2>
  <p style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.5;text-align:center;margin:0 0 20px">Sisesta allolev 6-kohaline kood GL<em style="color:#c9a96e">Ó</em>W rakenduses</p>
  <div style="text-align:center;margin:0 0 28px">
    <div style="display:inline-block;padding:22px 28px;background:rgba(201,169,110,0.12);border:2px solid #c9a96e;border-radius:12px">
      <div style="font-family:'Courier New',monospace;font-size:40px;letter-spacing:0.35em;color:#e8c97e;font-weight:700;text-shadow:0 0 20px rgba(232,201,126,0.4)">${displayCode}</div>
    </div>
    <p style="color:rgba(255,255,255,0.55);font-size:12px;margin:12px 0 0">Kood kehtib <strong style="color:#e8c97e">10 minutit</strong></p>
  </div>
  <div style="border-top:1px solid rgba(201,169,110,0.2);padding-top:20px;margin-bottom:20px">
    <p style="color:rgba(255,255,255,0.6);font-size:12px;line-height:1.6;text-align:center;margin:0 0 12px">Või ava ligipääs otse (avab brauseris — parim kui pole veel GLÓW äppi installinud):</p>
    <div style="text-align:center">
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:transparent;color:#c9a96e;text-decoration:none;border:1px solid #c9a96e;border-radius:6px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.25em;font-weight:600">AVA BRAUSERIS →</a>
    </div>
  </div>
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
  const code = generateSixDigitCode();
  const expiresAt = Date.now() + MAGIC_LINK_TTL * 1000;
  const emailLower = email.toLowerCase();

  // Salvesta nii link kui kood
  await env.GLOW_KV.put(
    'magiclink:' + token,
    JSON.stringify({ email: emailLower, expiresAt }),
    { expirationTtl: MAGIC_LINK_TTL }
  );
  await env.GLOW_KV.put(
    'magiccode:' + emailLower + ':' + code,
    JSON.stringify({ email: emailLower, expiresAt }),
    { expirationTtl: MAGIC_LINK_TTL }
  );

  const appUrl = env.APP_URL || 'https://glow4me.ee';
  const link = appUrl + '/?verify=' + token;

  const ok = await sendMagicLinkEmail(env, email, link, code);
  if (!ok) return json({ error: 'Failed to send email' }, 500, origin);
  return json({ sent: true }, 200, origin);
}

async function handleAuthVerifyCode(request, env, origin) {
  const { email, code } = await request.json();
  if (!isValidEmail(email) || !/^\d{6}$/.test(String(code||''))) {
    return json({ error: 'Vale e-post või kood' }, 400, origin);
  }
  const emailLower = email.toLowerCase();
  const key = 'magiccode:' + emailLower + ':' + code;
  const data = await env.GLOW_KV.get(key, 'json');
  if (!data || data.expiresAt < Date.now()) {
    return json({ error: 'Vale kood või kood on aegunud' }, 400, origin);
  }
  await env.GLOW_KV.delete(key);

  await getOrCreateUser(env, data.email);
  const sessionToken = generateToken();
  const sessionExpires = Date.now() + SESSION_TTL * 1000;
  await env.GLOW_KV.put(
    'session:' + sessionToken,
    JSON.stringify({ email: data.email, expiresAt: sessionExpires }),
    { expirationTtl: SESSION_TTL }
  );
  return json({ token: sessionToken, email: data.email }, 200, origin);
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

// ============ CIRCLES (sotsiaalne süsteem) ============

const CIRCLE_ICONS = ['✨','💫','🌸','🎀','🌟','💎','🔥','👗','🎭','🌙'];
const ALLOWED_REACTIONS = ['🔥','💭','👗','✨','❤️','👎'];

async function ensureUserInited(env, email) {
  const user = await getOrCreateUser(env, email);
  if (!user.circleIds) user.circleIds = [];
  return user;
}

async function handleCirclesList(request, env, origin) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const user = await ensureUserInited(env, sess.email);
  const circles = [];
  for (const id of (user.circleIds||[])) {
    const c = await env.GLOW_KV.get('circle:' + id, 'json');
    if (c) circles.push(c);
  }
  return json({circles}, 200, origin);
}

async function handleCirclesCreate(request, env, origin) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const body = await request.json();
  const name = String(body.name||'').trim().slice(0,50);
  const icon = CIRCLE_ICONS.includes(body.icon) ? body.icon : '✨';
  if (name.length < 2) return json({error: 'Name too short'}, 400, origin);
  const circleId = 'c_' + generateToken(8);
  const circle = {
    id: circleId, name, icon,
    ownerEmail: sess.email,
    members: [sess.email],
    createdAt: Date.now()
  };
  await env.GLOW_KV.put('circle:' + circleId, JSON.stringify(circle));
  const user = await ensureUserInited(env, sess.email);
  user.circleIds.push(circleId);
  await env.GLOW_KV.put('user:' + sess.email, JSON.stringify(user));
  return json({circle}, 200, origin);
}

async function handleCirclesInvite(request, env, origin, circleId) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const circle = await env.GLOW_KV.get('circle:' + circleId, 'json');
  if (!circle) return json({error: 'Circle not found'}, 404, origin);
  if (!circle.members.includes(sess.email)) return json({error: 'Not a member'}, 403, origin);
  const code = generateToken(6).toUpperCase().slice(0,10);
  await env.GLOW_KV.put('invite:' + code, JSON.stringify({
    circleId, inviterEmail: sess.email,
    circleName: circle.name, circleIcon: circle.icon,
    expiresAt: Date.now() + 48*3600*1000
  }), {expirationTtl: 48*3600});
  return json({code, expiresIn: 48*3600}, 200, origin);
}

async function handleCirclesJoin(request, env, origin, code) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Please log in first', needLogin: true}, 401, origin);
  const invite = await env.GLOW_KV.get('invite:' + String(code).toUpperCase(), 'json');
  if (!invite) return json({error: 'Invalid or expired invite'}, 404, origin);
  const circle = await env.GLOW_KV.get('circle:' + invite.circleId, 'json');
  if (!circle) return json({error: 'Circle no longer exists'}, 404, origin);
  if (!circle.members.includes(sess.email)) {
    circle.members.push(sess.email);
    await env.GLOW_KV.put('circle:' + circle.id, JSON.stringify(circle));
  }
  const user = await ensureUserInited(env, sess.email);
  if (!user.circleIds.includes(circle.id)) {
    user.circleIds.push(circle.id);
    await env.GLOW_KV.put('user:' + sess.email, JSON.stringify(user));
  }
  return json({circle}, 200, origin);
}

async function handleCircleLeave(request, env, origin, circleId) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const circle = await env.GLOW_KV.get('circle:' + circleId, 'json');
  if (circle) {
    circle.members = (circle.members||[]).filter(e => e !== sess.email);
    if (circle.members.length === 0) {
      await env.GLOW_KV.delete('circle:' + circleId);
      await env.GLOW_KV.delete('circle_shares:' + circleId);
    } else {
      if (circle.ownerEmail === sess.email) circle.ownerEmail = circle.members[0];
      await env.GLOW_KV.put('circle:' + circleId, JSON.stringify(circle));
    }
  }
  const user = await ensureUserInited(env, sess.email);
  user.circleIds = (user.circleIds||[]).filter(id => id !== circleId);
  await env.GLOW_KV.put('user:' + sess.email, JSON.stringify(user));
  return json({ok: true}, 200, origin);
}

async function handleShareCreate(request, env, origin) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const body = await request.json();
  const {circleIds, imageBase64, aiVerdict, aiSummary, mode, userMessage} = body;
  if (!Array.isArray(circleIds) || circleIds.length === 0) return json({error: 'No circle selected'}, 400, origin);
  // Kärbi pilti — max 500KB base64 (~350KB päris)
  const trimmedImg = imageBase64 ? String(imageBase64).slice(0, 500 * 1024) : null;
  const now = Date.now();
  const expiresAt = now + 12*3600*1000;
  const shareId = 's_' + generateToken(10);
  const share = {
    id: shareId,
    authorEmail: sess.email,
    circleIds,
    imageBase64: trimmedImg,
    aiVerdict: String(aiVerdict||'').slice(0,200),
    aiSummary: String(aiSummary||'').slice(0,600),
    mode: String(mode||'meik'),
    userMessage: String(userMessage||'').slice(0,300),
    createdAt: now, expiresAt,
    reactions: {}, comments: []
  };
  await env.GLOW_KV.put('share:' + shareId, JSON.stringify(share), {expirationTtl: 12*3600});
  // Lisa igasse circle'i shares-indeksisse
  for (const cid of circleIds) {
    const circle = await env.GLOW_KV.get('circle:' + cid, 'json');
    if (!circle || !circle.members.includes(sess.email)) continue;
    const idx = await env.GLOW_KV.get('circle_shares:' + cid, 'json') || [];
    idx.unshift(shareId);
    await env.GLOW_KV.put('circle_shares:' + cid, JSON.stringify(idx.slice(0, 50)), {expirationTtl: 14*24*3600});
  }
  return json({share}, 200, origin);
}

async function handleFeed(request, env, origin) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const user = await ensureUserInited(env, sess.email);
  const shareIds = new Set();
  const meta = {};
  for (const cid of (user.circleIds||[])) {
    const circle = await env.GLOW_KV.get('circle:' + cid, 'json');
    if (!circle) continue;
    meta[cid] = {name: circle.name, icon: circle.icon};
    const idx = await env.GLOW_KV.get('circle_shares:' + cid, 'json') || [];
    for (const sid of idx.slice(0, 20)) shareIds.add(sid);
  }
  const shares = [];
  for (const sid of shareIds) {
    const s = await env.GLOW_KV.get('share:' + sid, 'json');
    if (s) shares.push(s);
  }
  shares.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
  return json({shares: shares.slice(0,30), circles: meta}, 200, origin);
}

async function handleShareGet(request, env, origin, shareId) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const share = await env.GLOW_KV.get('share:' + shareId, 'json');
  if (!share) return json({error: 'Share not found or expired'}, 404, origin);
  return json({share}, 200, origin);
}

async function handleShareComment(request, env, origin, shareId) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const {text} = await request.json();
  const clean = String(text||'').trim().slice(0, 500);
  if (clean.length < 1) return json({error: 'Empty comment'}, 400, origin);
  const share = await env.GLOW_KV.get('share:' + shareId, 'json');
  if (!share) return json({error: 'Share not found or expired'}, 404, origin);
  share.comments = share.comments || [];
  share.comments.push({email: sess.email, text: clean, createdAt: Date.now()});
  const ttl = Math.max(60, Math.floor((share.expiresAt - Date.now()) / 1000));
  await env.GLOW_KV.put('share:' + shareId, JSON.stringify(share), {expirationTtl: ttl});
  return json({comments: share.comments}, 200, origin);
}

async function handleShareReact(request, env, origin, shareId) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const {emoji} = await request.json();
  if (!ALLOWED_REACTIONS.includes(emoji)) return json({error: 'Invalid reaction'}, 400, origin);
  const share = await env.GLOW_KV.get('share:' + shareId, 'json');
  if (!share) return json({error: 'Share not found or expired'}, 404, origin);
  share.reactions = share.reactions || {};
  share.reactions[emoji] = share.reactions[emoji] || [];
  const idx = share.reactions[emoji].indexOf(sess.email);
  if (idx >= 0) share.reactions[emoji].splice(idx, 1);
  else share.reactions[emoji].push(sess.email);
  const ttl = Math.max(60, Math.floor((share.expiresAt - Date.now()) / 1000));
  await env.GLOW_KV.put('share:' + shareId, JSON.stringify(share), {expirationTtl: ttl});
  return json({reactions: share.reactions}, 200, origin);
}

// ============ CIRCLE CHAT / VESTLUS ============
// Salvestus: circle_msgs:{circleId} = JSON massiiv sõnumeid (kuni 200 uusimat)
// Sõnum: {id, email, text, cat, ts}
// Kategooriad: 'ilu' | 'riided' | 'toit' | 'sport' | 'vaba' (default 'vaba')

const CHAT_CATEGORIES = ['ilu','riided','toit','sport','vaba'];
const CHAT_MSG_TTL = 30 * 24 * 3600; // 30 päeva
const CHAT_MAX_LEN = 800;
const CHAT_MAX_MSGS = 200;

async function ensureCircleMember(env, circleId, email) {
  const circle = await env.GLOW_KV.get('circle:' + circleId, 'json');
  if (!circle) return null;
  if (!circle.members || !circle.members.includes(email)) return null;
  return circle;
}

async function handleCircleMessagesGet(request, env, origin, circleId) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const circle = await ensureCircleMember(env, circleId, sess.email);
  if (!circle) return json({error: 'Ei ole selle Circle liige'}, 403, origin);
  const url = new URL(request.url);
  const cat = url.searchParams.get('cat') || '';
  const since = parseInt(url.searchParams.get('since') || '0', 10);
  const msgs = await env.GLOW_KV.get('circle_msgs:' + circleId, 'json') || [];
  let filtered = msgs;
  if (cat && CHAT_CATEGORIES.includes(cat)) filtered = filtered.filter(m => m.cat === cat);
  if (since > 0) filtered = filtered.filter(m => (m.ts || 0) > since);
  return json({messages: filtered, circleName: circle.name, circleIcon: circle.icon}, 200, origin);
}

async function handleCircleMessagePost(request, env, origin, circleId) {
  const sess = await getSession(request, env);
  if (!sess) return json({error: 'Unauthorized'}, 401, origin);
  const circle = await ensureCircleMember(env, circleId, sess.email);
  if (!circle) return json({error: 'Ei ole selle Circle liige'}, 403, origin);
  const body = await request.json();
  const text = String(body.text || '').trim().slice(0, CHAT_MAX_LEN);
  if (text.length < 1) return json({error: 'Tühi sõnum'}, 400, origin);
  let cat = String(body.cat || 'vaba');
  if (!CHAT_CATEGORIES.includes(cat)) cat = 'vaba';
  const msgs = await env.GLOW_KV.get('circle_msgs:' + circleId, 'json') || [];
  const now = Date.now();
  const msg = {id: 'm_' + generateToken(8), email: sess.email, text, cat, ts: now};
  msgs.push(msg);
  const trimmed = msgs.slice(-CHAT_MAX_MSGS);
  await env.GLOW_KV.put('circle_msgs:' + circleId, JSON.stringify(trimmed), {expirationTtl: CHAT_MSG_TTL});
  return json({message: msg}, 200, origin);
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
      if (request.method === 'POST' && path === '/auth/verify-code') {
        return await handleAuthVerifyCode(request, env, origin);
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
      // Circles endpoints
      if (request.method === 'GET' && path === '/api/circles') return await handleCirclesList(request, env, origin);
      if (request.method === 'POST' && path === '/api/circles/create') return await handleCirclesCreate(request, env, origin);
      let m;
      if ((m = path.match(/^\/api\/circles\/([^\/]+)\/invite$/)) && request.method === 'POST') return await handleCirclesInvite(request, env, origin, m[1]);
      if ((m = path.match(/^\/api\/circles\/join\/([^\/]+)$/)) && request.method === 'POST') return await handleCirclesJoin(request, env, origin, m[1]);
      if ((m = path.match(/^\/api\/circles\/([^\/]+)\/leave$/)) && request.method === 'POST') return await handleCircleLeave(request, env, origin, m[1]);

      // Share endpoints
      if (request.method === 'POST' && path === '/api/shares') return await handleShareCreate(request, env, origin);
      if (request.method === 'GET' && path === '/api/feed') return await handleFeed(request, env, origin);
      if ((m = path.match(/^\/api\/shares\/([^\/]+)$/)) && request.method === 'GET') return await handleShareGet(request, env, origin, m[1]);
      if ((m = path.match(/^\/api\/shares\/([^\/]+)\/comment$/)) && request.method === 'POST') return await handleShareComment(request, env, origin, m[1]);
      if ((m = path.match(/^\/api\/shares\/([^\/]+)\/react$/)) && request.method === 'POST') return await handleShareReact(request, env, origin, m[1]);

      // Circle chat / vestlus
      if ((m = path.match(/^\/api\/circles\/([^\/]+)\/messages$/)) && request.method === 'GET') return await handleCircleMessagesGet(request, env, origin, m[1]);
      if ((m = path.match(/^\/api\/circles\/([^\/]+)\/messages$/)) && request.method === 'POST') return await handleCircleMessagePost(request, env, origin, m[1]);

      if (request.method === 'POST' && (path === '/v1/messages' || path.endsWith('/v1/messages'))) {
        return await handleAnthropicProxy(request, env, origin);
      }
    } catch (e) {
      return json({ error: { message: e.message || 'Internal error' } }, 500, origin);
    }

    return json({ error: { message: 'Not found', type: 'not_found' } }, 404, origin);
  },
};
