/* ===== GLÓW ekraani-URLid (marsruuter) =====
   Miks: enne seda olid kõik ekraanid sama aadressi all. See tähendas, et
   analüütika nägi ainult üht lehevaatamist, brauseri tagasinupp viis lehelt
   ära ja hinnakirjale ei saanud linki jagada.

   Nüüd saab iga ekraan oma aadressi:
     glow4me.ee/            → avaekraan
     glow4me.ee/#noustumine → nõusolekuekraan
     glow4me.ee/#meik       → rakendus, meigirežiim
     glow4me.ee/#stiil      → rakendus, stiilirežiim
     glow4me.ee/#pro        → rakendus, professionaali režiim
     glow4me.ee/#hinnakiri  → paketivalik

   Kasutame hash-aadresse (#), mitte tavalisi teid. Põhjus: leht jookseb
   GitHub Pages'il, kus /hinnakiri annaks värskendamisel 404. Hash töötab
   igal pool, ilma serveripoolse seadistuseta.

   Analüütika: iga ekraanivahetus saadab signaali —
     window.dataLayer.push({event:'glow_screen', screen_name:'...'})
     gtag('event','screen_view',{screen_name:'...'})   (kui gtag on olemas)
     window CustomEvent 'glow:screen'                  (alati, ei lahku brauserist)
   Kaks esimest saadetakse AINULT siis, kui kasutaja valis küpsisebänneris
   "Nõustun kõigega" (glow_cookie_choice === 'all'). Nii korjab Google Analytics
   või muu tööriist need üles kohe, kui sa selle lehele lisad — ja ainult neilt
   kasutajatelt, kes on selleks loa andnud.

   Kogu loogika on try/catch sees: kui siin midagi katki läheb, jääb rakendus
   ikka tööle, kaob ainult URL-i uuenemine. */
(function(){
  'use strict';

  var MODES = { meik:1, stiil:1, pro:1 };
  var applying = false;      // meie enda ajaloo-muudatus ei tohi navigeerimist käivitada
  var pushedPricing = false; // kas hinnakiri avati selles sessioonis (tagasinupu jaoks)
  var lastMode = 'meik';     // rakenduse `mode` on let-muutuja, siit väljast nähtamatu — hoiame ise arvet

  function accepted(){
    try { return localStorage.getItem('glow_terms_accepted') === 'true'; } catch(e){ return false; }
  }
  function currentHash(){
    try { return (location.hash || '').replace(/^#/, ''); } catch(e){ return ''; }
  }
  function urlFor(name){
    try { return name ? '#' + name : location.pathname + location.search; } catch(e){ return '#' + name; }
  }

  /* Küpsisebänner lubab kasutajal valida "Ainult vajalikud" või "Nõustun kõigega".
     Statistikat tohime saata ainult teise valiku puhul — täpselt nii, nagu bänner
     lubab. CustomEvent jääb alati alles: see ei lahku brauserist ega salvesta
     midagi, seda kasutab ainult sinu enda silumine (kuula 'glow:screen'). */
  function statsAllowed(){
    try { return localStorage.getItem('glow_cookie_choice') === 'all'; } catch(e){ return false; }
  }

  function track(name){
    var screen = name || 'splash';
    try { window.dispatchEvent(new CustomEvent('glow:screen', { detail: { screen: screen } })); } catch(e){}
    if (!statsAllowed()) return;
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'glow_screen', screen_name: screen });
    } catch(e){}
    try { if (typeof window.gtag === 'function') window.gtag('event', 'screen_view', { screen_name: screen }); } catch(e){}
  }

  function setHash(name, push){
    try {
      if (currentHash() === name) { track(name); return; }
      applying = true;
      if (push) history.pushState({ glow: name }, '', urlFor(name));
      else history.replaceState({ glow: name }, '', urlFor(name));
      setTimeout(function(){ applying = false; }, 0);
      track(name);
    } catch(e){ applying = false; }
  }

  // --- originaalfunktsioonid, mida me mähime ---
  var _showScreen  = window.showScreen;
  var _setMode     = window.setMode;
  var _showPricing = window.showPricing;
  var _hidePricing = window.hidePricing;
  var _logout      = window.logout;

  function pricingOpen(){
    try { return document.getElementById('pricingScreen').classList.contains('show'); } catch(e){ return false; }
  }

  /* Rakendab aadressile vastava seisu ILMA ajalugu muutmata.
     Seda kutsub tagasinupp ja lehe avamine otselingiga. */
  function goTo(name){
    try {
      var ok = accepted();

      if (name === 'hinnakiri') {
        if (ok && !pricingOpen() && _showPricing) _showPricing();
        return;
      }
      if (pricingOpen() && _hidePricing) _hidePricing();

      if (name === 'noustumine') {
        if (!ok && _showScreen) _showScreen('termsScreen');
        return;
      }
      if (MODES[name]) {
        if (ok && _setMode) _setMode(name);
        return;
      }
      // tühi või tundmatu aadress
      if (!ok && _showScreen) _showScreen('splashScreen');
    } catch(e){}
  }

  // --- mähised ---
  if (_showScreen) window.showScreen = function(id){
    _showScreen(id);
    if (id === 'termsScreen') setHash('noustumine', true);
    else if (id === 'splashScreen') setHash('', false);
    // countdownScreen on 3-sekundiline animatsioon — sellele oma aadressi ei anna,
    // muidu jääks see tagasinupu ajalukku ette
  };

  if (_setMode) window.setMode = function(m){
    _setMode(m);
    if (MODES[m]) { lastMode = m; setHash(m, false); }
  };

  if (_showPricing) window.showPricing = function(){
    _showPricing();
    pushedPricing = true;
    setHash('hinnakiri', true);
  };

  if (_hidePricing) window.hidePricing = function(){
    // Kui hinnakiri avati siitsamast, laseme tagasinupul töö ära teha — nii
    // käituvad sulgemisnupp ja brauseri tagasinupp ühtemoodi.
    if (pushedPricing && currentHash() === 'hinnakiri') {
      pushedPricing = false;
      try { history.back(); return; } catch(e){}
    }
    _hidePricing();
    setHash(lastMode, false);
  };

  if (_logout) window.logout = function(){
    _logout();
    pushedPricing = false;
    setHash('', false);
  };

  // --- tagasi/edasi-nupp ---
  window.addEventListener('popstate', function(){
    if (applying) return;
    var name = currentHash();
    goTo(name);
    track(name);
  });

  // --- avamine otselingiga (nt keegi jagas glow4me.ee/#hinnakiri) ---
  function applyInitial(){
    try {
      var name = currentHash();
      var ok = accepted();

      if (!name) { track(ok ? lastMode : 'splash'); return; }

      if (name === 'hinnakiri' && ok) { if (_showPricing) _showPricing(); pushedPricing = false; track(name); return; }
      if (MODES[name] && ok)         { if (_setMode) _setMode(name); track(name); return; }
      if (name === 'noustumine' && !ok) { if (_showScreen) _showScreen('termsScreen'); track(name); return; }

      // Aadress ei sobi kasutaja seisuga (nt #hinnakiri, aga tingimused vastu võtmata)
      // — viime ta sinna, kus ta päriselt on, ilma vale aadressi ajalukku jätmata.
      setHash(ok ? lastMode : '', false);
    } catch(e){}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(applyInitial, 120); });
  else setTimeout(applyInitial, 120);

  // Abifunktsioon: window.glowScreen() ütleb, mis ekraanil kasutaja on
  window.glowScreen = function(){ return currentHash() || (accepted() ? lastMode : 'splash'); };
})();

