// === KONFIGURATSIOON ===
// Pärast Cloudflare Worker'i loomist asenda allolev URL oma Worker'i URL-iga (näit. https://glow-api.minu-konto.workers.dev)
const API_BASE='https://glow-api.krister-laas.workers.dev';
const USE_PROXY=true; // true = kasuta proxy (kasutajad ei pea API võtit sisestama); false = vanaviisi otse Anthropic
function glowApiUrl(){return USE_PROXY?(API_BASE.replace(/\/$/,'')+'/v1/messages'):'https://api.anthropic.com/v1/messages';}
function glowApiHeaders(key){const base={'Content-Type':'application/json'};if(USE_PROXY){const ref=localStorage.getItem('glow_referrer_code');const me=localStorage.getItem('glow_my_code');if(ref)base['X-Glow-Referrer']=ref;if(me)base['X-Glow-User']=me;const tok=localStorage.getItem('glow_session_token');if(tok)base['Authorization']='Bearer '+tok;return base;}return Object.assign(base,{'x-api-key':key||'','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'});}

// === SVG-IKOONIDE KOGU (Phosphor/Lucide stiil — õhukesed jooned) ===
const ICONS={
  makeup:'<path d="M9 3 L15 3 L14 8 L10 8 Z M10 8 L14 8 L14 12 L10 12 Z M12 12 L12 21"/>',
  dress:'<path d="M9 3 L8 7 L11 11 L8 21 L16 21 L13 11 L16 7 L15 3 Z"/>',
  sparkle:'<path d="M12 3 L13.2 10.8 L21 12 L13.2 13.2 L12 21 L10.8 13.2 L3 12 L10.8 10.8 Z"/><path d="M19 3 L19.5 5.5 L22 6 L19.5 6.5 L19 9 L18.5 6.5 L16 6 L18.5 5.5 Z" opacity="0.6"/>',
  house:'<path d="M3 11 L12 3 L21 11"/><path d="M5 10 L5 21 L19 21 L19 10"/><path d="M10 21 L10 15 L14 15 L14 21"/>',
  shop:'<path d="M5 8 L19 8 L18 21 L6 21 Z"/><path d="M9 8 V6 A3 3 0 0 1 15 6 V8"/>',
  selfie:'<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="9" r="2"/><path d="M8 17 Q12 14 16 17"/><circle cx="12" cy="19" r="0.6"/>',
  camera:'<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.8"/><path d="M9 7 L10 4 L14 4 L15 7"/>',
  gallery:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 16 L9 11 L14 15 L17 13 L21 17"/>',
  flip:'<path d="M4 8 H14 M11 5 L14 8 L11 11"/><path d="M20 16 H10 M13 13 L10 16 L13 19"/>',
  upload:'<path d="M12 4 V15"/><path d="M7 9 L12 4 L17 9"/><path d="M4 17 V19 A2 2 0 0 0 6 21 H18 A2 2 0 0 0 20 19 V17"/>',
  briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7 V5 A2 2 0 0 1 11 3 L13 3 A2 2 0 0 1 15 5 V7"/><path d="M3 14 H21"/>',
  sun:'<circle cx="12" cy="12" r="3.5"/><path d="M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22 M5 5 L6.5 6.5 M17.5 17.5 L19 19 M5 19 L6.5 17.5 M17.5 6.5 L19 5"/>',
  moon:'<path d="M20 14 A8 8 0 1 1 10 4 A6 6 0 0 0 20 14 Z"/>',
  crown:'<path d="M3 18 L4 8 L9 12 L12 5 L15 12 L20 8 L21 18 Z"/><path d="M3 21 L21 21"/>',
  wine:'<path d="M8 3 L16 3 L15 11 A3 3 0 0 1 9 11 Z"/><path d="M12 14 L12 20 M9 20 L15 20"/>',
  cake:'<rect x="4" y="11" width="16" height="10" rx="1"/><path d="M4 16 L20 16"/><path d="M8 11 V6 M12 11 V5 M16 11 V6"/><path d="M8 5 L8 3 M12 4 L12 2 M16 5 L16 3"/>',
  graduation:'<path d="M2 9 L12 5 L22 9 L12 13 Z"/><path d="M6 11 V15 A6 4 0 0 0 18 15 V11"/>',
  handshake:'<path d="M3 12 L7 8 L11 10 L13 9 L17 11 L21 12"/><path d="M3 12 L6 15 A2 2 0 0 0 9 15 L11 13 L13 15 A2 2 0 0 0 16 15 L18 13 L21 14"/>',
  coffee:'<path d="M5 9 L18 9 L17 18 A2 2 0 0 1 15 20 L8 20 A2 2 0 0 1 6 18 Z"/><path d="M17 11 H19 A2 2 0 0 1 21 13 V14 A2 2 0 0 1 19 16 H17"/><path d="M9 5 V7 M13 5 V7"/>',
  dish:'<path d="M3 14 A9 6 0 0 1 21 14 Z"/><path d="M3 14 V17 H21 V14"/><path d="M12 6 V3"/>',
  party:'<path d="M3 21 L9 5 L19 15 Z"/><path d="M9 5 L11 7 M14 10 L16 12"/><path d="M5 19 L7 17"/>',
  plane:'<path d="M2 13 L10 11 L13 4 L15 4 L13 12 L20 11 L21 13 L13 15 L11 22 L9 22 L11 14 Z"/>',
  wave:'<path d="M2 11 Q5 7 8 11 T14 11 T20 11"/><path d="M2 16 Q5 12 8 16 T14 16 T20 16"/>',
  run:'<circle cx="15" cy="4" r="2"/><path d="M15 8 L12 12 L9 11"/><path d="M12 12 L11 16 L14 18"/><path d="M14 18 L12 22"/><path d="M14 18 L17 15 L18 19"/>',
  smile:'<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="0.6" fill="currentColor"/><circle cx="15" cy="10" r="0.6" fill="currentColor"/><path d="M8 14 Q12 18 16 14"/>',
  square:'<rect x="5" y="5" width="14" height="14" rx="2"/>',
  palette:'<path d="M12 3 A9 9 0 1 0 12 21 A2 2 0 0 0 14 19 L14 17 A2 2 0 0 1 16 15 L18 15 A3 3 0 0 0 21 12 A9 9 0 0 0 12 3 Z"/><circle cx="7" cy="11" r="1" fill="currentColor"/><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="14" cy="5" r="1" fill="currentColor"/>',
  fire:'<path d="M12 3 Q14 6 13 10 Q15 9 17 12 A5 5 0 1 1 7 12 Q10 8 12 3 Z"/>',
  star:'<path d="M12 3 L14 9 L20 10 L15.5 14 L17 21 L12 17 L7 21 L8.5 14 L4 10 L10 9 Z"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5 L20 20"/>',
  droplet:'<path d="M12 3 Q5 11 5 15 A7 7 0 0 0 19 15 Q19 11 12 3 Z"/>',
  leaf:'<path d="M5 19 Q5 5 19 5 Q19 19 5 19 Z"/><path d="M5 19 L13 11"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  pencil:'<path d="M16 4 L20 8 L8 20 L4 20 L4 16 Z"/><path d="M14 6 L18 10"/>',
  eye:'<path d="M2 12 Q7 5 12 5 Q17 5 22 12 Q17 19 12 19 Q7 19 2 12 Z"/><circle cx="12" cy="12" r="3"/>',
  hands:'<path d="M9 5 V13 M9 8 H12 V13 M12 9 H15 V13 M15 10 H17 V13"/><path d="M5 13 V18 A4 4 0 0 0 9 22 H15 A4 4 0 0 0 19 18 V11"/>',
  flower:'<circle cx="12" cy="12" r="2"/><path d="M12 10 Q9 6 12 4 Q15 6 12 10 Z"/><path d="M14 12 Q18 9 20 12 Q18 15 14 12 Z"/><path d="M12 14 Q9 18 12 20 Q15 18 12 14 Z"/><path d="M10 12 Q6 9 4 12 Q6 15 10 12 Z"/>',
  spa:'<path d="M12 4 Q8 8 12 12 Q16 8 12 4 Z"/><path d="M4 12 Q8 16 12 12 Q8 8 4 12 Z"/><path d="M20 12 Q16 16 12 12 Q16 8 20 12 Z"/><path d="M12 20 Q16 16 12 12 Q8 16 12 20 Z"/>',
  foot:'<path d="M9 21 Q6 18 7 14 L8 8 A4 4 0 0 1 16 8 L17 14 Q18 18 15 21 Z"/><circle cx="10" cy="5" r="1.2"/><circle cx="13" cy="3.5" r="1"/>',
  refresh:'<path d="M3 12 A9 9 0 1 1 12 21 M3 7 V12 H8"/>',
  check:'<path d="M4 12 L10 18 L20 6"/>',
  warning:'<path d="M12 4 L22 20 L2 20 Z"/><path d="M12 11 V15"/><circle cx="12" cy="17.5" r="0.8" fill="currentColor"/>',
  question:'<circle cx="12" cy="12" r="9"/><path d="M9 9 A3 3 0 0 1 15 9 Q15 11 12 13 V14"/><circle cx="12" cy="17.5" r="0.7" fill="currentColor"/>',
  link:'<path d="M9 15 L15 9"/><path d="M11 6 L13 4 A4 4 0 0 1 18 9 L17 10"/><path d="M13 18 L11 20 A4 4 0 0 1 6 15 L7 14"/>',
  circles:'<circle cx="12" cy="12" r="8.5" opacity="0.22"/><circle cx="12" cy="12" r="5.5" opacity="0.38"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/><circle cx="12" cy="3.5" r="1.6" fill="currentColor"/><circle cx="19.4" cy="7.75" r="1.6" fill="currentColor"/><circle cx="19.4" cy="16.25" r="1.6" fill="currentColor"/><circle cx="12" cy="20.5" r="1.6" fill="currentColor"/><circle cx="4.6" cy="16.25" r="1.6" fill="currentColor"/><circle cx="4.6" cy="7.75" r="1.6" fill="currentColor"/>',
  glowCircle:'<circle cx="12" cy="12" r="8.5" opacity="0.22"/><circle cx="12" cy="12" r="5.5" opacity="0.38"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/><circle cx="12" cy="3.5" r="1.6" fill="currentColor"/><circle cx="19.4" cy="7.75" r="1.6" fill="currentColor"/><circle cx="19.4" cy="16.25" r="1.6" fill="currentColor"/><circle cx="12" cy="20.5" r="1.6" fill="currentColor"/><circle cx="4.6" cy="16.25" r="1.6" fill="currentColor"/><circle cx="4.6" cy="7.75" r="1.6" fill="currentColor"/>',
  send:'<path d="M 3 12 L 21 4 L 14 21 L 12 13 Z"/>',
  people:'<circle cx="8" cy="9" r="3"/><path d="M 3 20 A 5 5 0 0 1 13 20"/><circle cx="17" cy="9" r="3" opacity="0.7"/><path d="M 15 15 A 5 5 0 0 1 21 20" opacity="0.7"/>',
  plus:'<path d="M 12 5 V 19 M 5 12 H 19"/>',
  comment:'<path d="M 4 4 H 20 A 2 2 0 0 1 22 6 V 14 A 2 2 0 0 1 20 16 H 12 L 6 21 V 16 H 4 A 2 2 0 0 1 2 14 V 6 A 2 2 0 0 1 4 4 Z"/>'
};
function iconHtml(name,size,color){const s=size||24;const c=color||'currentColor';const p=ICONS[name]||ICONS.sparkle;return '<svg xmlns="http://www.w3.org/2000/svg" data-icon-name="'+name+'" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';}
function renderStaticIcons(){document.querySelectorAll('[data-icon]').forEach(el=>{const name=el.dataset.icon;const size=parseInt(el.dataset.iconSize||'28',10);el.innerHTML=iconHtml(name,size);});}

// === GLÓW-CIRCLES (sotsiaalne süsteem) ===
window.myCircles=[];
window.currentCircleDetail=null;
window.currentShareData=null; // hoiab hetkel analüüsitud pildi ja AI-tulemuse
window.selectedShareCircles=[];

async function apiCall(path,options){
  const opts=options||{};
  opts.headers=opts.headers||{};
  opts.headers['Content-Type']='application/json';
  if(isLoggedIn())opts.headers['Authorization']='Bearer '+getSessionToken();
  const res=await fetch(API_BASE+path,opts);
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw new Error(data.error||('HTTP '+res.status));
  return data;
}

function initialsFrom(email){const s=(email||'?').split('@')[0]||'?';return s.slice(0,2).toUpperCase();}
function relTime(ts){const d=Date.now()-ts;if(d<60000)return window.t('time.now','nüüd');if(d<3600000)return Math.floor(d/60000)+' min';if(d<86400000)return Math.floor(d/3600000)+'h';return Math.floor(d/86400000)+' '+window.t('time.days','päeva');}
function expiryTime(expiresAt){const left=expiresAt-Date.now();if(left<=0)return window.t('time.expiring','kohe kustub');if(left<3600000)return Math.ceil(left/60000)+' '+window.t('time.minleft','min järel');return Math.ceil(left/3600000)+window.t('time.hleft','h järel');}

async function openCirclesPanel(){
  document.getElementById('circlesBackdrop').classList.add('show');
  document.getElementById('circlesPanel').classList.add('show');
  if(!isLoggedIn()){document.getElementById('circlesEmptyLogin').style.display='block';document.getElementById('circlesMyView').style.display='none';return;}
  document.getElementById('circlesEmptyLogin').style.display='none';
  switchCirclesTab('my');
  await loadMyCircles();
}
function closeCirclesPanel(){document.getElementById('circlesBackdrop').classList.remove('show');document.getElementById('circlesPanel').classList.remove('show');}

function switchCirclesTab(tab){
  document.querySelectorAll('.circles-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.getElementById('circlesMyView').style.display=tab==='my'?'block':'none';
  document.getElementById('circlesFeedView').style.display=tab==='feed'?'block':'none';
  document.getElementById('circlesDetailView').style.display='none';
  if(tab==='my')loadMyCircles();else if(tab==='feed')loadFeed();
}

async function loadMyCircles(){
  const v=document.getElementById('circlesMyView');
  v.innerHTML='<div style="text-align:center;padding:24px;color:rgba(255,255,255,0.5);font-family:\'Cormorant Garamond\',serif;font-style:italic">'+t('circ.loading','Laen Circle\'id...')+'</div>';
  try{
    const data=await apiCall('/api/circles');
    window.myCircles=data.circles||[];
    renderMyCircles();
  }catch(e){v.innerHTML='<div style="text-align:center;color:#e8a090;padding:20px">'+t('gen.error','Viga')+': '+esc(e.message)+'</div>';}
}

function renderMyCircles(){
  const v=document.getElementById('circlesMyView');
  let html='';
  if(window.myCircles.length===0){
    html+='<div class="feed-empty"><div class="feed-empty-icon">✦</div><div class="feed-empty-text">'+t('circ.empty','<strong>Sul pole veel ühtegi ringi.</strong><br>Loo uus ring ja kutsu sõpru — või liitu sõbra jagatud lingiga (nupp „Liitu koodiga" all).')+'</div></div>';
  }else{
    html+='<div style="font-size:10px;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;font-family:\'DM Mono\',monospace;margin-bottom:10px">'+t('circ.your','Sinu Circle\'id')+'</div>';
    window.myCircles.forEach(c=>{
      html+='<div class="circle-item" onclick="openCircleDetail(\''+esc(c.id)+'\')">'
       +'<div class="circle-emoji">'+esc(c.icon||'✨')+'</div>'
       +'<div class="circle-info"><div class="circle-name">'+esc(c.name)+'</div>'
       +'<div class="circle-meta">'+(c.members?c.members.length:1)+' '+t('circ.members','liiget')+' · '+esc(c.id.slice(2,8))+'</div></div>'
       +'<div class="circle-arrow">→</div></div>';
    });
  }
  html+='<div style="display:flex;gap:8px;margin-top:12px">';
  html+='<button class="circle-create-btn" style="margin-top:0;flex:1" onclick="showCreateCircleForm()"><span data-icon="plus" data-icon-size="14"></span>'+t('circ.create','Loo ring')+'</button>';
  html+='<button class="circle-create-btn" style="margin-top:0;flex:1;border-style:solid;border-color:rgba(155,143,181,0.5)" onclick="showJoinCodeForm()">🔗 '+t('circ.join','Liitu koodiga')+'</button>';
  html+='</div>';
  html+='<div id="createCircleFormWrap"></div>';
  html+='<div id="joinCodeFormWrap"></div>';
  html+='<div style="font-size:12px;color:rgba(255,255,255,0.55);line-height:1.5;margin-top:14px;text-align:center;font-family:\'Cormorant Garamond\',serif;font-style:italic">'+t('circ.helper','Loo ring ja kutsu sõbrad <strong style="color:var(--gold);font-style:normal">ühe lingiga</strong>. Kõik, kes liituvad, on ühes grupis — näevad üksteist, jagavad pilte ja vestlevad.')+'</div>';
  v.innerHTML=html;renderStaticIcons();
}

function showCreateCircleForm(){
  if(typeof cancelJoinCode==='function')cancelJoinCode();
  const w=document.getElementById('createCircleFormWrap');
  const icons=['✨','💫','🌸','🎀','🌟','💎','🔥','👗','🎭','🌙'];
  let iconHtml='';
  icons.forEach((ic,i)=>{iconHtml+='<div class="circle-icon-opt'+(i===0?' selected':'')+'" data-icon-emoji="'+ic+'" onclick="selectCircleIcon(this)">'+ic+'</div>';});
  w.innerHTML='<div class="circle-create-form" style="margin-top:14px"><div style="font-size:10px;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;font-family:\'DM Mono\',monospace;margin-bottom:10px">'+t('circ.new','Uus Circle')+'</div>'
    +'<input class="circle-input" id="newCircleName" placeholder="'+t('circ.name.ph','Nimi (nt. Beauty Squad)')+'" maxlength="50">'
    +'<div style="font-size:10px;letter-spacing:.2em;color:rgba(255,255,255,0.55);text-transform:uppercase;font-family:\'DM Mono\',monospace;margin-bottom:8px">'+t('circ.chooseicon','Vali ikoon')+'</div>'
    +'<div class="circle-icons-row">'+iconHtml+'</div>'
    +'<div class="circle-form-actions">'
    +'<button class="circle-btn secondary" onclick="cancelCreateCircle()">'+t('gen.cancel','Tühista')+'</button>'
    +'<button class="circle-btn primary" onclick="submitCreateCircle()">'+t('circ.createbtn','Loo Circle')+'</button>'
    +'</div></div>';
  setTimeout(()=>document.getElementById('newCircleName').focus(),100);
}
function selectCircleIcon(el){document.querySelectorAll('.circle-icon-opt').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');}
function cancelCreateCircle(){document.getElementById('createCircleFormWrap').innerHTML='';}

function showJoinCodeForm(){
  cancelCreateCircle();
  const w=document.getElementById('joinCodeFormWrap');
  if(!w)return;
  w.innerHTML='<div class="circle-create-form" style="margin-top:14px"><div style="font-size:10px;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;font-family:\'DM Mono\',monospace;margin-bottom:10px">'+t('circ.join.title','Liitu olemasoleva ringiga')+'</div>'
    +'<input class="circle-input" id="joinCodeInput" placeholder="'+t('circ.join.ph','Kleebi kutselink või kood')+'" autocomplete="off">'
    +'<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:12px">'+t('circ.join.hint','Sõber saatis sulle lingi (nt WhatsAppis)? Kleebi see siia — ei pea uut ringi looma.')+'</div>'
    +'<div class="circle-form-actions">'
    +'<button class="circle-btn secondary" onclick="cancelJoinCode()">'+t('gen.cancel','Tühista')+'</button>'
    +'<button class="circle-btn primary" onclick="submitJoinCode()">'+t('circ.join.btn','Liitu')+'</button>'
    +'</div></div>';
  setTimeout(()=>{const el=document.getElementById('joinCodeInput');if(el)el.focus();},100);
}
function cancelJoinCode(){const w=document.getElementById('joinCodeFormWrap');if(w)w.innerHTML='';}
async function submitJoinCode(){
  const raw=(document.getElementById('joinCodeInput').value||'').trim();
  if(!raw){alert(window.t('circ.join.ph','Kleebi kutselink või kood'));return;}
  let code=raw;
  const mm=raw.match(/[?&]join=([^&\s]+)/i);
  if(mm)code=decodeURIComponent(mm[1]);
  code=code.trim().replace(/[\/\s]+$/,'');
  if(!code){alert(window.t('circ.nocode','Koodi ei leitud lingist'));return;}
  try{
    const data=await apiCall('/api/circles/join/'+encodeURIComponent(code),{method:'POST'});
    cancelJoinCode();
    const t=document.getElementById('friendToast');const txt=document.getElementById('friendToastText');
    if(t&&txt){const nm=(data.circle&&data.circle.name)?esc(data.circle.name):'ring';txt.innerHTML='<strong>✦ '+window.t('circ.joined','Liitusid ringiga')+': '+nm+'</strong>';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),4500);}
    await loadMyCircles();
  }catch(e){alert(window.t('circ.joinfail','Liitumine ebaõnnestus')+': '+e.message+'\n\n'+window.t('circ.joinfail2','Kontrolli, et link/kood on õige ja pole aegunud (48h).'));}
}

async function submitCreateCircle(){
  const name=document.getElementById('newCircleName').value.trim();
  const icon=document.querySelector('.circle-icon-opt.selected')?.dataset.iconEmoji||'✨';
  if(name.length<2){alert(window.t('circ.name.err','Palun kirjuta Circle\'i nimi (vähemalt 2 tähemärki)'));return;}
  try{const data=await apiCall('/api/circles/create',{method:'POST',body:JSON.stringify({name,icon})});
    window.myCircles.unshift(data.circle);
    cancelCreateCircle();
    renderMyCircles();
    openCircleDetail(data.circle.id);
  }catch(e){alert(window.t('gen.error','Viga')+': '+e.message);}
}

