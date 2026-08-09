/* GLÓW service worker — vahemälustrateegia

   Kaks erinevat reeglit, sest neil on erinev iseloom:

   1. Sisuräsiga varad (app.<räsi>.css, app.<räsi>.js, ...) — CACHE FIRST.
      Faili sisu ei saa muutuda ilma, et nimi muutuks, seega vahemälust
      serveerimine on alati ohutu ja kohene. Uus versioon = uus nimi = uus
      allalaadimine.

   2. HTML ja kõik muu — NETWORK FIRST.
      HTML-i nimi ei muutu, seega peab ta alati võrgust värske tulema, muidu
      ei jõuaks uuendused kasutajateni. Kui võrku pole, tuleb vahemälust.

   Enne oli kogu leht üks 354 KB fail, mida serveeriti no-store'iga — ehk iga
   külastus laadis kõik uuesti. Nüüd laeb korduvkülastus ainult HTML-i (~54 KB)
   ja ülejäänu tuleb kohe vahemälust.                                        */

const CACHE_NAME = 'glow-v4';

// Varad, mis laetakse ette juba paigaldamisel
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './app.5ccd5a34.css',
  './app.f4f6c533.js',
  './i18n.2088bf3c.js',
  './boot.e48bf4e2.js',
  './icon.svg',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
];

// Sisuräsiga failinimi: nimi.<8 heksamärki>.css|js
const HASHED = /\.[a-f0-9]{8}\.(css|js)$/;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  // --- 1. Sisuräsiga varad: vahemälust kohe, võrku ainult esimesel korral ---
  if (HASHED.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(hit => {
        if (hit) return hit;
        return fetch(req).then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      })
    );
    return;
  }

  // --- 2. HTML ja muu: alati värske, vahemälu ainult varuvariandiks ---
  const isHTML = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  const fetchReq = isHTML ? new Request(req.url, { cache: 'no-store' }) : req;

  event.respondWith(
    fetch(fetchReq)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