/* ===== Google Analytics 4 — nõusolekuga =====
   Google'i enda juhis paneb gtag.js kohe <head>-i laadima. Meie ei tee nii:
   küpsisebänner lubab kasutajal valida "Ainult vajalikud" või "Nõustun kõigega",
   ja statistikat tohime koguda ainult teise puhul. Seega laeme GA4 alles siis,
   kui nõusolek on olemas — kohe lehe avamisel, kui see oli varem antud, või
   sekundi murdosa jooksul pärast "Nõustun kõigega" klõpsu.

   Ekraanivahetusi saadab marsruuter (vt "GLÓW ekraani-URLid" allpool) —
   sealt tuleb screen_view sündmus iga ekraani kohta:
     splash → noustumine → meik/stiil/pro → hinnakiri                        */
(function(){
  'use strict';
  var ID = 'G-QE3ZGCMLD7';
  var loaded = false;

  function consented(){
    try { return localStorage.getItem('glow_cookie_choice') === 'all'; } catch(e){ return false; }
  }

  function load(){
    if (loaded || !consented()) return;
    loaded = true;
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ID);

      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
      document.head.appendChild(s);

      // Praegune ekraan läheb kohe teele — muidu kaoks esimene vaatamine ära,
      // sest marsruuter jõudis oma sündmuse saata enne GA laadimist.
      var name = (typeof window.glowScreen === 'function') ? window.glowScreen() : 'splash';
      window.gtag('event', 'screen_view', { screen_name: name });
    } catch(e){ loaded = false; }
  }

  if (consented()) load();

  // Kui kasutaja nõustub alles nüüd, laeme kohe pärast tema klõpsu.
  var _accept = window.acceptCookies;
  if (typeof _accept === 'function') {
    window.acceptCookies = function(mode){
      _accept(mode);
      setTimeout(load, 0);
    };
  }

  // Varuvõrk: kui nõusolek tekib mingil muul teel, korjame selle järgmisel
  // ekraanivahetusel üles.
  window.addEventListener('glow:screen', function(){ if (!loaded) load(); });
})();