async function openCircleDetail(id){
  const circle=window.myCircles.find(c=>c.id===id);if(!circle){alert(t('circ.notfound','Circle\'i ei leitud'));return;}
  window.currentCircleDetail=circle;
  document.getElementById('circlesMyView').style.display='none';
  document.getElementById('circlesFeedView').style.display='none';
  const v=document.getElementById('circlesDetailView');v.style.display='block';
  v.innerHTML='<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.5)">'+t('circ.creatinglink','Loon kutselinki...')+'</div>';
  let inviteCode='';
  try{const inv=await apiCall('/api/circles/'+id+'/invite',{method:'POST'});inviteCode=inv.code;}catch(e){}
  const url=(location.origin+location.pathname).replace(/index\.html$/i,'').replace(/\/$/,'')+'/?join='+inviteCode;
  let html='<div class="circle-detail-head"><button class="circle-detail-back" onclick="switchCirclesTab(\'my\')">← '+t('gen.back','Tagasi')+'</button></div>'
    +'<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">'
    +'<div class="circle-emoji" style="width:56px;height:56px;font-size:26px">'+esc(circle.icon)+'</div>'
    +'<div><div style="font-family:\'Cormorant Garamond\',serif;font-size:22px;color:#fff;font-weight:600">'+esc(circle.name)+'</div>'
    +'<div style="font-size:11px;color:rgba(255,255,255,0.5);font-family:\'DM Mono\',monospace">'+(circle.members?circle.members.length:1)+' '+t('circ.members','liiget')+'</div></div></div>';
  if(inviteCode){
    html+='<div class="circle-invite-box">'
    +'<div class="circle-invite-label">'+t('circ.invite.label','Kutsu sõbrad · kehtib 48h')+'</div>'
    +'<div style="font-size:12px;color:rgba(255,255,255,0.65);margin-bottom:8px;line-height:1.5">'+t('circ.invite.desc','Saada see link sõbrale (WhatsApp, SMS). Kui ta lingi avab, <strong style="color:var(--gold)">liitub ta selle ringiga</strong> ja kõik liikmed näevad teda.')+'</div>'
    +'<div class="circle-invite-code">'+esc(url)+'</div>'
    +'<div class="circle-invite-actions">'
    +'<button class="circle-btn primary" onclick="copyText(\''+esc(url)+'\',this)">'+t('circ.copylink','Kopeeri link')+'</button>'
    +'<button class="circle-btn secondary" onclick="shareInviteLink(\''+esc(url)+'\',\''+esc(circle.name)+'\')">'+t('gen.share','Jaga')+'</button>'
    +'</div>'
    +'<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(255,255,255,0.55)">'+t('circ.invite.orcode','Või ütle sõbrale see kood, mille ta sisestab „Liitu koodiga" alla:')+'<br><strong style="color:var(--gold-bright);letter-spacing:.2em;font-size:14px;font-family:\'DM Mono\',monospace">'+esc(inviteCode)+'</strong></div>'
    +'</div>';
  }
  html+='<button class="circle-detail-chat-btn" onclick="openCircleChat(\''+esc(circle.id)+'\')">'
    +'<span data-icon="comment" data-icon-size="16"></span>'
    +t('circ.openchat','Ava vestlus — kirjuta sõbrannadega')
    +'</button>';
  html+='<div style="font-size:10px;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;font-family:\'DM Mono\',monospace;margin-bottom:8px">'+t('circ.members.label','Liikmed')+'</div>'
    +'<div class="circle-members-list">';
  (circle.members||[]).forEach(m=>{
    html+='<div class="circle-member"><div class="circle-member-avatar">'+esc(initialsFrom(m))+'</div>'
    +'<div class="circle-member-email">'+esc(m)+'</div>'
    +(m===circle.ownerEmail?'<div class="circle-member-owner">'+t('circ.owner','Omanik')+'</div>':'')+'</div>';
  });
  html+='</div>';
  html+='<button class="circle-btn secondary" style="width:100%" onclick="leaveCircle(\''+esc(circle.id)+'\')">'+t('circ.leave','Lahku Circle\'ist')+'</button>';
  v.innerHTML=html;
  renderStaticIcons();
}

function copyText(txt,btn){navigator.clipboard.writeText(txt).then(()=>{const o=btn.textContent;btn.textContent=window.t('friendm.copied','✓ Kopeeritud');setTimeout(()=>btn.textContent=o,2000);}).catch(()=>alert(window.t('copy.fail','Ei õnnestu kopeerida')));}
async function shareInviteLink(url,name){if(navigator.share){try{await navigator.share({title:'GLÓW Circle: '+name,text:window.t('circ.sharetext','Liitu minu Circle\'iga GLÓW app\'is:')+' '+name,url});}catch(_){}}else{copyText(url,{textContent:window.t('gen.share','Jaga')});}}

async function leaveCircle(id){
  if(!confirm(window.t('circ.leave.confirm','Kas lahkud sellest Circle\'ist?')))return;
  try{await apiCall('/api/circles/'+id+'/leave',{method:'POST'});
    window.myCircles=window.myCircles.filter(c=>c.id!==id);
    switchCirclesTab('my');
  }catch(e){alert(window.t('gen.error','Viga')+': '+e.message);}
}

// ============ CIRCLE VESTLUS (chat) ============
window.chatState={circleId:null,cat:'vaba',lastTs:0,pollTimer:null,messages:[],myEmail:null};
const CHAT_CATS=[
  {id:'vaba',lbl:'Vaba jutt'},
  {id:'ilu',lbl:'Ilu & meik'},
  {id:'riided',lbl:'Riided'},
  {id:'toit',lbl:'Toit'},
  {id:'sport',lbl:'Sport'}
];

async function openCircleChat(circleId){
  const circle=window.myCircles.find(c=>c.id===circleId);
  if(!circle){alert(window.t('circ.notfound','Circle\'i ei leitud'));return;}
  window.chatState.circleId=circleId;
  window.chatState.cat='vaba';
  window.chatState.lastTs=0;
  window.chatState.messages=[];
  window.chatState.myEmail=(window.currentUser&&window.currentUser.email)||localStorage.getItem('glow_session_email')||'';
  document.getElementById('circlesMyView').style.display='none';
  document.getElementById('circlesFeedView').style.display='none';
  const v=document.getElementById('circlesDetailView');v.style.display='block';
  v.innerHTML='<div class="chat-wrap">'
    +'<div class="chat-head">'
    +'<button class="chat-back" onclick="openCircleDetail(\''+esc(circleId)+'\')">← Circle</button>'
    +'<div class="chat-title"><span class="chat-title-icon">'+esc(circle.icon||'✦')+'</span>'+esc(circle.name)+'</div>'
    +'</div>'
    +'<div class="chat-scroll" id="chatScroll"><div class="chat-empty"><div class="chat-empty-icon">✦</div>'+t('chat.loading','Laen vestlust...')+'</div></div>'
    +'<div class="chat-input-wrap">'
    +'<textarea class="chat-input" id="chatInput" rows="1" placeholder="'+t('chat.ph','Kirjuta sõbrannadele...')+'" maxlength="800" onkeydown="chatKey(event)" oninput="autoGrowChat(this)"></textarea>'
    +'<button class="chat-send" id="chatSendBtn" onclick="sendChatMessage()">'+t('chat.send','Saada')+'</button>'
    +'</div>'
    +'</div>';
  await loadChatMessages(true);
  startChatPolling();
}

function switchChatCat(cat){
  window.chatState.cat=cat;
  window.chatState.lastTs=0;
  window.chatState.messages=[];
  document.querySelectorAll('.chat-cat').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));
  loadChatMessages(true);
}

async function loadChatMessages(replace){
  const cs=window.chatState;
  if(!cs.circleId)return;
  const q=new URLSearchParams();
  if(!replace&&cs.lastTs)q.set('since',String(cs.lastTs));
  try{
    const data=await apiCall('/api/circles/'+cs.circleId+'/messages?'+q.toString());
    const msgs=data.messages||[];
    if(replace){cs.messages=msgs;}else{msgs.forEach(m=>{if(!cs.messages.find(x=>x.id===m.id))cs.messages.push(m);});}
    if(cs.messages.length)cs.lastTs=Math.max(...cs.messages.map(m=>m.ts||0));
    renderChatMessages();
  }catch(e){
    const s=document.getElementById('chatScroll');
    if(s&&replace)s.innerHTML='<div class="chat-empty" style="color:#e8a090">'+window.t('gen.error','Viga')+': '+esc(e.message)+'</div>';
  }
}

// Selgelt eristuvad värvid (ei kuldseid — kuld on reserveeritud "Sina" jaoks)
const CIRCLE_MEMBER_COLORS=['#7ec8e3','#e0768f','#82c99a','#d98fd0','#e89a76','#9b8fb5','#6dc2b0','#b7a0e6'];
function memberColor(email){
  const s=String(email||'?');
  let h=0;for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))>>>0;}
  return CIRCLE_MEMBER_COLORS[h%CIRCLE_MEMBER_COLORS.length];
}
// Värv liikme POSITSIOONI järgi ringis — nii saab iga liige garanteeritult eri värvi (mitte räsi-kokkupõrge)
function memberColorInCircle(email,members){
  const idx=(members||[]).indexOf(email);
  return idx<0 ? memberColor(email) : CIRCLE_MEMBER_COLORS[idx%CIRCLE_MEMBER_COLORS.length];
}
// Loetav nimi emailist (nt siret.puller@lhe.ee -> "Siret")
function chatDisplayName(email){
  if(!email)return'?';
  let s=String(email).split('@')[0];
  s=(s.split(/[._\-]+/)[0]||s);
  if(!s)return'?';
  return s.charAt(0).toUpperCase()+s.slice(1);
}

function renderChatMessages(){
  const s=document.getElementById('chatScroll');if(!s)return;
  const cs=window.chatState;
  if(!cs.messages.length){
    s.innerHTML='<div class="chat-empty"><div class="chat-empty-icon">✦</div>'+t('chat.empty','Ole esimene, kes siia kirjutab.')+'<br><span style="font-size:12px;opacity:.7">'+t('chat.empty2','Räägi kõigest — stiil, meik, riided, toit, treening.')+'</span></div>';
    return;
  }
  let html='';
  const nearBottom=(s.scrollHeight-s.scrollTop-s.clientHeight)<80;
  let prevEmail=null, prevTs=0;
  const _circle=(window.myCircles||[]).find(c=>c.id===cs.circleId);
  const _members=(_circle&&_circle.members)||[];
  cs.messages.sort((a,b)=>(a.ts||0)-(b.ts||0)).forEach(m=>{
    const mine=(m.email===cs.myEmail);
    const col=mine?'var(--gold-bright)':memberColorInCircle(m.email,_members);
    const name=mine?'Mina':chatDisplayName(m.email);
    const time=fmtChatTime(m.ts);
    // Näita nime uuesti kui saatja muutub VÕI kui eelmisest sõnumist on möödas >5 min.
    // Iga sõnumi juures on ALATI kellaaeg (grupeeritud sõnumitel ainult aeg).
    const gap=((m.ts||0)-prevTs)>5*60*1000;
    const showName=(m.email!==prevEmail)||gap;
    prevEmail=m.email;prevTs=m.ts||0;
    let meta;
    if(showName){
      const av=mine?'':'<span class="chat-avatar" style="background:'+col+'">'+esc(initialsFrom(m.email||'?'))+'</span>';
      meta='<div class="chat-msg-meta">'+av+'<span style="color:'+col+';font-weight:600">'+esc(name)+'</span> · '+esc(time)+'</div>';
    }else{
      meta='<div class="chat-msg-meta chat-msg-meta-timeonly">'+esc(time)+'</div>';
    }
    const style=mine?'':' style="border-left:3px solid '+col+'"';
    html+='<div class="chat-msg '+(mine?'mine':'theirs')+'"'+style+'>'
      +meta
      +esc(m.text).replace(/\n/g,'<br>')
      +'</div>';
  });
  s.innerHTML=html;
  if(nearBottom||cs.messages.length<=8)s.scrollTop=s.scrollHeight;
}

function fmtChatTime(ts){if(!ts)return'';const d=new Date(ts);const now=new Date();const sameDay=d.toDateString()===now.toDateString();const hh=String(d.getHours()).padStart(2,'0');const mm=String(d.getMinutes()).padStart(2,'0');if(sameDay)return hh+':'+mm;const dd=String(d.getDate()).padStart(2,'0');const mo=String(d.getMonth()+1).padStart(2,'0');return dd+'.'+mo+' '+hh+':'+mm;}

function autoGrowChat(el){el.style.height='auto';el.style.height=Math.min(120,el.scrollHeight)+'px';}

function chatKey(e){if(e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey){e.preventDefault();sendChatMessage();}}

async function sendChatMessage(){
  const inp=document.getElementById('chatInput');if(!inp)return;
  const text=inp.value.trim();if(!text)return;
  const cs=window.chatState;if(!cs.circleId)return;
  const btn=document.getElementById('chatSendBtn');btn.disabled=true;
  try{
    const data=await apiCall('/api/circles/'+cs.circleId+'/messages',{method:'POST',body:JSON.stringify({text})});
    if(data.message){cs.messages.push(data.message);cs.lastTs=Math.max(cs.lastTs,data.message.ts||0);renderChatMessages();}
    inp.value='';autoGrowChat(inp);
  }catch(e){alert(t('chat.sendfail','Sõnumi saatmine ebaõnnestus')+': '+e.message);}
  finally{btn.disabled=false;}
}

function startChatPolling(){
  stopChatPolling();
  window.chatState.pollTimer=setInterval(()=>{
    if(!window.chatState.circleId){stopChatPolling();return;}
    if(!document.getElementById('chatScroll')){stopChatPolling();return;}
    loadChatMessages(false);
  },6000);
}
function stopChatPolling(){if(window.chatState.pollTimer){clearInterval(window.chatState.pollTimer);window.chatState.pollTimer=null;}}

// Peata polling kui Circles paneel suletakse
(function(){const orig=window.closeCirclesPanel;if(typeof orig==='function'){window.closeCirclesPanel=function(){stopChatPolling();window.chatState.circleId=null;return orig.apply(this,arguments);};}})();

async function loadFeed(){
  const v=document.getElementById('circlesFeedView');
  v.innerHTML='<div style="text-align:center;padding:24px;color:rgba(255,255,255,0.5);font-family:\'Cormorant Garamond\',serif;font-style:italic">'+t('feed.loading','Laen uudisvoogu...')+'</div>';
  try{const data=await apiCall('/api/feed');renderFeed(data.shares||[],data.circles||{});}
  catch(e){v.innerHTML='<div style="text-align:center;color:#e8a090;padding:20px">'+t('gen.error','Viga')+': '+esc(e.message)+'</div>';}
}

function renderFeed(shares,circleMeta){
  const v=document.getElementById('circlesFeedView');
  if(shares.length===0){v.innerHTML='<div class="feed-empty"><div class="feed-empty-icon">✦</div><div class="feed-empty-text">'+t('feed.empty','Voog on tühi.<br>Kui sina või sinu Circle\'i sõber jagab midagi, kuvatakse see siin.')+'</div></div>';return;}
  let html='';
  shares.forEach(s=>{html+=renderShareCard(s,circleMeta);});
  v.innerHTML=html;
}

function renderShareCard(s,circleMeta){
  const meta=circleMeta||{};
  const cids=s.circleIds||[];
  const cname=cids.length&&meta[cids[0]]?meta[cids[0]].name:'Circle';
  const cicon=cids.length&&meta[cids[0]]?meta[cids[0]].icon:'✨';
  let reactHtml='';
  const emojis=['🔥','💭','👗','✨','❤️','👎'];
  const me=localStorage.getItem('glow_session_email')||'';
  emojis.forEach(em=>{const arr=(s.reactions&&s.reactions[em])||[];const active=arr.includes(me)?' active':'';
    reactHtml+='<button class="share-reaction'+active+'" onclick="toggleReact(\''+esc(s.id)+'\',\''+em+'\')">'+em+(arr.length?'<span class="share-reaction-count">'+arr.length+'</span>':'')+'</button>';
  });
  let commHtml='';
  (s.comments||[]).slice(-5).forEach(c=>{
    commHtml+='<div class="share-comment"><div class="share-comment-avatar">'+esc(initialsFrom(c.email))+'</div>'
    +'<div class="share-comment-body"><div class="share-comment-author">'+esc(c.email.split('@')[0])+'</div>'
    +'<div class="share-comment-text">'+esc(c.text)+'</div></div></div>';
  });
  return '<div class="share-card-feed" data-share-id="'+esc(s.id)+'">'
    +'<div class="share-card-head">'
    +'<div class="share-card-avatar">'+esc(initialsFrom(s.authorEmail))+'</div>'
    +'<div class="share-card-meta"><div class="share-card-author">'+esc(s.authorEmail.split('@')[0])+'</div>'
    +'<div class="share-card-time">'+esc(cicon)+' '+esc(cname)+' · '+relTime(s.createdAt)+' '+t('feed.ago','tagasi')+'</div></div>'
    +'<div class="share-card-time-badge">'+esc(expiryTime(s.expiresAt))+'</div>'
    +'</div>'
    +(s.imageBase64?'<img class="share-card-photo" src="data:image/jpeg;base64,'+esc(s.imageBase64)+'" alt="jagatud pilt">':'')
    +(s.aiVerdict?'<div class="share-card-verdict">✦ AI: '+esc(s.aiVerdict)+'</div>':'')
    +(s.userMessage?'<div class="share-card-message">'+esc(s.userMessage)+'</div>':'')
    +'<div class="share-reactions">'+reactHtml+'</div>'
    +'<div class="share-comments">'+commHtml+'</div>'
    +'<div class="share-comment-input-row">'
    +'<input class="share-comment-input" placeholder="'+t('feed.comment.ph','Kirjuta kommentaar...')+'" data-share-id="'+esc(s.id)+'" onkeydown="if(event.key===\'Enter\')sendComment(this)">'
    +'<button class="share-comment-send" onclick="sendComment(this.previousElementSibling)">'+t('chat.send','Saada')+'</button>'
    +'</div>'
    +'</div>';
}

async function toggleReact(shareId,emoji){
  try{const data=await apiCall('/api/shares/'+shareId+'/react',{method:'POST',body:JSON.stringify({emoji})});
    // Uuenda ainult vastavat kaarti
    const card=document.querySelector('.share-card-feed[data-share-id="'+shareId+'"]');
    if(card){const share=await apiCall('/api/shares/'+shareId);const html=renderShareCard(share.share,{});card.outerHTML=html;}
  }catch(e){alert(window.t('gen.error','Viga')+': '+e.message);}
}
async function sendComment(input){
  const shareId=input.dataset.shareId;const text=input.value.trim();if(!text)return;
  try{await apiCall('/api/shares/'+shareId+'/comment',{method:'POST',body:JSON.stringify({text})});
    input.value='';
    const card=document.querySelector('.share-card-feed[data-share-id="'+shareId+'"]');
    if(card){const share=await apiCall('/api/shares/'+shareId);const html=renderShareCard(share.share,{});card.outerHTML=html;}
  }catch(e){alert(window.t('gen.error','Viga')+': '+e.message);}
}

// Analüüsi järel — "Küsi sõprade arvamust" nupp
// Vähenda pilti enne salvestamist — muidu saadetakse suurte piltidega poolik base64 KV-sse
function downscaleImageForShare(dataUrl, maxDim, quality){
  return new Promise((resolve)=>{
    if(!dataUrl){resolve(null);return;}
    const img=new Image();
    img.onload=function(){
      let w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
      if(!w||!h){resolve(dataUrl);return;}
      const md=maxDim||900;
      if(w>md||h>md){const r=Math.min(md/w,md/h);w=Math.round(w*r);h=Math.round(h*r);}
      const c=document.createElement('canvas');c.width=w;c.height=h;
      const ctx=c.getContext('2d');ctx.drawImage(img,0,0,w,h);
      try{resolve(c.toDataURL('image/jpeg',quality||0.75));}
      catch(_){resolve(dataUrl);}
    };
    img.onerror=function(){resolve(dataUrl);};
    img.src=dataUrl;
  });
}
async function saveShareContext(parsed,dataUrl,mode){
  let smallUrl=null;
  if(dataUrl){
    try{smallUrl=await downscaleImageForShare(dataUrl,900,0.75);}
    catch(_){smallUrl=dataUrl;}
  }
  window.currentShareData={
    imageBase64:(smallUrl||'').split(',')[1]||null,
    aiVerdict:parsed.verdict||'',
    aiSummary:(parsed.feedback||'').slice(0,600),
    mode:mode||'meik'
  };
}
function openShareToModal(){
  if(!isLoggedIn()){showLoginModal('Sisselogimine vajalik jagamiseks');return;}
  if(!window.currentShareData){alert(window.t('share.needanalysis','Tee kõigepealt analüüs'));return;}
  if(window.myCircles.length===0){
    if(confirm(window.t('circ.none.confirm','Sul pole veel Circle\'e. Kas soovid nüüd luua?'))){openCirclesPanel();}
    return;
  }
  // Vaikimisi märgistame KÕIK circle'id (kasutaja soov)
  window.selectedShareCircles=window.myCircles.map(c=>c.id);
  const list=document.getElementById('shareToList');
  let html='';
  window.myCircles.forEach(c=>{
    html+='<div class="share-to-item selected" data-cid="'+esc(c.id)+'" onclick="toggleShareCircle(this)">'
    +'<div class="share-to-check">✓</div>'
    +'<div class="circle-emoji" style="width:34px;height:34px;font-size:17px">'+esc(c.icon)+'</div>'
    +'<div class="circle-info" style="flex:1"><div class="circle-name" style="font-size:15px">'+esc(c.name)+'</div>'
    +'<div class="circle-meta">'+(c.members?c.members.length:1)+' liige</div></div></div>';
  });
  list.innerHTML=html;
  document.getElementById('shareToMessage').value='';
  document.getElementById('shareToModal').classList.add('show');
}
function toggleShareCircle(el){const id=el.dataset.cid;el.classList.toggle('selected');if(el.classList.contains('selected'))window.selectedShareCircles.push(id);else window.selectedShareCircles=window.selectedShareCircles.filter(x=>x!==id);}
function closeShareToModal(){document.getElementById('shareToModal').classList.remove('show');}
async function submitShareToCircles(){
  const cids=[...new Set(window.selectedShareCircles)];
  if(cids.length===0){alert(window.t('share.pickcircle','Vali vähemalt üks Circle'));return;}
  const msg=document.getElementById('shareToMessage').value.trim();
  const d=window.currentShareData;
  try{
    await apiCall('/api/shares',{method:'POST',body:JSON.stringify({circleIds:cids,imageBase64:d.imageBase64,aiVerdict:d.aiVerdict,aiSummary:d.aiSummary,mode:d.mode,userMessage:msg})});
    closeShareToModal();
    const t=document.getElementById('friendToast');const txt=document.getElementById('friendToastText');
    if(t&&txt){txt.innerHTML='<strong>✦ '+window.t('feed.shared','Jagatud')+' '+cids.length+' '+window.t('feed.shared2','Circle\'ile!')+'</strong>';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),4500);}
  }catch(e){alert(window.t('gen.error','Viga')+': '+e.message);}
}

// Kutselinki käsitlemine URL'is (?join=CODE)
async function handleJoinInvite(){
  const params=new URLSearchParams(window.location.search);
  const code=params.get('join');
  if(!code)return;
  if(!isLoggedIn()){localStorage.setItem('glow_pending_join',code);showLoginModal('Logi sisse, et liituda Circle\'iga');return;}
  try{const data=await apiCall('/api/circles/join/'+encodeURIComponent(code),{method:'POST'});
    try{const u=new URL(window.location.href);u.searchParams.delete('join');history.replaceState({},'',u.pathname+(u.search?u.search:'')+u.hash);}catch(_){}
    const t=document.getElementById('friendToast');const txt=document.getElementById('friendToastText');
    if(t&&txt){const nm=(data.circle&&data.circle.name)?esc(data.circle.name):'ring';txt.innerHTML='<strong>✦ '+window.t('circ.joined','Liitusid ringiga')+': '+nm+'</strong>';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),4500);}
    await loadMyCircles();
  }catch(e){alert(window.t('circ.joinfail','Liitumine ebaõnnestus')+': '+e.message);}
}

// Lõpeta rippuv kutse pärast sisselogimist (kutse salvestati enne login'i, kui kasutaja polnud veel sees)
async function resumePendingJoin(){
  const code=localStorage.getItem('glow_pending_join');
  if(!code)return false;
  localStorage.removeItem('glow_pending_join');
  try{
    const data=await apiCall('/api/circles/join/'+encodeURIComponent(code),{method:'POST'});
    try{const u=new URL(window.location.href);u.searchParams.delete('join');history.replaceState({},'',u.pathname+(u.search?u.search:'')+u.hash);}catch(_){}
    const t=document.getElementById('friendToast');const txt=document.getElementById('friendToastText');
    if(t&&txt){const nm=(data.circle&&data.circle.name)?esc(data.circle.name):'ring';txt.innerHTML='<strong>✦ '+window.t('circ.joined','Liitusid ringiga')+': '+nm+'</strong>';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),4500);}
    if(typeof loadMyCircles==='function'){try{await loadMyCircles();}catch(_){}}
    return true;
  }catch(e){return false;}
}

function updateCirclesNavBtn(){
  const card=document.getElementById('circlesInviteCard');
  const logged=isLoggedIn();
  if(card){
    card.style.display=logged?'flex':'none';
    // Peita "Uus" märk kui kasutaja on juba avanud
    const badge=document.getElementById('circlesNewBadge');
    if(badge)badge.style.display=localStorage.getItem('glow_circles_seen')?'none':'inline-block';
  }
}

function handleCirclesFirstClick(){
  // Esimesel klõpsul näita onboarding'u modaali
  if(!localStorage.getItem('glow_circles_seen')){
    localStorage.setItem('glow_circles_seen','true');
    document.getElementById('circlesOnboard').classList.add('show');
    updateCirclesNavBtn();
  }else{
    openCirclesPanel();
  }
}
function closeCirclesOnboard(){document.getElementById('circlesOnboard').classList.remove('show');}

// Peatäht nav-btn klõps: sama loogika
const _origOpenCirclesPanel=typeof openCirclesPanel==='function'?openCirclesPanel:null;
function openCirclesPanelWithOnboard(){
  if(!isLoggedIn()){showLoginModal('Circles vajavad sisselogimist');return;}
  if(!localStorage.getItem('glow_circles_seen')){
    localStorage.setItem('glow_circles_seen','true');
    document.getElementById('circlesOnboard').classList.add('show');
    updateCirclesNavBtn();
    return;
  }
  openCirclesPanel();
}

// === KÜPSISTE-BANNER ===
function shouldShowCookieBanner(){return !localStorage.getItem('glow_cookie_choice');}
function showCookieBannerIfNeeded(){if(shouldShowCookieBanner())document.getElementById('cookieBanner').classList.add('show');}
function acceptCookies(mode){localStorage.setItem('glow_cookie_choice',mode);localStorage.setItem('glow_cookie_ts',String(Date.now()));document.getElementById('cookieBanner').classList.remove('show');}

// === SESSIOON & AUTENTIMINE (magic-link) ===
function getSessionToken(){return localStorage.getItem('glow_session_token')||'';}
function setSession(token,email){if(token)localStorage.setItem('glow_session_token',token);if(email)localStorage.setItem('glow_session_email',email);updateUserMenu();}
function clearSession(){localStorage.removeItem('glow_session_token');localStorage.removeItem('glow_session_email');updateUserMenu();}
function isLoggedIn(){return !!getSessionToken();}

function updateUserMenu(){
  const um=document.getElementById('userMenu');const em=document.getElementById('userMenuEmail');const ln=document.getElementById('loginNavBtn');
  if(isLoggedIn()){
    if(em)em.textContent=localStorage.getItem('glow_session_email')||'';
    if(um)um.classList.add('show');
    if(ln)ln.classList.remove('show');
  }else{
    if(um)um.classList.remove('show');
    if(ln)ln.classList.add('show');
  }
  if(typeof updateCirclesNavBtn==='function')updateCirclesNavBtn();
}

function showLoginModal(contextMsg){
  const m=document.getElementById('loginModal');
  const ctx=document.getElementById('loginContext');
  if(contextMsg){ctx.textContent=contextMsg;ctx.style.display='block';}else{ctx.style.display='none';}
  document.getElementById('loginForm').style.display='block';
  document.getElementById('loginSent').classList.remove('show');
  document.getElementById('loginErr').textContent='';
  document.getElementById('loginEmail').value='';
  m.classList.add('show');
  setTimeout(()=>document.getElementById('loginEmail').focus(),200);
}
function closeLoginModal(){document.getElementById('loginModal').classList.remove('show');}

async function submitLoginRequest(){
  const email=document.getElementById('loginEmail').value.trim();
  const err=document.getElementById('loginErr');
  const btn=document.getElementById('loginSubmitBtn');
  err.textContent='';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent=window.t('login.err.email','Palun sisesta korrektne e-posti aadress');return;}
  btn.disabled=true;btn.textContent=window.t('login.sending','⟳ Saadan...');
  try{
    const res=await fetch(API_BASE+'/auth/request-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
    const data=await res.json();
    if(!res.ok||!data.sent)throw new Error(data.error||window.t('login.sendfail','Saatmine ebaõnnestus'));
    document.getElementById('loginSentEmail').textContent=email;
    document.getElementById('loginForm').style.display='none';
    document.getElementById('loginSent').classList.add('show');
    // Puhasta väljad ja sea fookus
    document.querySelectorAll('.code-input').forEach(i=>{i.value='';i.classList.remove('filled','error');});
    document.getElementById('codeErr').textContent='';
    bindCodeInputs();
    setTimeout(()=>{const first=document.querySelector('.code-input');if(first)first.focus();},200);
  }catch(e){err.textContent=window.t('gen.error','Viga')+': '+e.message;}
  btn.disabled=false;btn.textContent=window.t('login.send','Saada kood');
}

function bindCodeInputs(){
  const inputs=document.querySelectorAll('.code-input');
  inputs.forEach((inp,idx)=>{
    inp.oninput=e=>{
      const v=e.target.value.replace(/\D/g,'');
      e.target.value=v.slice(-1);
      if(v)e.target.classList.add('filled');else e.target.classList.remove('filled');
      if(v&&idx<inputs.length-1)inputs[idx+1].focus();
      // Kui kõik täidetud, automaatne kinnitus
      const all=Array.from(inputs).map(i=>i.value).join('');
      if(all.length===6)submitCodeVerify();
    };
    inp.onkeydown=e=>{
      if(e.key==='Backspace'&&!e.target.value&&idx>0){inputs[idx-1].focus();inputs[idx-1].value='';inputs[idx-1].classList.remove('filled');}
      if(e.key==='ArrowLeft'&&idx>0)inputs[idx-1].focus();
      if(e.key==='ArrowRight'&&idx<inputs.length-1)inputs[idx+1].focus();
    };
    inp.onpaste=e=>{
      e.preventDefault();
      const txt=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
      txt.split('').forEach((d,i)=>{if(inputs[i]){inputs[i].value=d;inputs[i].classList.add('filled');}});
      const last=Math.min(txt.length,inputs.length-1);
      if(inputs[last])inputs[last].focus();
      if(txt.length===6)submitCodeVerify();
    };
  });
}

async function submitCodeVerify(){
  const inputs=document.querySelectorAll('.code-input');
  const code=Array.from(inputs).map(i=>i.value).join('');
  const email=document.getElementById('loginSentEmail').textContent.trim();
  const err=document.getElementById('codeErr');
  const btn=document.getElementById('codeSubmitBtn');
  err.textContent='';
  if(code.length!==6){err.textContent=window.t('code.enter6','Sisesta 6-kohaline kood');return;}
  if(!email){err.textContent=window.t('code.noemail','E-post puudub, saada uus kood');return;}
  btn.disabled=true;btn.textContent=window.t('code.verifying','⟳ Kinnitan...');
  try{
    const res=await fetch(API_BASE+'/auth/verify-code',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,code})});
    const data=await res.json();
    if(!res.ok||!data.token){
      inputs.forEach(i=>{i.classList.add('error');setTimeout(()=>i.classList.remove('error'),400);});
      throw new Error(data.error||window.t('code.wrong','Vale kood'));
    }
    setSession(data.token,data.email);
    closeLoginModal();
    await syncUserFromServer();
    const joined=await resumePendingJoin();
    if(!joined){const t=document.getElementById('friendToast');const txt=document.getElementById('friendToastText');
    if(t&&txt){txt.innerHTML='<strong>'+window.t('login.done','✦ Sisse logitud!')+'</strong> '+window.t('login.synced','Krediidid sünkroniseeritud.');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),5500);}}
  }catch(e){err.textContent=e.message;}
  btn.disabled=false;btn.textContent=window.t('login.code.submit','Kinnita kood');
}

async function verifyMagicLink(token){
  try{
    const res=await fetch(API_BASE+'/auth/verify?token='+encodeURIComponent(token));
    const data=await res.json();
    if(!res.ok||!data.token)throw new Error(data.error||window.t('login.verifyfail','Verifitseerimine ebaõnnestus'));
    setSession(data.token,data.email);
    // Puhasta URL
    try{const u=new URL(window.location.href);u.searchParams.delete('verify');history.replaceState({},'',u.pathname+(u.search?u.search:'')+u.hash);}catch(_){}
    // Sünkroni saldo serveri poolelt
    await syncUserFromServer();
    const joined=await resumePendingJoin();
    if(!joined){showRefToast(0); // kasutame olemasolevat toast'i, aga tekstiga:
    const t=document.getElementById('friendToast');const txt=document.getElementById('friendToastText');
    if(t&&txt){txt.innerHTML='<strong>'+window.t('login.done','✦ Sisse logitud!')+'</strong> '+window.t('login.synced','Krediidid sünkroniseeritud.');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),5500);}}
  }catch(e){alert(window.t('login.fail','Sisselogimine ebaõnnestus')+': '+e.message);}
}

async function syncUserFromServer(){
  if(!isLoggedIn())return;
  try{
    const res=await fetch(API_BASE+'/api/me',{headers:{'Authorization':'Bearer '+getSessionToken()}});
    if(res.status===401){clearSession();return;}
    const data=await res.json();
    if(data.credits!==undefined){setCredits(data.credits);}
    if(data.email){localStorage.setItem('glow_session_email',data.email);}
    if(data.referralCode){localStorage.setItem('glow_my_code',data.referralCode);}
    updateUserMenu();
  }catch(_){}
}

function logoutUser(){if(confirm(window.t('logout.confirm','Kas logid välja? Krediidid jäävad kontosse alles kuni järgmise sisselogimiseni.')))clearSession();}

// URL param'ide käsitlemine käivitumisel — magic-link verify ja Stripe checkout return
function handleUrlParams(){
  try{
    const params=new URLSearchParams(window.location.search);
    const verify=params.get('verify');
    if(verify){verifyMagicLink(verify);return;}
    const checkout=params.get('checkout');
    if(checkout==='success'){
      setTimeout(()=>{alert(window.t('pay.success','✦ Makse õnnestus! Krediidid lisatud sinu kontosse.'));syncUserFromServer();},500);
      try{const u=new URL(window.location.href);u.searchParams.delete('checkout');u.searchParams.delete('session_id');history.replaceState({},'',u.pathname+(u.search?u.search:'')+u.hash);}catch(_){}
    }else if(checkout==='cancel'){
      setTimeout(()=>alert(window.t('pay.cancel','Makse tühistati. Sinu saldo pole muutunud.')),500);
      try{const u=new URL(window.location.href);u.searchParams.delete('checkout');history.replaceState({},'',u.pathname+(u.search?u.search:'')+u.hash);}catch(_){}
    }
  }catch(_){}
}

// === SÕBRA-SOOVITUSED ===
const REF_BONUS=5;
function generateRefCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let code='GLW';for(let i=0;i<4;i++)code+=chars[Math.floor(Math.random()*chars.length)];return code;}
function getMyRefCode(){let code=localStorage.getItem('glow_my_code');if(!code||!/^GLW[A-Z2-9]{4}$/.test(code)){code=generateRefCode();localStorage.setItem('glow_my_code',code);}return code;}
function buildRefUrl(code){return 'https://glow4me.ee/?ref='+encodeURIComponent(code||getMyRefCode());}
function checkIncomingReferral(){try{const params=new URLSearchParams(window.location.search);const ref=(params.get('ref')||'').toUpperCase().trim();if(!ref)return;if(!/^GLW[A-Z2-9]{4}$/.test(ref))return;if(ref===getMyRefCode())return;if(localStorage.getItem('glow_ref_used')==='true')return;localStorage.setItem('glow_referrer_code',ref);localStorage.setItem('glow_ref_used','true');try{setCredits(getCredits()+REF_BONUS);}catch(_){const cur=parseInt(localStorage.getItem('glow_credits')||'3',10);localStorage.setItem('glow_credits',String(cur+REF_BONUS));}// Clean URL
try{const u=new URL(window.location.href);u.searchParams.delete('ref');history.replaceState({},'',u.pathname+(u.search?u.search:'')+u.hash);}catch(_){}setTimeout(()=>showRefToast(REF_BONUS),1500);}catch(_){}}
function showRefToast(bonus){const t=document.getElementById('friendToast');const txt=document.getElementById('friendToastText');if(!t)return;txt.innerHTML=window.t('reftoast.pre','Tere tulemast!')+' <strong>+'+bonus+' '+window.t('reftoast.unit','analüüsi')+'</strong> '+window.t('reftoast.post','sõbralt');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),5500);}
function showFriendModal(){const code=getMyRefCode();const url=buildRefUrl(code);document.getElementById('friendCodeValue').textContent=code;document.getElementById('friendUrl').textContent=url.replace(/^https?:\/\//,'');document.getElementById('friendQR').src='https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=2&data='+encodeURIComponent(url);document.getElementById('friendModal').classList.add('show');document.getElementById('friendCopyTxt').textContent=window.t('friendm.copy','Kopeeri link');}
function closeFriendModal(){const m=document.getElementById('friendModal');if(m)m.classList.remove('show');}
async function shareFriendLink(){const code=getMyRefCode();const url=buildRefUrl(code);const text=window.t('friendm.sharetext','Proovi GLÓW — AI ilurakendus. Minu kutsega saad +'+REF_BONUS+' tasuta analüüsi. ✦');if(navigator.share){try{await navigator.share({title:window.t('friendm.sharetitle','GLÓW · sõbra kutse'),text:text,url:url});}catch(_){}}else{copyFriendLink(document.querySelector('.friend-copy-btn'));}}
function copyFriendLink(btn){const url=buildRefUrl();const txt=document.getElementById('friendCopyTxt');const done=()=>{if(txt)txt.textContent=window.t('friendm.copied','✓ Kopeeritud');setTimeout(()=>{if(txt)txt.textContent=window.t('friendm.copy','Kopeeri link');},2000);};if(navigator.clipboard){navigator.clipboard.writeText(url).then(done).catch(()=>{const ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);done();});}else{const ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);done();}}

// === Install Prompt (Add to Home Screen) ===
let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;localStorage.setItem('glow_install_dismissed','true');dismissInstall();});
function isStandalone(){return window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;}
function detectPlatform(){const ua=navigator.userAgent;const isIOS=/iPhone|iPad|iPod/.test(ua)&&!window.MSStream;const isAndroid=/Android/.test(ua);const isSafari=/Safari/.test(ua)&&!/CriOS|FxiOS|EdgiOS|Chrome/.test(ua);if(isIOS&&isSafari)return 'ios-safari';if(isIOS)return 'ios-other';if(isAndroid)return 'android';return 'desktop';}
function showInstallPrompt(){if(isStandalone())return;if(localStorage.getItem('glow_install_dismissed')==='true')return;const platform=detectPlatform();['installIOS','installIOSOther','installAndroid','installDesktop'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('show');});let panelId='installDesktop';if(platform==='ios-safari')panelId='installIOS';else if(platform==='ios-other')panelId='installIOSOther';else if(platform==='android')panelId='installAndroid';const panel=document.getElementById(panelId);if(panel)panel.classList.add('show');document.getElementById('installModal').classList.add('show');}
function dismissInstall(){const m=document.getElementById('installModal');if(m)m.classList.remove('show');}
function dismissInstallForever(){localStorage.setItem('glow_install_dismissed','true');dismissInstall();}
async function triggerAndroidInstall(){if(!deferredInstallPrompt){alert(window.t('install.android.manual','Chrome menüüst (⋮) vali "Install app" või "Add to Home Screen"'));return;}deferredInstallPrompt.prompt();try{const {outcome}=await deferredInstallPrompt.userChoice;if(outcome==='accepted')dismissInstall();}catch(_){}deferredInstallPrompt=null;}
function maybeShowInstallAfterAnalysis(){if(localStorage.getItem('glow_install_shown_once')==='true')return;localStorage.setItem('glow_install_shown_once','true');setTimeout(showInstallPrompt,2500);}

const FREE_CREDITS=3;
const VERDICT_CONFIG={yes:{icon:'✨',sub:'Suurepärane'},maybe:{icon:'🤔',sub:'Vajab tähelepanu'},no:{icon:'⚠️',sub:'Vajab parandust'}};
const PACKAGES=[{id:'pkg_10',count:'10',price:'0.99',unit:'0.10'},{id:'pkg_50',count:'50',price:'4.50',unit:'0.09'},{id:'pkg_100',count:'100',price:'7.99',unit:'0.08'},{id:'pkg_200',count:'200',price:'12.99',unit:'0.06'}];
const MAX_PHOTOS=10;

const DEPILE_BRANDS=[
  {id:'anesi',icon:'🌿',name:'ANESI',desc:'Nähooldus & protseduurid',en:'Facial care & treatments',focus:'näohooldus, seerumid, maskid'},
  {id:'bdr',icon:'⚗️',name:'BDR',desc:'Intensiivhooldus & koorimised',en:'Intensive care & peels',focus:'keemiline koorimine, intensiivhooldus'},
  {id:'dermia',icon:'💊',name:'DERMIA',desc:'Professionaalne nähooldus',en:'Professional facial care',focus:'nähooldus, seerumid ja kreemid'},
  {id:'christian',icon:'✨',name:'CHRISTIAN BRETON',desc:'Meik & nähooldus',en:'Makeup & facial care',focus:'meigipealne hooldus, huuled, silmad'},
  {id:'phytomer',icon:'🌊',name:'PHYTOMER',desc:'Merekosmeetika',en:'Marine cosmetics',focus:'merekosmeetika, niisutus'},
  {id:'depileve',icon:'🌸',name:'DEPILÉVE',desc:'Vahatamine & epilatsioon',en:'Waxing & depilation',focus:'vahatamine, epilatsioon'},
  {id:'allpresan',icon:'🦶',name:'ALLPRESAN',desc:'Jalahooldus',en:'Foot care',focus:'jalahooldus, jalakreemid'},
  {id:'alessandro',icon:'💅',name:'ALESSANDRO',desc:'Küüned & kulmud',en:'Nails & brows',focus:'küünehooldustooted, kulmugeel'},
  {id:'alfaparf',icon:'💇',name:'ALFAPARF',desc:'Professionaalne juuksehooldus',en:'Professional hair care',focus:'juuksevärvid, juuksehooldus'},
  {id:'pino',icon:'🤲',name:'PINO',desc:'Massaaž & kehahooldus',en:'Massage & body care',focus:'massaaži tooted, kehahooldus'},
  {id:'kurland',icon:'🌍',name:'KURLAND',desc:'Savi & spaateraapia',en:'Clay & spa therapy',focus:'savimudad, spaateraapia'}
];

// MEIGISTIILID — 9
const MAKEUP_STYLES=[
  {id:'kontor',icon:'briefcase',name:'Kontorimeik'},
  {id:'paev',icon:'sun',name:'Päevameik'},
  {id:'ohtu',icon:'moon',name:'Õhtumeik'},
  {id:'gala',icon:'wine',name:'Gala meik'},
  {id:'synnipaev',icon:'cake',name:'Sünnipäevameik'},
  {id:'pruut',icon:'crown',name:'Pruudimeik'},
  {id:'lopuaktus',icon:'graduation',name:'Lõpuaktuse meik'},
  {id:'foto',icon:'camera',name:'Fotosessioon'},
  {id:'smoky',icon:'eye',name:'Smoky eye'}
];

let meikOpts={nahatoon:null,silmad:null,kogemus:null,tugevus:null};
let selectedMeikStyle='kontor';

// SIHTKOHAD
const URITUSED_GARDEROOB=[
  {id:'arimeeting',icon:'handshake',name:'Ärimeeting',en:'Business meeting'},{id:'kontor',icon:'briefcase',name:'Kontoripäev',en:'Office day'},
  {id:'linn',icon:'shop',name:'Linnas käik',en:'Out in town'},{id:'kohtumine',icon:'coffee',name:'Sõbraga',en:'With a friend'},
  {id:'ohtusoek',icon:'dish',name:'Õhtusöök',en:'Dinner'},{id:'pidu',icon:'party',name:'Pidu',en:'Party'},
  {id:'gala',icon:'wine',name:'Gala',en:'Gala'},{id:'synnipaev',icon:'cake',name:'Sünnipäev',en:'Birthday'},
  {id:'lopuaktus',icon:'graduation',name:'Tseremoonia',en:'Ceremony'},{id:'reisile',icon:'plane',name:'Reis',en:'Trip'},
  {id:'rand',icon:'wave',name:'Rand',en:'Beach'},{id:'sport',icon:'run',name:'Sport',en:'Sport'}
];
const URITUSED_POOD=[
  {id:'igapaev',icon:'sun',name:'Igapäev',en:'Everyday'},{id:'kontor',icon:'briefcase',name:'Kontor',en:'Office'},
  {id:'ohtu',icon:'moon',name:'Õhtused väljaminekud',en:'Evening outings'},{id:'pidu',icon:'party',name:'Pidu',en:'Party'},
  {id:'pidulik',icon:'sparkle',name:'Pidulik',en:'Formal'},{id:'sport',icon:'run',name:'Sport',en:'Sport'},
  {id:'casual',icon:'smile',name:'Casual',en:'Casual'},{id:'minimalistlik',icon:'square',name:'Minimalistlik',en:'Minimalist'},
  {id:'boho',icon:'palette',name:'Boho',en:'Boho'},{id:'streetwear',icon:'fire',name:'Streetwear',en:'Streetwear'},
  {id:'luksus',icon:'crown',name:'Luksus',en:'Luxury'},{id:'reisil',icon:'plane',name:'Reisimine',en:'Travel'}
];

function getCredits(){const r=localStorage.getItem('glow_credits');if(r===null||r==='')return FREE_CREDITS;const n=parseInt(r,10);return isNaN(n)?FREE_CREDITS:Math.max(0,n);}
function setCredits(n){localStorage.setItem('glow_credits',String(Math.max(0,parseInt(n,10)||0)));refreshSaldo();refreshMeikAnalyzeBtn();}
function initCredits(){const r=localStorage.getItem('glow_credits');if(r===null||r===''||isNaN(parseInt(r,10)))localStorage.setItem('glow_credits',String(FREE_CREDITS));}
function refreshSaldo(){const c=getCredits(),bar=document.getElementById('saldoBar'),count=document.getElementById('saldoCount'),sub=document.getElementById('saldoSub'),btn=document.getElementById('saldoBtn');if(!bar)return;if(c>0){if(c<=FREE_CREDITS){bar.style.background='rgba(122,158,142,0.15)';bar.style.borderColor='rgba(122,158,142,0.5)';count.style.color='#7ec98a';count.textContent=c+' '+t('saldo.free','tasuta analüüsi');sub.textContent=t('saldo.trial','Prooviperiood');btn.style.color='#7ec98a';btn.style.borderColor='rgba(122,158,142,0.5)';}else{bar.style.background='rgba(201,169,110,0.12)';bar.style.borderColor='rgba(201,169,110,0.4)';count.style.color='var(--gold)';count.textContent=c+' '+t('saldo.left','analüüsi järel');sub.textContent=t('saldo.have','Krediiti on');btn.style.color='var(--gold)';btn.style.borderColor='rgba(201,169,110,0.5)';}}else{bar.style.background='rgba(196,115,107,0.12)';bar.style.borderColor='rgba(196,115,107,0.5)';count.style.color='#e8a090';count.textContent='0 '+t('saldo.left','analüüsi järel');sub.textContent=t('saldo.empty','Krediit otsas');btn.style.color='#e8a090';btn.style.borderColor='rgba(196,115,107,0.5)';}}

let salonBrandsConfig=[],salonConfigOpen=false;
function loadSalonBrands(){const s=localStorage.getItem('glow_salon_brands');try{salonBrandsConfig=s?JSON.parse(s):[];}catch(e){salonBrandsConfig=[];}return salonBrandsConfig;}
function saveSalonBrands(){const checked=document.querySelectorAll('.brand-btn.active');salonBrandsConfig=Array.from(checked).map(b=>b.dataset.id);if(salonBrandsConfig.length===0){alert(window.t('salon.pickbrand','Vali vähemalt üks bränd!'));return;}localStorage.setItem('glow_salon_brands',JSON.stringify(salonBrandsConfig));updateSalonActiveView();toggleSalonConfig();}
function updateSalonActiveView(){const saved=loadSalonBrands();const el=document.getElementById('salonActiveText');if(saved.length===0){el.innerHTML='<span style="color:rgba(255,255,255,0.5);font-size:12px">'+window.t('salon.none','Brändid pole valitud')+'</span>';document.getElementById('salonEditBtn').textContent=window.t('salon.setup','Seadista');}else{const names=saved.map(id=>{const b=DEPILE_BRANDS.find(x=>x.id===id);return b?'<span>'+b.name+'</span>':''}).join(' · ');el.innerHTML=names;document.getElementById('salonEditBtn').textContent=window.t('salon.edit','Muuda');}}
function toggleSalonConfig(){salonConfigOpen=!salonConfigOpen;document.getElementById('salonConfig').classList.toggle('show',salonConfigOpen);document.getElementById('salonEditBtn').textContent=salonConfigOpen?window.t('salon.close','Sulge'):(salonBrandsConfig.length>0?window.t('salon.edit','Muuda'):window.t('salon.setup','Seadista'));}
function buildBrandGrid(){const saved=loadSalonBrands();const g=document.getElementById('brandGrid');g.innerHTML='';DEPILE_BRANDS.forEach(b=>{const btn=document.createElement('div');btn.className='brand-btn'+(saved.includes(b.id)?' active':'');btn.dataset.id=b.id;btn.innerHTML='<div class="brand-icon">'+b.icon+'</div><div class="brand-name">'+b.name+'</div><div class="brand-desc">'+((window.glowLang==='en'&&b.en)?b.en:b.desc)+'</div>';btn.onclick=()=>{btn.classList.toggle('active');document.getElementById('salonSaveBtn').disabled=document.querySelectorAll('.brand-btn.active').length===0;};g.appendChild(btn);});document.getElementById('salonSaveBtn').disabled=saved.length===0;}
function getSalonBrandString(){const saved=loadSalonBrands();if(saved.length===0)return'Kõik depile.ee brändid.';return'Salongi valitud brändid: '+saved.map(id=>{const b=DEPILE_BRANDS.find(x=>x.id===id);return b?b.name+' ('+b.focus+')':''}).filter(Boolean).join('; ')+'.';}

// MEIGI TÄPSUSTUSED
function selectMeikOpt(btn,group){
  document.querySelectorAll('[data-group="'+group+'"]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');meikOpts[group]=btn.dataset.val;refreshMeikAnalyzeBtn();
}
function refreshMeikAnalyzeBtn(){
  const btn=document.getElementById('meikAnalyzeBtn');const hint=document.getElementById('meikAnalyzeHint');
  const allSelected=meikOpts.nahatoon&&meikOpts.silmad&&meikOpts.kogemus&&meikOpts.tugevus;
  const hasCredits=getCredits()>0;
  if(!hasCredits){btn.className='meik-analyze-btn';btn.disabled=true;hint.textContent=t('saldo.empty','Krediit otsas');hint.className='meik-analyze-hint';}
  else if(!allSelected){const missing=[];if(!meikOpts.nahatoon)missing.push(t('miss.skin','nahatoon'));if(!meikOpts.silmad)missing.push(t('miss.eyes','silmade värv'));if(!meikOpts.kogemus)missing.push(t('miss.exp','kogemus'));if(!meikOpts.tugevus)missing.push(t('miss.str','meigi tugevus'));btn.className='meik-analyze-btn';btn.disabled=true;hint.textContent=t('miss.prefix','Vali veel: ')+missing.join(', ');hint.className='meik-analyze-hint';}
  else{btn.className='meik-analyze-btn active';btn.disabled=false;const stiil=t('mstyle.'+selectedMeikStyle,MAKEUP_STYLES.find(m=>m.id===selectedMeikStyle)?.name||'Meik');hint.textContent=stiil+' · '+meikOpts.nahatoon+' · '+meikOpts.tugevus+' · '+getCredits()+' '+t('credits.word','krediiti');hint.className='meik-analyze-hint ready';}
}

function relabelResults(){
  var rl=document.getElementById('resLbl'),re=document.getElementById('resEmpty');if(!rl)return;
  if(mode==='meik'){var s=MAKEUP_STYLES.find(x=>x.id===selectedMeikStyle);rl.textContent=s?t('mstyle.'+s.id,s.name):t('res.meik','Meigi analüüs');if(re)re.textContent=t('res.empty.meik','Vali stiil ja täpsustused, seejärel ava kaamera');}
  else if(mode==='stiil'){rl.textContent=t('res.stiil','Stiili analüüs');if(re)re.textContent=t('res.empty.stiil','Tee valik ja lisa pildid');}
  else if(mode==='pro'){rl.textContent=t('proc.'+selectedProcedure,PROC_LABELS[selectedProcedure])||t('res.pro','AI Kosmeetiku analüüs');if(re)re.textContent=t('res.empty.pro','Vali protseduur, ava kaamera ja vajuta Analüüsi');}
}
function buildMeikGrid(){
  const g=document.getElementById('meikStyleGrid');g.innerHTML='';
  MAKEUP_STYLES.forEach(s=>{
    const b=document.createElement('div');b.className='meik-style-btn'+(s.id===selectedMeikStyle?' active':'');
    const sName=t('mstyle.'+s.id,s.name);
    b.innerHTML='<div class="msb-icon">'+iconHtml(s.icon,26)+'</div><div class="msb-name">'+sName+'</div>';
    b.onclick=()=>{selectedMeikStyle=s.id;document.querySelectorAll('.meik-style-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('resLbl').textContent=t('mstyle.'+s.id,s.name);resetResults();refreshMeikAnalyzeBtn();};
    g.appendChild(b);
  });
}

// MEIGI AI SÜSTEEM
// Keele-juhis AI-le: EN-režiimis palume vastuse inglise keeles, JSON-struktuur jääb samaks.
function aiLangDirective(){
  if(window.glowLang!=='en')return '';
  return '\n\n=== LANGUAGE INSTRUCTION (HIGHEST PRIORITY) ===\nRespond in ENGLISH. Write EVERY human-readable text value — verdict, feedback, all values inside "details", product names and reasons ("nimi","bränd","põhjus","kategooria"), tips, descriptions, steps — in fluent, natural English. Keep ALL JSON property names (keys) EXACTLY as written in the template above; do NOT translate or rename keys such as verdict, verdict_class, feedback, details, scores, tip, nimi, bränd, põhjus, kategooria, link, meigistiil, riietusstiil, nahatuup. EXCEPTION: inside the "details" and "scores" objects, translate the section-name keys into natural English, because those keys are shown to the user as headings (e.g. "Silmameik" -> "Eye makeup"). verdict_class MUST stay one of exactly: yes, maybe, no. Output ONLY the JSON.';
}
function getMeikSystem(styleId){
  const stiil=MAKEUP_STYLES.find(m=>m.id===styleId)?.name||'Meik';
  const nahatoon=meikOpts.nahatoon||'keskmine';
  const silmad=meikOpts.silmad||'pruunid';
  const kogemus=meikOpts.kogemus||'keskpärane';
  const tugevus=meikOpts.tugevus||'keskmine';
  const nahatoonJ={hele:'Hele nahk — roosakas-neutraalsed toonid, väldi oranži. Highlighter sobib.',keskmine:'Keskmise toon — lai valik sobib, soojad toonid toimivad.',tume:'Tume nahk — rikkalikud toonid, sügavad alused. Väldi liiga heledat highlighterit.'}[nahatoon];
  const silmadJ={'sinised-hallid':'Sinised/hallid silmad — pruunid, kuldsed ja virsik toonid toovad esile. Väldi liiga siniseid varje.','pruunid':'Pruunid silmad — lilla, roosa, kuld ja pronks toovad esile. Kontrast loob sügavuse.','rohelised':'Rohelised silmad — punakaspruun, vask ja lilla toovad rohelist esile. Väldi liiga rohelisi varje.'}[silmad];
  const kogemusJ={algaja:'ALGAJA — max 3-4 toodet, lihtsad sammud, selgita täpselt kuidas rakendada.',keskpärane:'KESKPÄRANE — blendimine ja layering on okei, keskmise keerukusega tehnikad.',kogenud:'KOGENUD — professionaalsed tehnikad, contouring, baking, complex looks.'}[kogemus];
  const tugevusJ={loomulik:'LOOMULIK — ainult naha tasandamine, kulmud, maskaar. Naturaalne tulemus, max 3-4 toodet.',keskmine:'KESKMINE — viimistletud igapäevameik, jumestus, silmad, huuled. Tasakaalustatud look, 5-6 toodet.',tugev:'TUGEV — intensiivne meik, täielik contouring, dramaatilised silmad ja huuled. 7+ toodet.'}[tugevus];
  return`Sa oled GLÓW meigi ekspert. Analüüsi kasutaja meiki VÄGA KONKREETSELT.\n\nKASUTAJA INFO:\n- Stiil: ${stiil}\n- Nahatoon: ${nahatoon} — ${nahatoonJ}\n- Silmad: ${silmad} — ${silmadJ}\n- Kogemus: ${kogemus} — ${kogemusJ}\n- Meigi tugevus: ${tugevus} — ${tugevusJ}\n\nOle VÄGA KONKREETNE muutuste osas. Ütle TÄPSELT mida muuta, kuidas rakendada, mis tooni kasutada.\n\nVasta AINULT JSON:\n{"verdict":"SUUREPÄRANE/VAJAB VÄIKESI MUUDATUSI/VAJAB OLULISI MUUDATUSI","verdict_class":"yes/maybe/no","meigistiil":"praeguse meigi kirjeldus","feedback":"3-4 konkreetset lauset","details":{"Jumestus ja nahapind":"2 konkreetset lauset","Silmameik":"2 konkreetset lauset","Kulmud":"2 konkreetset lauset","Huuled":"2 konkreetset lauset","Sobivus ${stiil} jaoks":"2 lauset"},"scores":{"Jumestus":7,"Silmad":7,"Kulmud":7,"Üldmulje":7},"muuda_kohe":[{"prioriteet":"kiireloomuline/soovituslik/valikuline","kategooria":"Jumestus/Silmad/Kulmud/Huuled","probleem":"Täpselt mis on valesti","lahendus":"KONKREETNE samm-sammult juhend koos tootega ja tooniga"}],"tehnikad":["konkreetne tehnika 1","konkreetne tehnika 2","konkreetne tehnika 3"],"kohe_tooted":[{"kategooria":"Jumestus","nimi":"tootenimi","bränd":"MAC/NYX/Catrice","põhjus":"miks sobib nahatooni ja stiiliga","link":"https://www.mactabeauty.com/meik"},{"kategooria":"Silmameik","nimi":"tootenimi","bränd":"bränd","põhjus":"põhjus","link":"https://www.mactabeauty.com/meik/silmad"}],"jarmine_tooted":[{"kategooria":"Primer","nimi":"tootenimi","bränd":"bränd","põhjus":"miks vajalik","link":"https://www.mactabeauty.com/meik"},{"kategooria":"Huuled","nimi":"tootenimi","bränd":"bränd","põhjus":"põhjus","link":"https://www.mactabeauty.com/meik/huuled"}],"tip":"Kõige olulisem konkreetne nõuanne"}`;}

// STIILI AI SÜSTEEMID
function getStiilCamSystem(uritusNimi,regime){
  return`Sa oled GLÓW stiiliekspert. Kasutaja näitab oma riietust ürituseks "${uritusNimi}". Hinda KONKREETSELT kas sobib. Ole aus — kui ei sobi, ütle täpselt miks. Kasuta korrektset eesti keelt.\nVasta AINULT JSON:\n{"verdict":"SUUREPÄRANE/SOBIB/VAJAB MUUTMIST/EI SOBI","verdict_class":"yes/maybe/no","riietusstiil":"stiil lühidalt","feedback":"3-4 konkreetset lauset miks sobib või ei sobi","details":{"Üleriietus":"2 konkreetset lauset","Värvid ja toonid":"2 konkreetset lauset","Sobivus ${uritusNimi} jaoks":"KONKREETNE hinnang — sobib/ei sobi ja miks","Aksessuaarid":"2 lauset"},"scores":{"Sobivus üritusele":7,"Värvid":7,"Stiil":7,"Üldmulje":7},"kombineerimised":["konkreetne parandus 1","konkreetne parandus 2","konkreetne parandus 3"],"soovitused":[{"kategooria":"Lisand","nimi":"ese","bränd":"bränd","põhjus":"miks parandaks"},{"kategooria":"Asendus","nimi":"ese","bränd":"bränd","põhjus":"miks sobiks paremini"}],"alternatiivid":[{"nimi":"Alt outfit 1","kirjeldus":"konkreetne outfit","varvid":["#9b8fb5","#c9a96e","#d4957a"],"emoji":"👗"},{"nimi":"Alt outfit 2","kirjeldus":"konkreetne outfit","varvid":["#7a9e8e","#c9a96e","#fff"],"emoji":"✨"},{"nimi":"Alt outfit 3","kirjeldus":"konkreetne outfit","varvid":["#c4736b","#2a1a1a","#c9a96e"],"emoji":"💫"}],"tip":"Kõige olulisem nõuanne"}`;}

function getPildipankGarderoobSystem(uritusNimi){return`Sa oled GLÓW garderoobiassistent. Kasutaja on saatnud ${photoBank.length} pilti oma garderoobist. Üritus: "${uritusNimi}".\nVaata KÕIKI pilte. Vali PARIM kombinatsioon.\nVasta AINULT JSON:\n{"verdict":"PARIM KOMBINATSIOON LEITUD/VALIK ON PIIRATUD/VAJAB TÄIENDAMIST","verdict_class":"yes/maybe/no","feedback":"3-4 lauset","parim_kombinatsioon":"Konkreetne kombinatsiooni kirjeldus","details":{"Valitud peamine ese":"konkreetne","Värvide kooskõla":"2l","Sobivus ${uritusNimi} jaoks":"2l","Jalanõude soovitus":"konkreetne"},"scores":{"Sobivus üritusele":7,"Värvid":7,"Stiil":7,"Üldmulje":7},"kombineerimised":["nõuanne 1","nõuanne 2","jalanõud"],"alternatiivid":[{"kategooria":"Alt kombinatsioon","nimi":"teine variant","bränd":"","hind":"","põhjus":"miks hea"},{"kategooria":"Puuduv ese","nimi":"mis puudub","bränd":"Zara/H&M","põhjus":"miks täiendaks"}],"tip":"kõige olulisem soovitus","moodboard":[{"nimi":"Alt 1","kirjeldus":"kirjeldus","varvid":["#9b8fb5","#c9a96e","#d4957a"],"emoji":"👗"},{"nimi":"Alt 2","kirjeldus":"kirjeldus","varvid":["#7a9e8e","#c9a96e","#fff"],"emoji":"✨"},{"nimi":"Alt 3","kirjeldus":"kirjeldus","varvid":["#c4736b","#2a1a1a","#c9a96e"],"emoji":"💫"},{"nimi":"Alt 4","kirjeldus":"kirjeldus","varvid":["#9b8fb5","#fff","#0e0c0b"],"emoji":"🌟"}]}`;}
function getPildipankPoodSystem(uritusNimi){return`Sa oled GLÓW poeassistent. Kasutaja on saatnud ${photoBank.length} pilti poes proovitud esemetest. Ürituse stiil: "${uritusNimi}".\nVasta AINULT JSON:\n{"verdict":"SUUREPÄRANE LEID/HEA VALIK/EI SOBI","verdict_class":"yes/maybe/no","feedback":"3-4 lauset","parim_valik":"Konkreetselt millised esemed tasub osta","details":{"Parimad leiud":"konkreetsed esemed","Mitte soovituslikud":"mis ei sobi","Sobivus ${uritusNimi} jaoks":"2l","Kombineerimisideed":"kuidas kombineerida"},"scores":{"Sobivus üritusele":7,"Stiil":7,"Väärtus rahale":7,"Üldmulje":7},"osta_soovitus":"Konkreetne lause mida osta","kombineerimised":["kombineerimisidee 1","kombineerimisidee 2","mis juurde osta"],"alternatiivid":[{"kategooria":"Kindlasti osta","nimi":"konkreetne ese","bränd":"","hind":"","põhjus":"miks hea"},{"kategooria":"Täiendav ost","nimi":"mis juurde","bränd":"Zara/H&M","põhjus":"miks sobib"}],"tip":"kõige olulisem nõuanne","moodboard":[{"nimi":"Komplekt 1","kirjeldus":"kirjeldus","varvid":["#9b8fb5","#c9a96e","#d4957a"],"emoji":"🛍️"},{"nimi":"Komplekt 2","kirjeldus":"kirjeldus","varvid":["#7a9e8e","#c9a96e","#fff"],"emoji":"✨"},{"nimi":"Komplekt 3","kirjeldus":"kirjeldus","varvid":["#c4736b","#2a1a1a","#c9a96e"],"emoji":"💫"},{"nimi":"Komplekt 4","kirjeldus":"kirjeldus","varvid":["#9b8fb5","#fff","#0e0c0b"],"emoji":"🌟"}]}`;}

const PROCEDURES=[{id:'nahooldus',icon:'sparkle',name:'Näopuhastus\nja hooldus'},{id:'niisutus',icon:'droplet',name:'Niisutus-\nhooldus'},{id:'vananemine',icon:'leaf',name:'Vananemis-\nvastane'},{id:'akne',icon:'target',name:'Akne-\nhooldus'},{id:'pigment',icon:'star',name:'Pigmentatsiooni-\nravi'},{id:'koorimine',icon:'flower',name:'Keemiline\nkoorimine'},{id:'kulmud',icon:'pencil',name:'Kulmude\nmodelleerimine'},{id:'ripsmed',icon:'eye',name:'Ripsmete ja\nkulmude värvimine'},{id:'massaaz',icon:'hands',name:'Näo-\nmassaaž'},{id:'depilatsioon',icon:'flower',name:'Depilatsioon\nja vahatamine'},{id:'kehahooldus',icon:'spa',name:'Keha-\nhooldus'},{id:'jalahooldus',icon:'foot',name:'Jala-\nhooldus'}];
const PROC_LABELS={soovita:'Soovita protseduuri',nahooldus:'Näopuhastus ja hooldus',niisutus:'Niisutushooldus',vananemine:'Vananemisvastane hooldus',akne:'Aknehooldus',pigment:'Pigmentatsiooniravi',koorimine:'Keemiline koorimine',kulmud:'Kulmude modelleerimine',ripsmed:'Ripsmete ja kulmude värvimine',massaaz:'Näomassaaž',depilatsioon:'Depilatsioon ja vahatamine',kehahooldus:'Kehahooldus',jalahooldus:'Jalahooldus'};
let selectedProcedure='soovita';

function getProSystem(procId){const brandStr=getSalonBrandString();const base=`Sa oled professionaalne kosmeetik. ${brandStr}\nVasta AINULT JSON.`;const s={soovita:base+` Analüüsi nahka.\n{"verdict":"SOOVITUSLIK PROTSEDUUR/VAJAB TÄHELEPANU/PÖÖRDU SPETSIALISTI POOLE","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","soovituslik_protseduur":"nimi","protseduur_pohjus":"2-3 lauset","details":{"Nahatüüp":"2l","Murekohad":"2l","Kiireloomulisus":"2l","Dermatoloogi soovitus":"ainult kui vajalik"},"scores":{"Üldseisund":7,"Niiskus":7,"Toonus":7,"Kiireloomulisus":7},"protseduurid_jarjestus":["1.","2.","3."],"pro_tooted":[{"kategooria":"Peamine","nimi":"toode","bränd":"bränd","põhjus":"põhjus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Kodune","nimi":"toode","bränd":"bränd","põhjus":"põhjus","link":"https://depile.ee/"}],"tip":"soovitus"}`,nahooldus:base+`\n{"verdict":"KERGE/STANDARDNE/INTENSIIVNE","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Nahatüüp":"2l","Poorid":"2l","Niiskus":"2l","Erivajadused":"2l"},"scores":{"Puhtus":7,"Niiskus":7,"Toon":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5","S6","S7"],"pro_tooted":[{"kategooria":"Puhastus","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Kodune","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,niisutus:base+`\n{"verdict":"KERGE/INTENSIIVNE/SÜGAV","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Niiskus":"2l","Dehüdratsioon":"2l","Nahatüüp":"2l","Hooldus":"2l"},"scores":{"Niiskus":7,"Elastsus":7,"Sära":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5"],"pro_tooted":[{"kategooria":"Seerum","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Kreem","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,vananemine:base+`\n{"verdict":"ENNETAV/AKTIIVNE/INTENSIIVNE","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Kortsud":"2l","Elastsus":"2l","Toon":"2l","Kollageen":"2l"},"scores":{"Elastsus":7,"Niiskus":7,"Toon":7,"Noorukus":7},"protseduur":["S1","S2","S3","S4","S5"],"pro_tooted":[{"kategooria":"Seerum","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Öökreem","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,akne:base+`\n{"verdict":"KERGE/MÕÕDUKAS/RASKE","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Akne":"2l","Poorid":"2l","Rasvasus":"2l","Põletik":"2l"},"scores":{"Puhtus":7,"Poorid":7,"Rasvasus":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5"],"pro_tooted":[{"kategooria":"Puhastus","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Puhastus","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,pigment:base+`\n{"verdict":"KERGE/MÕÕDUKAS/INTENSIIVNE","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Flekkide tüüp":"2l","Paiknemine":"2l","Nahatoon":"2l","Ravi":"2l"},"scores":{"Tooni ühtlus":7,"Sära":7,"Pigmentatsioon":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5"],"pro_tooted":[{"kategooria":"Seerum","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Kreem","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,koorimine:base+`\n{"verdict":"KERGE/KESKMISE/SÜGAV","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Seisund":"2l","Tüüp":"2l","Vastunäidustused":"2l","Tulemus":"2l"},"scores":{"Sobivus":7,"Tugevus":7,"Niiskus":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5","S6"],"pro_tooted":[{"kategooria":"Koorimine","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Taastav","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,kulmud:base+`\n{"verdict":"IDEAALSED/VAJAB KUJUNDAMIST/VAJAB TÄITMIST","verdict_class":"yes/maybe/no","kulutuup":"tüüp","feedback":"3-4 lauset","details":{"Kuju":"2l","Sümmeetria":"2l","Tihedus":"2l","Sobivus":"2l"},"scores":{"Kuju":7,"Sümmeetria":7,"Tihedus":7,"Üldmulje":7},"protseduur":["S1","S2","S3","S4","S5","S6"],"pro_tooted":[{"kategooria":"Vahatamine","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"},{"kategooria":"Järelhooldus","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Kulmugeel","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,ripsmed:base+`\n{"verdict":"KERGE/KESKMINE/TUMEDA TOONI VAJADUS","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Ripsmed":"2l","Kulmude värvus":"2l","Toon":"2l","Vastunäidustused":"2l"},"scores":{"Tihedus":7,"Värvus":7,"Pikkus":7,"Üldmulje":7},"protseduur":["S1","S2","S3","S4","S5","S6"],"pro_tooted":[{"kategooria":"Värv","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Seerum","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,massaaz:base+`\n{"verdict":"LÜMFI/KLASSIKALINE/PINGULDAV","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Toonus":"2l","Turse":"2l","Pinged":"2l","Massaaži tüüp":"2l"},"scores":{"Toonus":7,"Elastsus":7,"Vereringe":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5","S6","S7"],"pro_tooted":[{"kategooria":"Massaaži õli","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Õli","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,depilatsioon:base+`\n{"verdict":"SOBIB/NÕUAB ETTEVALMISTUST/EI SOBI","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Nahk":"2l","Karvad":"2l","Tundlikkus":"2l","Vaha tüüp":"2l"},"scores":{"Sobivus":7,"Karvad":7,"Tundlikkus":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5","S6"],"pro_tooted":[{"kategooria":"Vaha","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Järelhooldus","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,kehahooldus:base+`\n{"verdict":"KERGE/INTENSIIVNE/ERIKOHTLEMINE","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Nahk":"2l","Niiskus":"2l","Erivajadused":"2l","Hooldus":"2l"},"scores":{"Niiskus":7,"Sära":7,"Tekstuur":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5"],"pro_tooted":[{"kategooria":"Koorija","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Kehakreem","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`,jalahooldus:base+`\n{"verdict":"KERGE/STANDARDNE/INTENSIIVNE","verdict_class":"yes/maybe/no","nahatuup":"tüüp","feedback":"3-4 lauset","details":{"Nahapaksendid":"2l","Niiskus":"2l","Küüned":"2l","Erivajadused":"2l"},"scores":{"Puhtus":7,"Niiskus":7,"Küüned":7,"Üldseisund":7},"protseduur":["S1","S2","S3","S4","S5","S6"],"pro_tooted":[{"kategooria":"Jalakreem","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"},{"kategooria":"Eemaldus","nimi":"toode","bränd":"bränd","põhjus":"sobivus","link":"https://depile.ee/"}],"kodu_tooted":[{"kategooria":"Jalakreem","nimi":"toode","bränd":"bränd","põhjus":"koduseks","link":"https://depile.ee/"}],"tip":"soovitus"}`};return s[procId]||s.nahooldus;}

// OLEKUMUUTUJAD
let mode='meik',stiilRegime='garderoob',stiilInput='galerii';
let stream=null,autoOn=false,autoT=null,lastFb='',selectedPkg=PACKAGES[1],starRating=0,termsAccepted=false,currentMoodboardData=[];
function extractJson(raw){
  if(!raw)throw new Error('Tühi vastus');
  const cleaned=raw.replace(/```json|```/g,'').trim();
  const s=cleaned.indexOf('{'),e=cleaned.lastIndexOf('}');
  const a=cleaned.indexOf('['),z=cleaned.lastIndexOf(']');
  let slice=cleaned;
  if(s>=0&&e>s&&(a<0||s<a))slice=cleaned.substring(s,e+1);
  else if(a>=0&&z>a)slice=cleaned.substring(a,z+1);
  // 1. Katse — otse
  try{return JSON.parse(slice);}catch(_){}
  // 2. Katse — eemalda trailing komad (,] või ,})
  let fixed=slice.replace(/,(\s*[\]}])/g,'$1');
  try{return JSON.parse(fixed);}catch(_){}
  // 3. Katse — parandage "orphan" jutumärgid stringi sees
  // Otsi mustrit: "abc "def" ghi" — pane siseremärgid escape'itult
  fixed=fixed.replace(/"([^"\n\\]*)"([^",:\{\}\[\]\s][^"\n]*?)"([^"\n\\]*)"/g,'"$1\\"$2\\"$3"');
  try{return JSON.parse(fixed);}catch(_){}
  // 4. Katse — kui poolik JSON, proovi sulgeda kõik lahtised sulud
  let opens={'[':0,'{':0};let inStr=false;let escaped=false;
  for(let i=0;i<fixed.length;i++){const c=fixed[i];if(escaped){escaped=false;continue;}if(c==='\\'){escaped=true;continue;}if(c==='"')inStr=!inStr;if(inStr)continue;if(c==='{')opens['{']++;else if(c==='}')opens['{']--;else if(c==='[')opens['[']++;else if(c===']')opens['[']--;}
  let closed=fixed;
  if(inStr)closed+='"';
  while(opens['{']>0){closed+='}';opens['{']--;}
  while(opens['[']>0){closed+=']';opens['[']--;}
  try{return JSON.parse(closed);}catch(_){}
  // Kõik ebaõnnestus — heitke viga
  throw new Error('JSON-i ei õnnestunud parseerida ka pärast 4 katse');
}
async function checkRes(res){if(!res.ok){let msg='HTTP '+res.status;try{const t=await res.text();const j=JSON.parse(t);if(j.error&&j.error.message)msg=j.error.message;else msg+=': '+t.substring(0,200);}catch(_){}throw new Error(msg);}return res.json();}
function esc(s){if(s==null)return '';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function safeUrl(u,fallback){if(typeof u!=='string')return fallback;const t=u.trim();if(/^https?:\/\//i.test(t))return esc(t);return fallback;}
let currentFetchAbort=null;
let currentFacing='user';
let photoBank=[],selectedUritus=null,selectedUritusCam=null;
const video=document.getElementById('vid'),canvas=document.getElementById('cv');

// =====================================================================
// STIILI SISENDI VALIK — galerii / selfie / tavakaamera
// =====================================================================
function setStiilInput(input){
  stiilInput=input;
  document.getElementById('inputGalerii').classList.toggle('active',input==='galerii');
  document.getElementById('inputSelfie').classList.toggle('active',input==='selfie');
  document.getElementById('inputTavakaamera').classList.toggle('active',input==='tavakaamera');

  const isGalerii=input==='galerii';
  const isCam=input==='selfie'||input==='tavakaamera';

  // Galerii vaade
  document.getElementById('pildipankWrap').style.display=isGalerii?'block':'none';

  // Kaamera vaade
  document.getElementById('stiilCamWrap').style.display=isCam?'block':'none';
  document.getElementById('cameraCard').style.display=isCam?'block':'none';

  if(isCam){
    // Seadista kaamera suund
    currentFacing=input==='selfie'?'user':'environment';
    resetCam();
    document.getElementById('stiilTip').classList.add('show');
    const tipText=input==='selfie'?t('stiiltip.selfie','Selfie — pildista ennast eeskaameraga'):t('stiiltip.camera','Tavakaamera — pildista kaaslast või riideid');
    document.getElementById('stiilTipText').textContent=tipText;
    document.getElementById('camPhText').textContent=input==='selfie'?t('camph.selfie','Pildista ennast — proovi riie selga'):t('camph.camera','Suuna kaamera riietele või kaaslasele');
    // Käivita kaamera automaatselt
    setTimeout(()=>startCam(),200);
  }else{
    document.getElementById('stiilTip').classList.remove('show');
    if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
    document.getElementById('cameraCard').style.display='none';
  }
  resetResults();
  refreshAnalyzeBankBtn();
}

function resetCam(){
  const cb=document.getElementById('camBtn');cb.className='cam-top-btn pri';cb.textContent=t('cam.open','✦ Ava kaamera');cb.disabled=false;cb.onclick=startCam;
  document.getElementById('anaBtn').disabled=true;document.getElementById('autoBtn').disabled=true;document.getElementById('flipBtn').disabled=true;
  document.getElementById('camph').style.display='flex';
  setDot('idle',window.t('cam.waiting','Ootel...'));
}

// ÜRITUSTE GRID — pildipangale
function buildUritusGrid(){
  const uritused=stiilRegime==='garderoob'?URITUSED_GARDEROOB:URITUSED_POOD;
  const g=document.getElementById('uritusGrid');g.innerHTML='';selectedUritus=null;
  uritused.forEach(u=>{const b=document.createElement('div');b.className='uritus-btn';b.dataset.id=u.id;b.innerHTML='<div class="uritus-icon">'+iconHtml(u.icon,22)+'</div><div class="uritus-name">'+((window.glowLang==='en'&&u.en)?u.en:u.name)+'</div>';b.onclick=()=>{selectedUritus={id:u.id,name:u.name};document.querySelectorAll('#uritusGrid .uritus-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');refreshAnalyzeBankBtn();};g.appendChild(b);});
  refreshAnalyzeBankBtn();
}

// ÜRITUSTE GRID — kaamerale
function buildUritusGridCam(){
  const uritused=stiilRegime==='garderoob'?URITUSED_GARDEROOB:URITUSED_POOD;
  const g=document.getElementById('uritusGridCam');g.innerHTML='';selectedUritusCam=null;
  uritused.forEach(u=>{const b=document.createElement('div');b.className='uritus-btn';b.dataset.id=u.id;b.innerHTML='<div class="uritus-icon">'+iconHtml(u.icon,22)+'</div><div class="uritus-name">'+((window.glowLang==='en'&&u.en)?u.en:u.name)+'</div>';b.onclick=()=>{selectedUritusCam={id:u.id,name:u.name};document.querySelectorAll('#uritusGridCam .uritus-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('anaBtn').disabled=!(stream&&getCredits()>0);};g.appendChild(b);});
}

// PILDIPANK
function handleFileUpload(e){const files=Array.from(e.target.files);const remaining=MAX_PHOTOS-photoBank.length;if(files.length>remaining)document.getElementById('photoLimitWarn').classList.add('show');else document.getElementById('photoLimitWarn').classList.remove('show');const ALLOWED=['image/jpeg','image/png','image/gif','image/webp'];files.slice(0,remaining).forEach(file=>{const reader=new FileReader();reader.onload=ev=>{const mime=ALLOWED.includes(file.type)?file.type:'image/jpeg';photoBank.push({dataUrl:ev.target.result,b64:ev.target.result.split(',')[1],mime:mime,name:file.name});renderPhotoBank();refreshAnalyzeBankBtn();};reader.readAsDataURL(file);});e.target.value='';}
function renderPhotoBank(){const bank=document.getElementById('photoBank');const grid=document.getElementById('photoGrid');const count=document.getElementById('photoBankCount');if(photoBank.length===0){bank.classList.remove('show');return;}bank.classList.add('show');count.textContent=photoBank.length+' '+window.t('photobank.added','pilti lisatud')+(photoBank.length===MAX_PHOTOS?' (max)':'');grid.innerHTML='';photoBank.forEach((p,i)=>{const thumb=document.createElement('div');thumb.className='photo-thumb';thumb.innerHTML='<img src="'+p.dataUrl+'"><button class="photo-thumb-remove" onclick="removePhoto('+i+')">×</button><div class="photo-thumb-num">'+(i+1)+'</div>';grid.appendChild(thumb);});}
function removePhoto(idx){photoBank.splice(idx,1);document.getElementById('photoLimitWarn').classList.remove('show');renderPhotoBank();refreshAnalyzeBankBtn();}
function clearPhotoBank(){if(photoBank.length===0)return;if(!confirm(window.t('photobank.clearconfirm','Kustuta kõik')+' '+photoBank.length+' '+window.t('bank.photos','pilti')+'?'))return;photoBank=[];document.getElementById('photoLimitWarn').classList.remove('show');renderPhotoBank();refreshAnalyzeBankBtn();resetResults();}
function refreshAnalyzeBankBtn(){const btn=document.getElementById('analyzeBankBtn');const hint=document.getElementById('analyzeBankHint');const hasU=selectedUritus!==null,hasP=photoBank.length>0,hasC=getCredits()>0;if(!hasC){btn.className='analyze-bank-btn';btn.disabled=true;hint.textContent=window.t('bank.nocredit','Krediit otsas');hint.className='analyze-bank-hint';}else if(!hasU&&!hasP){btn.className='analyze-bank-btn';btn.disabled=true;hint.textContent=window.t('upload.analyzehint','Tee valik ja lisa vähemalt 1 pilt');hint.className='analyze-bank-hint';}else if(!hasU){btn.className='analyze-bank-btn';btn.disabled=true;hint.textContent=window.t('bank.pickabove','Tee valik ülalt ← kohustuslik');hint.className='analyze-bank-hint';}else if(!hasP){btn.className='analyze-bank-btn';btn.disabled=true;hint.textContent=window.t('bank.addphoto','Lisa vähemalt 1 pilt');hint.className='analyze-bank-hint';}else{btn.className='analyze-bank-btn active';btn.disabled=false;hint.textContent=photoBank.length+' '+window.t('bank.photos','pilti')+' · '+((window.glowLang==='en'&&selectedUritus.en)?selectedUritus.en:selectedUritus.name)+' · '+getCredits()+' '+window.t('bank.credits','krediiti');hint.className='analyze-bank-hint ready';}}

async function analyzePildipank(){
  const key=getKey();if(!key){document.getElementById('apiSetupCard').style.display='block';return;}
  const credits=getCredits();if(credits<=0){showPricing();return;}
  if(!selectedUritus||photoBank.length===0)return;
  const btn=document.getElementById('analyzeBankBtn');btn.className='analyze-bank-btn loading';btn.disabled=true;btn.textContent=window.t('bank.analyzing','⟳ Analüüsin...');
  resetResults();document.getElementById('resEmpty').style.display='none';document.getElementById('load').classList.add('on');
  document.getElementById('loadingText').textContent=window.t('load.photos','Analüüsin')+' '+photoBank.length+' '+window.t('load.photos2','pilti...');
  document.getElementById('resultCard').scrollIntoView({behavior:'smooth',block:'start'});
  const sys=stiilRegime==='garderoob'?getPildipankGarderoobSystem(selectedUritus.name):getPildipankPoodSystem(selectedUritus.name);
  const imageContent=photoBank.map((p,i)=>([{type:'text',text:'Pilt '+(i+1)+':'},{type:'image',source:{type:'base64',media_type:p.mime||'image/jpeg',data:p.b64}}])).flat();
  const prompt=(stiilRegime==='garderoob'?'Vaata kõiki pilte minu garderoobist. Vali parim kombinatsioon ürituseks "'+selectedUritus.name+'".':'Vaata kõiki pilte poes proovitud esemetest. Soovita mida osta ürituse "'+selectedUritus.name+'" jaoks.')+' Vasta ainult JSON.';
  imageContent.push({type:'text',text:prompt});
  try{
    // Kuni 2 katse — kui JSON-viga, proovi uuesti
    let parsed=null;let lastErr=null;
    for(let attempt=1;attempt<=2;attempt++){
      if(attempt===2)document.getElementById('loadingText').textContent=window.t('load.incomplete','AI vastus oli ebatäielik, proovime uuesti...');
      try{
        const res=await fetch(glowApiUrl(),{method:'POST',headers:glowApiHeaders(key),body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:5000,system:sys+aiLangDirective(),messages:[{role:'user',content:imageContent}]})});
        const data=await checkRes(res);if(data.error)throw new Error(data.error.message);
        const raw=data.content.map(b=>b.text||'').join('');
        parsed=extractJson(raw);
        break;
      }catch(err){
        lastErr=err;
        if(err.message&&err.message.startsWith('HTTP '))throw err;
        if(attempt>=2)throw new Error('AI ei suutnud korrektset vastust anda pärast 2 katse. Sinu krediit ei kulutata — proovi mõne aja pärast uuesti.');
      }
    }
    if(!parsed)throw lastErr||new Error('Analüüs ebaõnnestus');
    lastFb=parsed.feedback||'';setCredits(credits-1);
    document.getElementById('load').classList.remove('on');
    renderPildipankResult(parsed,stiilRegime==='garderoob'?'Garderoob · '+selectedUritus.name:'Pood · '+selectedUritus.name);
    if(typeof saveShareContext==='function'&&photoBank[0])saveShareContext(parsed,photoBank[0].dataUrl,'stiil');
    maybeShowInstallAfterAnalysis();
  }catch(e){document.getElementById('load').classList.remove('on');document.getElementById('resEmpty').style.display='block';document.getElementById('resEmpty').textContent=e.message;}
  btn.className='analyze-bank-btn active';btn.disabled=false;btn.textContent=window.t('upload.analyze','✦ Analüüsi minu valik');refreshAnalyzeBankBtn();
}

// KAAMERA
async function startCam(){
  document.getElementById('err').textContent='';
  try{
    if(stream){stream.getTracks().forEach(t=>t.stop());}
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:currentFacing},audio:false});
    video.srcObject=stream;await video.play();
    video.style.transform=currentFacing==='user'?'scaleX(-1)':'scaleX(1)';
    document.getElementById('camph').style.display='none';
    setDot('live',window.t('cam.active.msg','Kaamera aktiivne'));
    const cb=document.getElementById('camBtn');cb.textContent=window.t('cam.active','✓ Aktiivne');cb.disabled=true;cb.className='cam-top-btn ok';
    document.getElementById('autoBtn').disabled=false;document.getElementById('flipBtn').disabled=false;
    // Stiili kaamera puhul: anaBtn aktiveerub kui üritus on valitud
    if(mode==='stiil'){document.getElementById('anaBtn').disabled=!(selectedUritusCam&&getCredits()>0);}
    else{document.getElementById('anaBtn').disabled=!(getCredits()>0);}
    updateFlipBtn();
  }catch(e){stream=null;document.getElementById('err').textContent=window.t('cam.openfail','Kaamera avamine ebaõnnestus. Seaded → Safari → Kaamera → Luba');}
}

async function startMeikCam(){
  const allSelected=meikOpts.nahatoon&&meikOpts.silmad&&meikOpts.kogemus&&meikOpts.tugevus;
  if(!allSelected)return;if(getCredits()<=0){showPricing();return;}
  currentFacing='user';
  document.getElementById('cameraCard').style.display='block';
  document.getElementById('meikTip').classList.add('show');
  document.getElementById('cameraCard').scrollIntoView({behavior:'smooth',block:'start'});
  await startCam();
}

async function flipCam(){
  currentFacing=currentFacing==='user'?'environment':'user';
  if(mode==='stiil'){stiilInput=currentFacing==='user'?'selfie':'tavakaamera';document.getElementById('inputSelfie')?.classList.toggle('active',stiilInput==='selfie');document.getElementById('inputTavakaamera')?.classList.toggle('active',stiilInput==='tavakaamera');document.getElementById('inputGalerii')?.classList.remove('active');}
  await startCam();
}
function updateFlipBtn(){const btn=document.getElementById('flipBtn');const badge=document.getElementById('camModeBadge');if(currentFacing==='environment'){btn.classList.add('flip-active');badge.textContent=window.t('cam.badge.rear','Tavakaamera');}else{btn.classList.remove('flip-active');badge.textContent=window.t('cam.badge.selfie','Selfie kaamera');}badge.classList.add('show');setTimeout(()=>badge.classList.remove('show'),2000);}
function capture(){canvas.width=video.videoWidth||640;canvas.height=video.videoHeight||480;const ctx=canvas.getContext('2d');ctx.drawImage(video,0,0);return canvas.toDataURL('image/jpeg',0.85);}

// STIILI REŽIIM
function setStiilRegime(regime){
  stiilRegime=regime;
  document.getElementById('regimeGarderoob').classList.toggle('active',regime==='garderoob');
  document.getElementById('regimePood').classList.toggle('active',regime==='pood');
  photoBank=[];selectedUritus=null;selectedUritusCam=null;
  renderPhotoBank();buildUritusGrid();buildUritusGridCam();
  document.getElementById('photoLimitWarn').classList.remove('show');
  resetResults();
  if(regime==='garderoob'){document.getElementById('pildipankTitle').textContent=t('pp.title.wardrobe','Garderoob · Pildipank');document.getElementById('pildipankInfo').innerHTML=t('pp.info.wardrobe','Laadi üles kuni <strong>10 pilti</strong> oma garderoobist.');document.getElementById('uploadZoneSub').innerHTML=t('pp.sub.wardrobe','Pildista erinevaid riideid — eraldi või komplektidena');}
  else{document.getElementById('pildipankTitle').textContent=t('pp.title.shop','Pood · Pildipank');document.getElementById('pildipankInfo').innerHTML=t('pp.info.shop','Laadi üles kuni <strong>10 pilti</strong> poes proovitud asjadest.');document.getElementById('uploadZoneSub').innerHTML=t('pp.sub.shop','Pildista asju proovikabiiinis');}
}

function buildProcedureGrid(){const g=document.getElementById('procedureGrid');g.innerHTML='';const rec=document.createElement('div');rec.className='proc-btn recommend'+(selectedProcedure==='soovita'?' active':'');rec.innerHTML='<div class="proc-icon">'+iconHtml('search',22,'#c4b8e0')+'</div><div class="proc-name" style="color:#c4b8e0">'+window.t('procg.soovita','Soovita\nprotseduuri')+'</div>';rec.onclick=()=>selectProcedure('soovita');g.appendChild(rec);PROCEDURES.forEach(p=>{const b=document.createElement('div');b.className='proc-btn'+(p.id===selectedProcedure?' active':'');b.innerHTML='<div class="proc-icon">'+iconHtml(p.icon,22)+'</div><div class="proc-name">'+window.t('procg.'+p.id,p.name)+'</div>';b.onclick=()=>selectProcedure(p.id);g.appendChild(b);});}
function selectProcedure(id){selectedProcedure=id;document.querySelectorAll('.proc-btn').forEach(b=>b.classList.remove('active'));const btns=document.querySelectorAll('.proc-btn');if(id==='soovita'){btns[0].classList.add('active');}else{const idx=PROCEDURES.findIndex(p=>p.id===id);if(idx>=0)btns[idx+1].classList.add('active');}document.getElementById('resLbl').textContent=window.t('proc.'+id,PROC_LABELS[id]||id);resetResults();if(id==='soovita'){document.getElementById('proTipText').textContent=window.t('tip.pro','Soovita protseduuri — suuna kaamera näole');}else{document.getElementById('proTipText').textContent='✦ '+window.t('proc.'+id,PROC_LABELS[id])+' — '+window.t('proc.tapopen','vajuta "Ava kaamera"');}}


function altUritusName(){const u=selectedUritusCam||selectedUritus;if(!u)return '';return (window.glowLang==='en'&&u.en)?u.en:u.name;}
function showAlternatiivid(){
  const btn=document.getElementById('alternatiividBtn');
  const key=getKey();if(!key)return;
  const btnEl=btn.querySelector('button');
  const lbl=document.getElementById('alternatiividBtnTxt');
  if(document.getElementById('moodboardSection').classList.contains('on')){
    document.getElementById('moodboardSection').classList.remove('on');window.lastAlternatiivid=null;const _ab=document.getElementById('alternatiividBtn');if(_ab)_ab.style.display='none';
    lbl.textContent=window.t('alt.btn','AI pakub mulle alternatiive');
    return;
  }
  // Kui alternatiivid on juba laetud (lastAlternatiivid), näita neid
  if(window.lastAlternatiivid&&window.lastAlternatiivid.length){
    buildMoodboardCards(window.lastAlternatiivid);
    document.getElementById('moodboardSubtitle').textContent=window.t('alt.prefix','Alternatiivid:')+' '+altUritusName();
    lbl.textContent=window.t('alt.hide','Peida alternatiivid');
    return;
  }
  // Laeb API-st
  lbl.textContent=window.t('alt.loading','⟳ Laen alternatiive...');
  btnEl.disabled=true;
  const uritusNimi=(selectedUritusCam||selectedUritus)?.name||'';
  const feedbackText=document.getElementById('feedbackText')?.innerText||'';
  fetch(glowApiUrl(),{method:'POST',headers:glowApiHeaders(key),body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:600,messages:[{role:'user',content:'Kasutajal on järgmine riietuse tagasiside ürituse "'+uritusNimi+'" jaoks: '+feedbackText.substring(0,300)+'. Loo 3 konkreetset alternatiivset outfiti soovitust. Vasta AINULT JSON massiivina: [{"nimi":"outfit nimi","kirjeldus":"KONKREETNE kirjeldus mis esemeid kanda","varvid":["#hex1","#hex2","#hex3"],"emoji":"👗"}]'+aiLangDirective()}]})})
  .then(r=>checkRes(r))
  .then(data=>{
    if(data.error)throw new Error(data.error.message);
    const raw=data.content.map(b=>b.text||'').join('').trim();
    const items=extractJson(raw);
    window.lastAlternatiivid=items;
    buildMoodboardCards(items);
    document.getElementById('moodboardSubtitle').textContent=window.t('alt.prefix','Alternatiivid:')+' '+altUritusName();
    lbl.textContent=window.t('alt.hide','Peida alternatiivid');
  })
  .catch(()=>{lbl.textContent=window.t('alt.error','Viga — proovi uuesti');})
  .finally(()=>{btnEl.disabled=false;});
}

function resetResults(){document.getElementById('resEmpty').style.display='block';document.getElementById('resultWrap').classList.remove('on');document.getElementById('shareCard').classList.remove('on');document.getElementById('moodboardSection').classList.remove('on');document.getElementById('muudaCard').classList.remove('on');['techniquesCard','meikNowSection','meikNextSection','kombineringCard','outfitNowSection','outfitNextSection','protocolCard','proProductsSection','homeProductsSection'].forEach(id=>document.getElementById(id).classList.remove('on'));}

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const el=document.getElementById(id);if(el)el.classList.add('active');}
function showTerms(){showScreen('termsScreen');}
function toggleTerms(){termsAccepted=!termsAccepted;document.getElementById('termsCheckbox').classList.toggle('checked',termsAccepted);const btn=document.getElementById('termsConfirmBtn');btn.disabled=!termsAccepted;btn.classList.toggle('active',termsAccepted);}
function startCountdown(){if(!termsAccepted)return;localStorage.setItem('glow_terms_accepted','true');showScreen('countdownScreen');setTimeout(()=>runCountdown(),200);}
function runCountdown(){const track=document.getElementById('clockTrack'),clockLogo=document.getElementById('clockLogo'),clockNum=document.getElementById('clockNum'),msg=document.getElementById('countdownMsg');const circ=2*Math.PI*85;track.style.strokeDasharray=circ;track.style.strokeDashoffset=circ;setTimeout(()=>{clockLogo.style.transition='opacity 0.3s';clockLogo.style.opacity='0';setTimeout(()=>{clockLogo.style.display='none';clockNum.style.display='block';clockNum.textContent='3';clockNum.style.opacity='0';clockNum.style.transition='opacity 0.2s';setTimeout(()=>{clockNum.style.opacity='1';},50);},300);},300);const totalMs=3000;const startTime=performance.now()+600;let lastNum=4;function tick(now){const elapsed=Math.max(0,now-startTime);const progress=Math.min(elapsed/totalMs,1);track.style.strokeDashoffset=circ*(1-progress);const displayNum=Math.max(1,Math.ceil(3-progress*3));if(displayNum!==lastNum&&displayNum>=1&&displayNum<=3){lastNum=displayNum;clockNum.style.transition='none';clockNum.style.opacity='0';clockNum.textContent=String(displayNum);requestAnimationFrame(()=>{clockNum.style.transition='opacity 0.15s';clockNum.style.opacity='1';clockNum.style.transform='scale(1.2)';setTimeout(()=>{clockNum.style.transform='scale(1)';},150);});}if(progress>=0.85&&msg.textContent==='✦')msg.textContent=window.t('countdown.launching','Käivitun...');if(progress<1){requestAnimationFrame(tick);}else{clockNum.textContent='✦';clockNum.style.fontSize='48px';msg.textContent=window.t('countdown.welcome','Tere tulemast!');setTimeout(()=>launchApp(),600);}}requestAnimationFrame(tick);}
function launchApp(){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById('mainWrapper').style.display='block';initApp();}
function logout(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}localStorage.removeItem('glow_terms_accepted');document.getElementById('mainWrapper').style.display='none';termsAccepted=false;currentFacing='user';photoBank=[];document.getElementById('termsCheckbox').classList.remove('checked');const btn=document.getElementById('termsConfirmBtn');btn.disabled=true;btn.classList.remove('active');showScreen('splashScreen');}
function initApp(){renderStaticIcons();initCredits();checkIncomingReferral();getMyRefCode();updateUserMenu();handleUrlParams();showCookieBannerIfNeeded();if(isLoggedIn())syncUserFromServer();setTimeout(()=>handleJoinInvite(),300);if(USE_PROXY){document.getElementById('saldoBar').style.display='flex';const sc=document.getElementById('apiSetupCard');if(sc)sc.style.display='none';const ks=document.getElementById('keyStatus');if(ks)ks.style.display='none';}else{const key=localStorage.getItem('glow_api_key');if(key){document.getElementById('keyStatus').style.display='block';document.getElementById('saldoBar').style.display='flex';}else{document.getElementById('apiSetupCard').style.display='block';}}setMode('meik');setTimeout(()=>refreshSaldo(),50);}
function init(){renderStaticIcons();if(localStorage.getItem('glow_terms_accepted')==='true'){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById('mainWrapper').style.display='block';initApp();}else{showScreen('splashScreen');}}

function setMode(m){
  mode=m;
  document.querySelectorAll('.mode').forEach(b=>b.classList.remove('active'));
  const el=document.querySelector('.mode.m-'+m);if(el)el.classList.add('active');

  // Peida kõik stiili elemendid
  document.getElementById('meikStyleSelect').style.display='none';
  document.getElementById('stiilRegimeSelect').style.display='none';
  document.getElementById('stiilInputSelect').style.display='none';
  document.getElementById('pildipankWrap').style.display='none';
  document.getElementById('stiilCamWrap').style.display='none';
  document.getElementById('proProcedureSelect').classList.remove('show');
  document.getElementById('salonSetup').classList.remove('show');
  document.getElementById('meikTip').classList.remove('show');
  document.getElementById('stiilTip').classList.remove('show');
  document.getElementById('proTip').classList.remove('show');
  document.getElementById('cameraCard').style.display='none';

  // Peata kaamera ja auto-režiim
  if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
  if(autoT){clearInterval(autoT);autoT=null;}
  if(autoOn){autoOn=false;const ab=document.getElementById('autoBtn');if(ab){ab.textContent='Auto';ab.classList.remove('red');}}
  resetResults();

  if(m==='meik'){
    document.getElementById('meikStyleSelect').style.display='block';
    buildMeikGrid();
    document.getElementById('resLbl').textContent=(function(){var s=MAKEUP_STYLES.find(x=>x.id===selectedMeikStyle);return s?t('mstyle.'+s.id,s.name):t('res.meik','Meigi analüüs');})();
    document.getElementById('resEmpty').textContent=t('res.empty.meik','Vali stiil ja täpsustused, seejärel ava kaamera');
    refreshMeikAnalyzeBtn();
  }else if(m==='stiil'){
    document.getElementById('stiilRegimeSelect').style.display='block';
    document.getElementById('stiilInputSelect').style.display='block';
    photoBank=[];selectedUritus=null;selectedUritusCam=null;
    renderPhotoBank();
    setStiilRegime(stiilRegime);
    // Lähtesta sisendi valik galeriiks
    stiilInput='galerii';
    document.getElementById('inputGalerii').classList.add('active');
    document.getElementById('inputSelfie').classList.remove('active');
    document.getElementById('inputTavakaamera').classList.remove('active');
    document.getElementById('pildipankWrap').style.display='block';
    document.getElementById('stiilCamWrap').style.display='none';
    document.getElementById('cameraCard').style.display='none';
    document.getElementById('resLbl').textContent=t('res.stiil','Stiili analüüs');
    document.getElementById('resEmpty').textContent=t('res.empty.stiil','Tee valik ja lisa pildid');
  }else if(m==='pro'){
    buildProcedureGrid();buildBrandGrid();updateSalonActiveView();
    document.getElementById('proProcedureSelect').classList.add('show');
    document.getElementById('salonSetup').classList.add('show');
    document.getElementById('proTip').classList.add('show');
    document.getElementById('cameraCard').style.display='block';
    resetCam();
    document.getElementById('camBtn').onclick=startCam;
    document.getElementById('resLbl').textContent=t('proc.'+selectedProcedure,PROC_LABELS[selectedProcedure])||t('res.pro','AI Kosmeetiku analüüs');
    document.getElementById('resEmpty').textContent=t('res.empty.pro','Vali protseduur, ava kaamera ja vajuta Analüüsi');
  }
}

function showPricing(){document.getElementById('pricingScreen').classList.add('show');document.getElementById('checkoutScreen').classList.remove('show');['assistentWrap','resultCard'].forEach(id=>document.getElementById(id).style.display='none');['shareCard','meikTip','stiilTip','proTip','moodboardSection','salonSetup','pildipankWrap','stiilCamWrap','cameraCard','stiilInputSelect','stiilRegimeSelect'].forEach(id=>{const el=document.getElementById(id);if(el){el.classList.remove('on','show');el.style.display='none';}});resetResults();}
function hidePricing(){document.getElementById('pricingScreen').classList.remove('show');['assistentWrap','resultCard'].forEach(id=>document.getElementById(id).style.display='block');if(mode==='meik'){document.getElementById('meikStyleSelect').style.display='block';}if(mode==='stiil'){document.getElementById('stiilRegimeSelect').style.display='block';document.getElementById('stiilInputSelect').style.display='block';if(stiilInput==='galerii')document.getElementById('pildipankWrap').style.display='block';else{document.getElementById('stiilCamWrap').style.display='block';document.getElementById('cameraCard').style.display='block';}}if(mode==='pro'){document.getElementById('cameraCard').style.display='block';document.getElementById('proTip').classList.add('show');document.getElementById('salonSetup').classList.add('show');}}
async function showCheckout(){
  // Kui pole sisse loginud, avame kõigepealt login-modaali
  if(!getSessionToken()){showLoginModal(window.t('login.ctx.pay','Sisselogimine on vajalik enne maksete tegemist'));return;}
  const btn=document.getElementById('buyBtn');const originalTxt=btn.textContent;btn.disabled=true;btn.textContent=window.t('checkout.redirecting','⟳ Suunan maksele...');
  try{
    const res=await fetch(API_BASE+'/api/checkout',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+getSessionToken()},body:JSON.stringify({pkgId:selectedPkg.id})});
    const data=await res.json();
    if(!res.ok||!data.url)throw new Error(data.error||window.t('checkout.payfail','Makse ebaõnnestus'));
    window.location.href=data.url; // Suuname Stripe Checkout'i
  }catch(e){alert(window.t('gen.error','Viga')+': '+e.message);btn.disabled=false;btn.textContent=originalTxt;}
}
function hideCheckout(){document.getElementById('checkoutScreen').classList.remove('show');document.getElementById('pricingScreen').classList.add('show');}
function selectPkg(el,id,count,price,unit){document.querySelectorAll('.pkg').forEach(p=>p.classList.remove('selected'));el.classList.add('selected');selectedPkg={id,count,price,unit};document.getElementById('buyBtn').textContent=window.t('price.continue','Jätka maksega')+' — €'+price+' →';}
function onKeyInput(){const val=document.getElementById('keyInput').value.trim();const valid=val.startsWith('sk-ant');const btn=document.getElementById('saveBtn');btn.disabled=!valid;btn.style.opacity=valid?'1':'.4';document.getElementById('keyError').style.display=(val.length>5&&!valid)?'block':'none';}
function toggleKeyVis(){const inp=document.getElementById('keyInput');inp.type=inp.type==='password'?'text':'password';}
function saveKey(){const val=document.getElementById('keyInput').value.trim();if(!val.startsWith('sk-ant'))return;localStorage.setItem('glow_api_key',val);document.getElementById('apiSetupCard').style.display='none';document.getElementById('keyStatus').style.display='block';document.getElementById('saldoBar').style.display='flex';setTimeout(()=>refreshSaldo(),50);}
function changeKey(){localStorage.removeItem('glow_api_key');document.getElementById('keyStatus').style.display='none';document.getElementById('saldoBar').style.display='none';document.getElementById('apiSetupCard').style.display='block';}
function getKey(){if(USE_PROXY)return 'proxy';return localStorage.getItem('glow_api_key')||'';}
function setDot(state,msg){const d=document.getElementById('dot');d.className='dot'+(state!=='idle'?' '+state:'');document.getElementById('smsg').textContent=msg;}

// ANALÜÜS — meik, stiil kaamera, pro
async function analyze(){
  const key=getKey();if(!key){document.getElementById('apiSetupCard').style.display='block';return;}
  if(!stream){document.getElementById('err').textContent=window.t('err.opencam','Vajuta kõigepealt "Ava kaamera"!');return;}
  const credits=getCredits();if(credits<=0){showPricing();return;}

  // Stiili kaamera puhul kontroll ürituse kohta
  if(mode==='stiil'&&!selectedUritusCam){document.getElementById('err').textContent=window.t('err.pickfirst','Tee kõigepealt valik ülalt!');return;}

  let sys,prompt,lbl,bar;
  if(mode==='meik'){
    sys=getMeikSystem(selectedMeikStyle);
    prompt='Analüüsi minu meiki. Nahatoon: '+meikOpts.nahatoon+', silmad: '+meikOpts.silmad+', kogemus: '+meikOpts.kogemus+', tugevus: '+meikOpts.tugevus+'. Vasta ainult JSON.';
    lbl=window.t('mstyle.'+selectedMeikStyle,MAKEUP_STYLES.find(m=>m.id===selectedMeikStyle)?.name)+' · '+window.t('meik.str.'+({loomulik:'natural',keskmine:'medium',tugev:'strong'}[meikOpts.tugevus]||'medium'),meikOpts.tugevus);bar='c1';
    document.getElementById('loadingText').textContent=window.t('load.meik','Analüüsin meiki...');
  }else if(mode==='stiil'){
    sys=getStiilCamSystem(selectedUritusCam.name,stiilRegime);
    prompt='Analüüsi riietust. Üritus: "'+selectedUritusCam.name+'". Vasta ainult JSON.';
    lbl=(stiilRegime==='garderoob'?window.t('stiil.regime.wardrobe','Garderoob'):window.t('stiil.regime.shop','Pood'))+' · '+((window.glowLang==='en'&&selectedUritusCam.en)?selectedUritusCam.en:selectedUritusCam.name);bar='c3';
    document.getElementById('loadingText').textContent=window.t('load.stiil','Analüüsin riietust...');
  }else{
    sys=getProSystem(selectedProcedure);
    prompt=selectedProcedure==='soovita'?'Analüüsi nahka. Vasta ainult JSON.':'Analüüsi klienti. Vasta ainult JSON.';
    lbl=window.t('proc.'+selectedProcedure,PROC_LABELS[selectedProcedure])||window.t('res.pro','AI Kosmeetiku analüüs');bar='c4';
    document.getElementById('loadingText').textContent=window.t('load.generic','Analüüsin...');
  }

  if(currentFetchAbort){currentFetchAbort.abort();}
  currentFetchAbort=new AbortController();
  document.getElementById('err').textContent='';setDot('thinking',window.t('cam.analyzing','Analüüsin...'));
  resetResults();
  document.getElementById('scan').classList.add('on');document.getElementById('load').classList.add('on');
  document.getElementById('resEmpty').style.display='none';
  document.getElementById('anaBtn').disabled=true;
  const dataUrl=capture();const b64=dataUrl.split(',')[1];
  let creditsUsed=false;
  try{
    // Kuni 2 katsele — kui esimene ebaõnnestub JSON-vea tõttu, proovi uuesti
    let parsed=null;let lastErr=null;
    for(let attempt=1;attempt<=2;attempt++){
      if(attempt===2){setDot('thinking',window.t('cam.retry','Proovin uuesti...'));document.getElementById('loadingText').textContent=window.t('load.incomplete','AI vastus oli ebatäielik, proovime uuesti...');}
      try{
        const res=await fetch(glowApiUrl(),{method:'POST',signal:currentFetchAbort.signal,headers:glowApiHeaders(key),body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:5000,system:sys+aiLangDirective(),messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:b64}},{type:'text',text:prompt}]}]})});
        const data=await checkRes(res);if(data.error)throw new Error(data.error.message);
        const raw=data.content.map(b=>b.text||'').join('');
        parsed=extractJson(raw);
        break; // Kui õnnestus, välju loopist
      }catch(err){
        lastErr=err;
        if(err.name==='AbortError')throw err;
        // Kui HTTP-viga (mitte JSON), ära proovi uuesti
        if(err.message&&err.message.startsWith('HTTP '))throw err;
        // JSON-viga → proovime uuesti (kui pole veel 2. katses)
        if(attempt>=2)throw new Error('AI ei suutnud korrektset vastust anda pärast 2 katse. Sinu krediit ei kulutata — proovi mõne aja pärast uuesti.');
      }
    }
    if(!parsed)throw lastErr||new Error('Analüüs ebaõnnestus');
    creditsUsed=true;
    lastFb=parsed.feedback||'';setCredits(credits-1);
    document.getElementById('load').classList.remove('on');document.getElementById('scan').classList.remove('on');
    if(mode==='stiil')renderStiilCamResult(parsed,dataUrl,lbl);
    else renderMeikProResult(parsed,bar,dataUrl,lbl);
    if(typeof saveShareContext==='function')saveShareContext(parsed,dataUrl,mode);
    setDot('live',window.t('cam.done','Analüüs valmis ✦'));
    maybeShowInstallAfterAnalysis();
  }catch(e){
    document.getElementById('load').classList.remove('on');document.getElementById('scan').classList.remove('on');
    if(e.name==='AbortError'){setDot('idle',window.t('cam.cancelled','Tühistatud'));}else{document.getElementById('err').textContent=e.message;setDot('idle',window.t('gen.error','Viga'));}
  }
  if(mode==='stiil')document.getElementById('anaBtn').disabled=!(stream&&selectedUritusCam&&getCredits()>0);
  else document.getElementById('anaBtn').disabled=!(stream&&getCredits()>0);
}

function renderStiilCamResult(parsed,photoUrl,lbl){
  const vc=parsed.verdict_class||'maybe';const cfg=VERDICT_CONFIG[vc]||VERDICT_CONFIG.maybe;
  document.getElementById('verdictCard').className='verdict-card '+vc;
  document.getElementById('verdictIcon').textContent=cfg.icon;
  document.getElementById('verdictText').textContent=parsed.verdict||'';
  document.getElementById('verdictSub').textContent=window.t('verdict.sub.'+vc,cfg.sub);
  document.getElementById('resLbl').textContent=lbl;
  let fh='';
  if(parsed.riietusstiil)fh+='<div style="font-size:10px;letter-spacing:.3em;color:#c4b8e0;text-transform:uppercase;margin-bottom:6px;font-family:\'DM Mono\',monospace;font-weight:500">'+window.t('res.stiillabel','Stiil')+'</div><div style="font-family:\'Cormorant Garamond\',serif;font-size:18px;color:#c4b8e0;margin-bottom:14px;font-style:italic;font-weight:500">'+esc(parsed.riietusstiil)+'</div>';
  fh+='<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;line-height:1.9;color:#fff">'+esc(parsed.feedback||'')+'</p>';
  document.getElementById('feedbackText').innerHTML=fh;
  const dg=document.getElementById('detailsGrid');dg.innerHTML='';
  if(parsed.details){Object.entries(parsed.details).forEach(([k,v])=>{if(!v||String(v).trim()==='')return;const d=document.createElement('div');d.className='detail-item';d.innerHTML='<div class="detail-label">'+esc(k)+'</div><div class="detail-value">'+esc(v)+'</div>';dg.appendChild(d);});}
  const sr=document.getElementById('scoresRow');sr.innerHTML='';
  if(parsed.scores){const r=27,circ=2*Math.PI*r;Object.entries(parsed.scores).forEach(([label,val])=>{const offset=circ*(1-val/10);const id='sc_'+String(label).replace(/\W/g,'_');const div=document.createElement('div');div.className='score-item';div.innerHTML='<div class="score-label">'+esc(label)+'</div><div class="score-circle c3" id="'+id+'"><svg width="60" height="60" viewBox="0 0 60 60"><circle class="score-circle-bg" cx="30" cy="30" r="'+r+'"/><circle class="score-circle-fill" cx="30" cy="30" r="'+r+'" stroke-dasharray="'+circ+'" stroke-dashoffset="'+circ+'" id="'+id+'_fill"/></svg><div class="score-num">'+esc(val)+'</div></div>';sr.appendChild(div);setTimeout(()=>{const b=document.getElementById(id+'_fill');if(b)b.style.strokeDashoffset=offset;},400);});}
  if(parsed.tip){document.getElementById('tipText').textContent=parsed.tip;document.getElementById('tipCard').style.display='block';}else{document.getElementById('tipCard').style.display='none';}
  document.getElementById('resultWrap').classList.add('on');
  if(parsed.kombineerimised&&parsed.kombineerimised.length){const el=document.getElementById('kombineringSteps');el.innerHTML='';parsed.kombineerimised.forEach((k,i)=>{const d=document.createElement('div');d.className='komb-step';d.innerHTML='<div class="komb-num">'+(i+1)+'</div><div class="komb-text">'+esc(k)+'</div>';el.appendChild(d);});document.getElementById('kombineringCard').classList.add('on');}
  if(parsed.soovitused&&parsed.soovitused.length){const list=document.getElementById('outfitNowList');list.innerHTML='';parsed.soovitused.forEach(p=>{const card=document.createElement('div');card.className='outfit-card';card.innerHTML='<div class="outfit-category">'+esc(p.kategooria||'')+'</div><div class="outfit-name">'+esc(p.nimi||'')+'</div><div class="outfit-brand">'+esc(p.bränd||'')+'</div><div class="outfit-reason">'+esc(p.põhjus||'')+'</div>';list.appendChild(card);});document.getElementById('outfitNowTitle').textContent='👗 '+window.t('res.suggestions','Soovitused');document.getElementById('outfitNowSection').classList.add('on');}
  // moodboard laaditakse ainult nupu vajutamisel (showAlternatiivid)
  const scores=parsed.scores||{};const scoreHtml=Object.entries(scores).map(([l,v])=>'<div><div class="sp-sv">'+esc(v)+'</div><div class="sp-sl">'+esc(l)+'</div></div>').join('');
  document.getElementById('sharePrev').innerHTML='<img class="sp-photo" alt="Analüüsitud pilt" src="'+esc(photoUrl)+'"><div class="sp-logo">GL<em>O</em>W</div><div class="sp-mode">'+esc(lbl)+'</div><div class="sp-text">'+esc(parsed.feedback||'')+'</div>'+(parsed.tip?'<div class="sp-tip">✦ '+esc(parsed.tip)+'</div>':'')+'<div class="sp-scores">'+scoreHtml+'</div>';
  window.lastShareData={parsed:parsed,photoUrl:photoUrl,lbl:lbl};
  document.getElementById('shareCard').classList.add('on');
  // Näita "Näita alternatiive" nuppu
  window.lastAlternatiivid = parsed.alternatiivid||[];
  const altBtn=document.getElementById('alternatiividBtn');
  if(altBtn) altBtn.style.display='block';
  document.getElementById('moodboardSection').classList.remove('on');
  document.getElementById('alternatiividBtnTxt').textContent=window.t('alt.btn','AI pakub mulle alternatiive');
}

function renderPildipankResult(parsed,lbl){
  const vc=parsed.verdict_class||'maybe';const cfg=VERDICT_CONFIG[vc]||VERDICT_CONFIG.maybe;
  document.getElementById('verdictCard').className='verdict-card '+vc;
  document.getElementById('verdictIcon').textContent=cfg.icon;
  document.getElementById('verdictText').textContent=parsed.verdict||'';
  document.getElementById('verdictSub').textContent=window.t('verdict.sub.'+vc,cfg.sub);
  document.getElementById('resLbl').textContent=lbl;
  let fh='';
  const parim=parsed.parim_kombinatsioon||parsed.parim_valik;
  const osta=parsed.osta_soovitus;
  if(parim)fh+='<div style="padding:14px;background:rgba(155,143,181,0.15);border:1px solid rgba(155,143,181,0.4);border-radius:3px;margin-bottom:14px"><div style="font-size:10px;letter-spacing:.3em;color:#c4b8e0;text-transform:uppercase;margin-bottom:6px;font-weight:500">'+(stiilRegime==='garderoob'?window.t('res.bestcombo','Parim kombinatsioon'):window.t('res.bestpick','Parim valik'))+'</div><div style="font-family:\'Cormorant Garamond\',serif;font-size:16px;color:#fff;line-height:1.6">'+esc(parim)+'</div></div>';
  if(osta)fh+='<div style="padding:12px 14px;background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.4);border-radius:3px;margin-bottom:14px"><div style="font-size:10px;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;margin-bottom:5px;font-weight:500">'+window.t('res.buytip','Ostusoovitus')+'</div><div style="font-family:\'Cormorant Garamond\',serif;font-size:16px;color:#fff;line-height:1.5">'+esc(osta)+'</div></div>';
  fh+='<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;line-height:1.9;color:#fff">'+esc(parsed.feedback||'')+'</p>';
  document.getElementById('feedbackText').innerHTML=fh;
  const dg=document.getElementById('detailsGrid');dg.innerHTML='';
  if(parsed.details){Object.entries(parsed.details).forEach(([k,v])=>{if(!v||String(v).trim()==='')return;const d=document.createElement('div');d.className='detail-item';d.innerHTML='<div class="detail-label">'+esc(k)+'</div><div class="detail-value">'+esc(v)+'</div>';dg.appendChild(d);});}
  const sr=document.getElementById('scoresRow');sr.innerHTML='';
  if(parsed.scores){const r=27,circ=2*Math.PI*r;Object.entries(parsed.scores).forEach(([label,val])=>{const offset=circ*(1-val/10);const id='sc_'+String(label).replace(/\W/g,'_');const div=document.createElement('div');div.className='score-item';div.innerHTML='<div class="score-label">'+esc(label)+'</div><div class="score-circle c3" id="'+id+'"><svg width="60" height="60" viewBox="0 0 60 60"><circle class="score-circle-bg" cx="30" cy="30" r="'+r+'"/><circle class="score-circle-fill" cx="30" cy="30" r="'+r+'" stroke-dasharray="'+circ+'" stroke-dashoffset="'+circ+'" id="'+id+'_fill"/></svg><div class="score-num">'+esc(val)+'</div></div>';sr.appendChild(div);setTimeout(()=>{const b=document.getElementById(id+'_fill');if(b)b.style.strokeDashoffset=offset;},400);});}
  if(parsed.tip){document.getElementById('tipText').textContent=parsed.tip;document.getElementById('tipCard').style.display='block';}else{document.getElementById('tipCard').style.display='none';}
  document.getElementById('resultWrap').classList.add('on');
  if(parsed.kombineerimised&&parsed.kombineerimised.length){const el=document.getElementById('kombineringSteps');el.innerHTML='';parsed.kombineerimised.forEach((k,i)=>{const d=document.createElement('div');d.className='komb-step';d.innerHTML='<div class="komb-num">'+(i+1)+'</div><div class="komb-text">'+esc(k)+'</div>';el.appendChild(d);});document.getElementById('kombineringCard').classList.add('on');}
  if(parsed.alternatiivid&&parsed.alternatiivid.length){const list=document.getElementById('outfitNowList');list.innerHTML='';parsed.alternatiivid.forEach(p=>{const card=document.createElement('div');card.className='outfit-card';card.innerHTML='<div class="outfit-category">'+esc(p.kategooria||'')+'</div><div class="outfit-name">'+esc(p.nimi||'')+'</div>'+(p.bränd?'<div class="outfit-brand">'+esc(p.bränd)+'</div>':'')+'<div class="outfit-reason">'+esc(p.põhjus||'')+'</div>';list.appendChild(card);});document.getElementById('outfitNowTitle').textContent=stiilRegime==='garderoob'?window.t('res.suggestions','Soovitused'):window.t('res.buysuggestions','Ostusoovitused');document.getElementById('outfitNowSection').classList.add('on');}
  if(parsed.moodboard&&parsed.moodboard.length>0){buildMoodboardCards(parsed.moodboard);document.getElementById('moodboardSubtitle').textContent=stiilRegime==='garderoob'?window.t('res.moodboard.wardrobe','Alternatiivid sinu valiku jaoks'):window.t('res.moodboard.shop','Kombineerimisideed ostetud esemetele');}
  document.getElementById('sharePrev').innerHTML='<div class="sp-logo">GL<em>O</em>W</div><div class="sp-mode">'+esc(lbl)+'</div><div class="sp-text">'+esc(parsed.feedback||'')+'</div>'+(parsed.tip?'<div class="sp-tip">✦ '+esc(parsed.tip)+'</div>':'');
  window.lastShareData={parsed:parsed,photoUrl:null,lbl:lbl};
  document.getElementById('shareCard').classList.add('on');
}

function renderMeikProResult(parsed,barClass,photoUrl,lbl){
  const vc=parsed.verdict_class||'maybe';const cfg=VERDICT_CONFIG[vc]||VERDICT_CONFIG.maybe;
  document.getElementById('verdictCard').className='verdict-card '+vc;
  document.getElementById('verdictIcon').textContent=cfg.icon;
  document.getElementById('verdictText').textContent=parsed.verdict||'';
  document.getElementById('verdictSub').textContent=window.t('verdict.sub.'+vc,cfg.sub);
  document.getElementById('resLbl').textContent=lbl;
  let fh='';
  const sl=parsed.meigistiil||parsed.nahatuup||parsed.kulutuup;
  const sc=mode==='meik'?'#f0b890':'var(--gold)';
  if(sl)fh+='<div style="font-size:10px;letter-spacing:.3em;color:'+sc+';text-transform:uppercase;margin-bottom:6px;font-family:\'DM Mono\',monospace;font-weight:500">'+window.t('res.stiillabel','Stiil')+'</div><div style="font-family:\'Cormorant Garamond\',serif;font-size:18px;color:'+sc+';margin-bottom:14px;font-style:italic;font-weight:500">'+esc(sl)+'</div>';
  if(mode==='pro'&&selectedProcedure==='soovita'&&parsed.soovituslik_protseduur)fh+='<div style="padding:14px;background:rgba(155,143,181,0.15);border:1px solid rgba(155,143,181,0.4);border-radius:3px;margin-bottom:14px"><div style="font-size:10px;letter-spacing:.3em;color:#c4b8e0;text-transform:uppercase;margin-bottom:6px;font-weight:500">✦ '+window.t('res.recproc','Soovituslik protseduur')+'</div><div style="font-family:\'Cormorant Garamond\',serif;font-size:20px;color:#fff;font-weight:600;margin-bottom:8px">'+esc(parsed.soovituslik_protseduur)+'</div><div style="font-family:\'Cormorant Garamond\',serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6">'+esc(parsed.protseduur_pohjus||'')+'</div></div>';
  fh+='<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;line-height:1.9;color:#fff">'+esc(parsed.feedback||'')+'</p>';
  document.getElementById('feedbackText').innerHTML=fh;
  const dg=document.getElementById('detailsGrid');dg.innerHTML='';
  if(parsed.details){Object.entries(parsed.details).forEach(([k,v])=>{if(!v||String(v).trim()==='')return;const d=document.createElement('div');d.className='detail-item';d.innerHTML='<div class="detail-label">'+esc(k)+'</div><div class="detail-value">'+esc(v)+'</div>';dg.appendChild(d);});}
  const sr=document.getElementById('scoresRow');sr.innerHTML='';
  if(parsed.scores){const r=27,circ=2*Math.PI*r;Object.entries(parsed.scores).forEach(([label,val])=>{const offset=circ*(1-val/10);const id='sc_'+String(label).replace(/\W/g,'_');const div=document.createElement('div');div.className='score-item';div.innerHTML='<div class="score-label">'+esc(label)+'</div><div class="score-circle '+barClass+'" id="'+id+'"><svg width="60" height="60" viewBox="0 0 60 60"><circle class="score-circle-bg" cx="30" cy="30" r="'+r+'"/><circle class="score-circle-fill" cx="30" cy="30" r="'+r+'" stroke-dasharray="'+circ+'" stroke-dashoffset="'+circ+'" id="'+id+'_fill"/></svg><div class="score-num">'+esc(val)+'</div></div>';sr.appendChild(div);setTimeout(()=>{const b=document.getElementById(id+'_fill');if(b)b.style.strokeDashoffset=offset;},400);});}
  if(parsed.tip){document.getElementById('tipText').textContent=parsed.tip;document.getElementById('tipCard').style.display='block';}else{document.getElementById('tipCard').style.display='none';}
  document.getElementById('resultWrap').classList.add('on');

  // MEIGI MUUDA SEDA KAART
  if(mode==='meik'&&parsed.muuda_kohe&&parsed.muuda_kohe.length>0){
    const el=document.getElementById('muudaSteps');el.innerHTML='';
    parsed.muuda_kohe.forEach(m=>{const step=document.createElement('div');step.className='muuda-step';const prioClass=m.prioriteet==='kiireloomuline'?'kiireloomuline':m.prioriteet==='soovituslik'?'soovituslik':'valikuline';const prioIcon=m.prioriteet==='kiireloomuline'?'!':m.prioriteet==='soovituslik'?'↑':'○';step.innerHTML='<div class="muuda-priority '+prioClass+'">'+prioIcon+'</div><div class="muuda-content"><div class="muuda-kategooria">'+esc(m.kategooria||'')+'</div><div class="muuda-tekst">'+esc(m.probleem||'')+'</div><div class="muuda-kuidas">'+esc(m.lahendus||'')+'</div></div>';el.appendChild(step);});
    document.getElementById('muudaCard').classList.add('on');
  }

  if(mode==='meik'){
    if(parsed.tehnikad&&parsed.tehnikad.length){const el=document.getElementById('techniqueSteps');el.innerHTML='';parsed.tehnikad.forEach((t,i)=>{const d=document.createElement('div');d.className='tech-step';d.innerHTML='<div class="tech-num">'+(i+1)+'</div><div class="tech-text">'+esc(t)+'</div>';el.appendChild(d);});document.getElementById('techniquesCard').classList.add('on');}
    if(parsed.kohe_tooted&&parsed.kohe_tooted.length){const list=document.getElementById('meikNowList');list.innerHTML='';parsed.kohe_tooted.forEach(p=>{const card=document.createElement('div');card.className='product-card';card.innerHTML='<div class="product-header"><div><div class="product-category">'+esc(p.kategooria||'')+'</div><div class="product-name">'+esc(p.nimi||'')+'</div><div class="product-brand">'+esc(p.bränd||'')+'</div></div>'+'</div><div class="product-reason">'+esc(p.põhjus||'')+'</div><a href="'+safeUrl(p.link,'https://www.mactabeauty.com/meik')+'" target="_blank" rel="noopener noreferrer" class="product-link">'+window.t('res.view.macta','Vaata mactabeauty.com →')+'</a>';list.appendChild(card);});document.getElementById('meikNowSection').classList.add('on');}
    if(parsed.jarmine_tooted&&parsed.jarmine_tooted.length){const list=document.getElementById('meikNextList');list.innerHTML='';parsed.jarmine_tooted.forEach(p=>{const card=document.createElement('div');card.className='product-card';card.innerHTML='<div class="product-header"><div><div class="product-category">'+esc(p.kategooria||'')+'</div><div class="product-name">'+esc(p.nimi||'')+'</div><div class="product-brand">'+esc(p.bränd||'')+'</div></div>'+'</div><div class="product-reason">'+esc(p.põhjus||'')+'</div><a href="'+safeUrl(p.link,'https://www.mactabeauty.com/meik')+'" target="_blank" rel="noopener noreferrer" class="product-link">'+window.t('res.view.macta','Vaata mactabeauty.com →')+'</a>';list.appendChild(card);});document.getElementById('meikNextSection').classList.add('on');}
  }
  if(mode==='pro'){
    if(selectedProcedure==='soovita'){if(parsed.protseduurid_jarjestus&&parsed.protseduurid_jarjestus.length){const el=document.getElementById('protocolSteps');el.innerHTML='';const title=document.createElement('div');title.style.cssText='font-size:11px;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;margin-bottom:14px;font-weight:500';title.textContent='✦ '+window.t('res.recprocs','Soovituslikud protseduurid');el.appendChild(title);parsed.protseduurid_jarjestus.forEach((s,i)=>{const d=document.createElement('div');d.className='proto-step';d.innerHTML='<div class="proto-num">'+(i+1)+'</div><div class="proto-text">'+esc(s)+'</div>';el.appendChild(d);});const _dk=parsed.details?Object.keys(parsed.details).find(k=>/dermatolog/i.test(k)):null;const dermText=_dk?parsed.details[_dk]:'';if(dermText&&String(dermText).trim()!==''){const warn=document.createElement('div');warn.className='derm-warning';warn.innerHTML='<div class="derm-warning-title">⚠️ '+window.t('res.derm','Dermatoloogi konsultatsioon soovitatav')+'</div><div class="derm-warning-text">'+esc(dermText)+'</div>';el.appendChild(warn);}document.getElementById('protocolCard').classList.add('on');}}else{const steps=parsed.protseduur||parsed.tehnikad;if(steps&&steps.length){const el=document.getElementById('protocolSteps');el.innerHTML='';steps.forEach((s,i)=>{const d=document.createElement('div');d.className='proto-step';d.innerHTML='<div class="proto-num">'+(i+1)+'</div><div class="proto-text">'+esc(s)+'</div>';el.appendChild(d);});document.getElementById('protocolCard').classList.add('on');}}
    if(parsed.pro_tooted&&parsed.pro_tooted.length){const list=document.getElementById('proProductsList');list.innerHTML='';parsed.pro_tooted.forEach(p=>{const card=document.createElement('div');card.className='pro-product-card';card.innerHTML='<div class="pro-product-header"><div><div class="pro-product-category">'+esc(p.kategooria||'')+'</div><div class="pro-product-name">'+esc(p.nimi||'')+'</div><div class="pro-product-brand">'+esc(p.bränd||'')+'</div></div>'+'</div><div class="pro-product-reason">'+esc(p.põhjus||'')+'</div><a href="'+safeUrl(p.link,'https://depile.ee/')+'" target="_blank" rel="noopener noreferrer" class="pro-product-link">'+window.t('res.view.depile','Vaata depile.ee →')+'</a>';list.appendChild(card);});document.getElementById('proProductsSection').classList.add('on');}
    if(parsed.kodu_tooted&&parsed.kodu_tooted.length){const list=document.getElementById('homeProductsList');list.innerHTML='';parsed.kodu_tooted.forEach(p=>{const card=document.createElement('div');card.className='pro-product-card';card.innerHTML='<div class="pro-product-header"><div><div class="pro-product-category">'+esc(p.kategooria||'')+'</div><div class="pro-product-name">'+esc(p.nimi||'')+'</div><div class="pro-product-brand">'+esc(p.bränd||'')+'</div></div>'+'</div><div class="pro-product-reason">'+esc(p.põhjus||'')+'</div><a href="'+safeUrl(p.link,'https://depile.ee/')+'" target="_blank" rel="noopener noreferrer" class="pro-product-link">'+window.t('res.view.depile','Vaata depile.ee →')+'</a>';list.appendChild(card);});document.getElementById('homeProductsSection').classList.add('on');}
  }
  const scores=parsed.scores||{};const scoreHtml=Object.entries(scores).map(([l,v])=>'<div><div class="sp-sv">'+esc(v)+'</div><div class="sp-sl">'+esc(l)+'</div></div>').join('');
  document.getElementById('sharePrev').innerHTML='<img class="sp-photo" alt="Analüüsitud pilt" src="'+esc(photoUrl)+'"><div class="sp-logo">GL<em>O</em>W</div><div class="sp-mode">'+esc(parsed.verdict||lbl)+'</div><div class="sp-text">'+esc(parsed.feedback||'')+'</div>'+(parsed.tip?'<div class="sp-tip">✦ '+esc(parsed.tip)+'</div>':'')+'<div class="sp-scores">'+scoreHtml+'</div>';
  window.lastShareData={parsed:parsed,photoUrl:photoUrl,lbl:lbl};
  document.getElementById('shareCard').classList.add('on');
}

function safeColor(c,fallback){if(typeof c!=='string')return fallback;return /^#[0-9a-fA-F]{3,8}$/.test(c.trim())?c.trim():fallback;}
function buildMoodboardCards(items){const grid=document.getElementById('moodboardGrid');grid.innerHTML='';currentMoodboardData=items;items.forEach((item,idx)=>{const card=document.createElement('div');card.className='moodboard-card';card.id='mb_card_'+idx;const c1=safeColor(item.varvid&&item.varvid[0],'#9b8fb5');const c2=safeColor(item.varvid&&item.varvid[1],'#c9a96e');const colors=(item.varvid||['#9b8fb5','#c9a96e','#d4957a']).map(c=>'<div class="mc-color" style="background:'+safeColor(c,'#9b8fb5')+'"></div>').join('');card.innerHTML='<div class="moodboard-visual" style="background:linear-gradient(135deg,'+c1+'33,'+c2+'22)"><div class="moodboard-emoji-bg">'+esc(item.emoji||'👗')+'</div><div class="moodboard-outfit-info"><div class="moodboard-outfit-name">'+esc(item.nimi||'')+'</div><div class="moodboard-outfit-style">'+esc(item.kirjeldus||'')+'</div></div></div><div class="moodboard-card-footer"><div class="mc-colors">'+colors+'</div><button class="mc-like" id="mc_like_'+idx+'" onclick="toggleLike('+idx+')">♡</button></div>';grid.appendChild(card);});document.getElementById('moodboardSection').classList.add('on');}
function toggleLike(idx){const card=document.getElementById('mb_card_'+idx);const btn=document.getElementById('mc_like_'+idx);const liked=card.classList.contains('liked');card.classList.toggle('liked',!liked);btn.textContent=liked?'♡':'♥';}
async function generateMoreMoodboard(){const key=getKey();if(!key)return;const btn=document.querySelector('.mb-action-btn.more');btn.textContent=window.t('res.loading','⟳ Laen...');btn.disabled=true;const uritusNimi=(selectedUritus||selectedUritusCam)?.name||'Stiil';const sys='Loo 6 uut outfit inspiratsiooni ürituse "'+uritusNimi+'" jaoks. Vasta AINULT JSON massiivina:\n[{"nimi":"nimi","kirjeldus":"kirjeldus","varvid":["#hex1","#hex2","#hex3"],"emoji":"emoji"}]'+aiLangDirective();try{const res=await fetch(glowApiUrl(),{method:'POST',headers:glowApiHeaders(key),body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:800,messages:[{role:'user',content:sys}]})});const data=await checkRes(res);if(data.error)throw new Error(data.error.message);const raw=data.content.map(b=>b.text||'').join('');const parsed=extractJson(raw);buildMoodboardCards(parsed);}catch(e){console.error(e);}btn.textContent=window.t('res.morechoices','↻ Rohkem valikuid');btn.disabled=false;}
function toggleAuto(){autoOn=!autoOn;const btn=document.getElementById('autoBtn');if(autoT){clearInterval(autoT);autoT=null;}if(autoOn){if(!stream){autoOn=false;document.getElementById('err').textContent=window.t('err.opencamfirst','Ava kõigepealt kaamera!');return;}btn.textContent=window.t('cam.stop','⬛ Peata');btn.classList.add('red');analyze();autoT=setInterval(()=>{if(!stream){clearInterval(autoT);autoT=null;autoOn=false;btn.textContent=window.t('cam.auto','Auto');btn.classList.remove('red');return;}analyze();},25000);}else{btn.textContent=window.t('cam.auto','Auto');btn.classList.remove('red');}}
function rateStar(n){starRating=n;document.querySelectorAll('.star').forEach((s,i)=>s.classList.toggle('active',i<n));document.getElementById('feedbackSubmitBtn').disabled=false;}
function submitFeedback(){document.getElementById('feedbackForm').style.display='none';document.getElementById('feedbackSent').classList.add('show');}
// === SHARE CARD — Canvas pildi genereerimine ===
window.lastShareData=null;
let selectedShareFormat='stories';
function selectShareFormat(btn,fmt){selectedShareFormat=fmt;document.querySelectorAll('.share-fmt').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}
async function ensureFontsLoaded(){if(document.fonts&&document.fonts.ready){try{await document.fonts.ready;}catch(_){}}}
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>res(i);i.onerror=()=>rej(new Error('Img load fail'));i.src=src;});}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}
function drawCorners(ctx,x,y,w,h,len,col){ctx.strokeStyle=col;ctx.lineWidth=3;ctx.lineCap='square';ctx.beginPath();
  ctx.moveTo(x,y+len);ctx.lineTo(x,y);ctx.lineTo(x+len,y);
  ctx.moveTo(x+w-len,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+len);
  ctx.moveTo(x,y+h-len);ctx.lineTo(x,y+h);ctx.lineTo(x+len,y+h);
  ctx.moveTo(x+w-len,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y+h-len);
  ctx.stroke();}
function wrapLines(ctx,text,maxW){const words=String(text||'').split(/\s+/);const lines=[];let cur='';words.forEach(wd=>{const test=cur?cur+' '+wd:wd;if(ctx.measureText(test).width>maxW&&cur){lines.push(cur);cur=wd;}else{cur=test;}});if(cur)lines.push(cur);return lines;}
function drawWrapped(ctx,text,x,y,maxW,lineH,maxLines){const lines=wrapLines(ctx,text,maxW);const slice=lines.slice(0,maxLines||lines.length);if(maxLines&&lines.length>maxLines){let last=slice[maxLines-1];while(ctx.measureText(last+'…').width>maxW&&last.length>5)last=last.slice(0,-1);slice[maxLines-1]=last+'…';}slice.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineH));return slice.length;}

async function generateShareImage(format){
  format=format||selectedShareFormat||'stories';
  const PRESETS={stories:{w:1080,h:1920},square:{w:1080,h:1080},pinterest:{w:1000,h:1500}};
  const {w:W,h:H}=PRESETS[format]||PRESETS.stories;
  const data=window.lastShareData;
  if(!data)throw new Error('Pole jagatavaid andmeid');
  const cv=document.getElementById('shareCanvas');
  cv.width=W;cv.height=H;
  const ctx=cv.getContext('2d');
  await ensureFontsLoaded();

  // 1. Taust — radial gradient
  const bg=ctx.createRadialGradient(W/2,H*0.4,100,W/2,H*0.5,Math.max(W,H));
  bg.addColorStop(0,'#231a16');bg.addColorStop(1,'#0e0c0b');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  // kuldne pehme särahus üleval
  const glow=ctx.createRadialGradient(W/2,H*0.18,40,W/2,H*0.18,W*0.6);
  glow.addColorStop(0,'rgba(201,169,110,0.22)');glow.addColorStop(1,'rgba(201,169,110,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);

  // 2. Kuldne raam + nurgad
  const M=Math.round(W*0.04);
  ctx.strokeStyle='rgba(201,169,110,0.7)';ctx.lineWidth=2;
  roundRect(ctx,M,M,W-2*M,H-2*M,18);ctx.stroke();
  ctx.strokeStyle='rgba(201,169,110,0.25)';ctx.lineWidth=1;
  roundRect(ctx,M+16,M+16,W-2*M-32,H-2*M-32,12);ctx.stroke();
  drawCorners(ctx,M,M,W-2*M,H-2*M,Math.round(W*0.06),'#e8c97e');

  // 3. Üleval — logo + label
  const cx=W/2;
  const topY=Math.round(H*0.10);
  ctx.fillStyle='#d4957a';ctx.textAlign='center';ctx.textBaseline='top';
  ctx.font='400 '+Math.round(W*0.022)+'px "DM Mono",monospace';
  ctx.fillText('A I   A S S I S T E N T',cx,topY);
  const logoY=topY+Math.round(W*0.035);
  ctx.fillStyle='#fff';
  const logoFs=Math.round(W*0.14);
  ctx.font='300 '+logoFs+'px "Cormorant Garamond","Georgia",serif';
  const gW=ctx.measureText('G L').width;
  const wW=ctx.measureText('W').width;
  const oFont='italic 300 '+logoFs+'px "Cormorant Garamond","Georgia",serif';
  ctx.font=oFont;
  const oW=ctx.measureText('Ó').width;
  const totalW=gW+oW+wW+Math.round(W*0.012)*2;
  let curX=cx-totalW/2;
  ctx.font='300 '+logoFs+'px "Cormorant Garamond","Georgia",serif';
  ctx.textAlign='left';
  ctx.fillText('G L',curX,logoY);
  curX+=gW+Math.round(W*0.012);
  // O kuldne hõõguv
  ctx.save();
  ctx.shadowColor='rgba(232,201,126,0.85)';ctx.shadowBlur=Math.round(W*0.03);
  ctx.fillStyle='#e8c97e';ctx.font=oFont;
  ctx.fillText('Ó',curX,logoY);
  ctx.restore();
  curX+=oW+Math.round(W*0.012);
  ctx.fillStyle='#fff';ctx.font='300 '+logoFs+'px "Cormorant Garamond","Georgia",serif';
  ctx.fillText('W',curX,logoY);
  ctx.textAlign='center';

  // Eraldajaõhk
  const divY=logoY+logoFs+Math.round(W*0.025);
  const dgrad=ctx.createLinearGradient(W*0.25,divY,W*0.75,divY);
  dgrad.addColorStop(0,'rgba(201,169,110,0)');dgrad.addColorStop(0.5,'rgba(201,169,110,0.8)');dgrad.addColorStop(1,'rgba(201,169,110,0)');
  ctx.fillStyle=dgrad;ctx.fillRect(W*0.25,divY,W*0.5,1);

  // 4. Kasutaja foto (kui on)
  let photoBottom=divY+Math.round(W*0.04);
  if(data.photoUrl){
    try{
      const img=await loadImg(data.photoUrl);
      const photoW=Math.round(W*0.62);
      const photoH=format==='square'?Math.round(W*0.42):Math.round(W*0.7);
      const photoX=(W-photoW)/2;
      const photoY=photoBottom;
      ctx.save();
      roundRect(ctx,photoX,photoY,photoW,photoH,Math.round(W*0.025));ctx.clip();
      // mirror if selfie was from user-facing
      const iw=img.width,ih=img.height;
      const sa=iw/ih, da=photoW/photoH;
      let sx=0,sy=0,sw=iw,sh=ih;
      if(sa>da){sw=ih*da;sx=(iw-sw)/2;}else{sh=iw/da;sy=(ih-sh)/2;}
      ctx.drawImage(img,sx,sy,sw,sh,photoX,photoY,photoW,photoH);
      ctx.restore();
      // photo border
      ctx.strokeStyle='rgba(201,169,110,0.55)';ctx.lineWidth=2;
      roundRect(ctx,photoX,photoY,photoW,photoH,Math.round(W*0.025));ctx.stroke();
      photoBottom=photoY+photoH+Math.round(W*0.035);
    }catch(_){}
  }

  // 5. Verdict
  const verdict=data.parsed.verdict||'';
  const vc=data.parsed.verdict_class||'maybe';
  const verdictColors={yes:'#a8d4c4',no:'#e8a090',maybe:'#e8c97e'};
  ctx.fillStyle=verdictColors[vc]||verdictColors.maybe;
  const vFs=Math.round(W*0.07);
  ctx.font='600 '+vFs+'px "Cormorant Garamond","Georgia",serif';
  drawWrapped(ctx,verdict,cx,photoBottom,W*0.82,vFs*1.15,2);
  let curY=photoBottom+vFs*1.15*Math.min(2,wrapLines(ctx,verdict,W*0.82).length)+Math.round(W*0.02);

  // 6. Mood/lbl
  ctx.fillStyle='rgba(255,255,255,0.6)';
  const lblFs=Math.round(W*0.022);
  ctx.font='500 '+lblFs+'px "DM Mono",monospace';
  ctx.fillText(String(data.lbl||'').toUpperCase().replace(/\W/g,' ').replace(/\s+/g,'  ').trim(),cx,curY);
  curY+=lblFs*2;

  // 7. Feedback tekst — kuni 4 rida
  const fb=data.parsed.feedback||'';
  if(fb){
    ctx.fillStyle='rgba(255,255,255,0.92)';
    const fbFs=Math.round(W*0.034);
    ctx.font='italic 400 '+fbFs+'px "Cormorant Garamond","Georgia",serif';
    const used=drawWrapped(ctx,fb,cx,curY,W*0.82,fbFs*1.5,format==='square'?3:5);
    curY+=fbFs*1.5*used+Math.round(W*0.025);
  }

  // 8. Skoorid (kuni 3) kui on
  const scores=data.parsed.scores||{};
  const scoreKeys=Object.keys(scores).slice(0,3);
  if(scoreKeys.length){
    const gap=Math.round(W*0.04);
    const sBoxW=(W*0.82-gap*(scoreKeys.length-1))/scoreKeys.length;
    const startX=(W-W*0.82)/2;
    scoreKeys.forEach((k,i)=>{
      const bx=startX+i*(sBoxW+gap);
      ctx.fillStyle='rgba(201,169,110,0.1)';
      roundRect(ctx,bx,curY,sBoxW,Math.round(W*0.13),Math.round(W*0.015));ctx.fill();
      ctx.strokeStyle='rgba(201,169,110,0.4)';ctx.lineWidth=1;
      roundRect(ctx,bx,curY,sBoxW,Math.round(W*0.13),Math.round(W*0.015));ctx.stroke();
      ctx.fillStyle='#e8c97e';
      const svFs=Math.round(W*0.05);
      ctx.font='600 '+svFs+'px "Cormorant Garamond","Georgia",serif';
      ctx.fillText(String(scores[k]||0),bx+sBoxW/2,curY+Math.round(W*0.02));
      ctx.fillStyle='rgba(255,255,255,0.55)';
      ctx.font='500 '+Math.round(W*0.018)+'px "DM Mono",monospace';
      ctx.fillText(String(k).toUpperCase(),bx+sBoxW/2,curY+Math.round(W*0.08));
    });
    curY+=Math.round(W*0.16);
  }

  // 9. Tip kui mahub
  if(data.parsed.tip&&curY<H*0.82){
    ctx.fillStyle='#e8c97e';
    const tFs=Math.round(W*0.028);
    ctx.font='italic 400 '+tFs+'px "Cormorant Garamond","Georgia",serif';
    drawWrapped(ctx,'✦ '+data.parsed.tip,cx,curY,W*0.82,tFs*1.5,3);
  }

  // 10. Vesimärk all
  const footY=H-Math.round(W*0.08);
  const wmGrad=ctx.createLinearGradient(W*0.25,footY-30,W*0.75,footY-30);
  wmGrad.addColorStop(0,'rgba(201,169,110,0)');wmGrad.addColorStop(0.5,'rgba(201,169,110,0.6)');wmGrad.addColorStop(1,'rgba(201,169,110,0)');
  ctx.fillStyle=wmGrad;ctx.fillRect(W*0.25,footY-Math.round(W*0.025),W*0.5,1);
  ctx.fillStyle='#c9a96e';
  const wmFs=Math.round(W*0.025);
  ctx.font='400 '+wmFs+'px "DM Mono",monospace';
  ctx.fillText('G L Ó W   ·   glow4me.ee',cx,footY-Math.round(W*0.015));

  return new Promise(res=>cv.toBlob(b=>res(b),'image/jpeg',0.92));
}

async function saveShareImage(){
  if(!window.lastShareData){alert(window.t('share.needanalysis','Tee enne analüüs'));return;}
  const btn=event&&event.currentTarget;if(btn)btn.classList.add('share-busy');
  try{
    const blob=await generateShareImage();
    if(!blob)throw new Error('Pildi tegemine ebaõnnestus');
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='glow-'+selectedShareFormat+'-'+Date.now()+'.jpg';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  }catch(e){alert(window.t('gen.error','Viga')+': '+e.message);}
  finally{if(btn)btn.classList.remove('share-busy');}
}

async function shareImageDirect(){
  if(!window.lastShareData){alert(window.t('share.needanalysis','Tee enne analüüs'));return;}
  const btn=event&&event.currentTarget;if(btn)btn.classList.add('share-busy');
  try{
    const blob=await generateShareImage();
    if(!blob)throw new Error('Pildi tegemine ebaõnnestus');
    const file=new File([blob],'glow-'+selectedShareFormat+'.jpg',{type:'image/jpeg'});
    const shareData={files:[file],title:'GLÓW',text:'✦ GLÓW AI · glow4me.ee'};
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share(shareData);
    }else{
      // Fallback — lae alla
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download=file.name;a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),3000);
      alert(window.t('share.saved','Pilt salvestati galeriisse — ava Instagram/TikTok ja vali see üleslaadimiseks'));
    }
  }catch(e){if(e.name!=='AbortError')alert(window.t('gen.error','Viga')+': '+e.message);}
  finally{if(btn)btn.classList.remove('share-busy');}
}

function shareFB(){window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href),'_blank');}
function shareX(){const fb=lastFb||'';const text=encodeURIComponent('✦ GLÓW AI\n\n'+fb.substring(0,200)+'\n\n#GLOW #AI');window.open('https://twitter.com/intent/tweet?text='+text+'&url='+encodeURIComponent(window.location.href),'_blank');}
function shareCopy(){const fb=lastFb||'';const text='✦ GLÓW AI\n\n'+fb+'\n\n'+window.location.href;if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>alert(window.t('copy.done','✓ Kopeeritud!')));}else{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);alert(window.t('copy.done','✓ Kopeeritud!'));}}
init();
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW registreerimine ebaõnnestus:',e));});}
