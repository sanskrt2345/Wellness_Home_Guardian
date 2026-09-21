/* ================================================================
   common.js — shared by ALL sections
   • injects sidebar + topbar around <main class="content">
   • toast, status badges, ring gauge + bar animation, icons
   Each page sets:  <body data-page="riskpred" data-title="..." data-sub="...">
   ================================================================ */

/* ---------- icons ---------- */
const ICONS = {
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  pulse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 5.7-8 11-8 11z"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>',
  air:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h11a3 3 0 100-3"/><path d="M2 13h15a3 3 0 110 3"/><path d="M4 18h9a2.5 2.5 0 102-4"/></svg>',
  wrench:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-2.4 2.6-2.6z"/></svg>',
  zap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
  leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 21c8 0 14-6 14-14V5h-2C9 5 3 11 3 19v2z"/><path d="M5 21C8 15 12 11 17 8"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"/></svg>',
};

/* ---------- navigation (add a section here + create its html/css/js) ---------- */
const NAV = [
  {group:'Main', items:[{id:'dash', label:'Back to Dashboard', icon:'back', href:'../dashboard.html'}]},
  {group:'AI Intelligence', items:[{id:'riskpred', label:'Health Risk Prediction', icon:'pulse', href:'risk-prediction.html'}]},
  {group:'Wellness', items:[
    {id:'wellness', label:'Wellness Score', icon:'heart', href:'wellness-score.html'},
    {id:'recommendations', label:'Recommendations', icon:'spark', href:'recommendations.html'},
  ]},
  {group:'Operations', items:[{id:'alerts', label:'Alerts', icon:'bell', href:'alerts.html'}]},
];

const WHG = {
  icon(name, size){ return `<span class="ico" style="--s:${size||16}px">${ICONS[name]||''}</span>`; },

  /* ---- toast ---- */
  toast(msg, sub='', type='success'){
    let stack = document.getElementById('toastStack');
    if(!stack){ stack = document.createElement('div'); stack.id='toastStack'; stack.className='toast-stack'; document.body.appendChild(stack); }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const ic = {success:ICONS.check, error:ICONS.trash, info:ICONS.bell}[type] || ICONS.check;
    el.innerHTML = `<div class="toast-ic">${ic}</div><div><div class="msg">${msg}</div>${sub?`<div class="sub">${sub}</div>`:''}</div>`;
    stack.appendChild(el);
    setTimeout(()=>{ el.classList.add('out'); setTimeout(()=>el.remove(),260); }, 3200);
  },

  /* ---- badge (Low / Medium / High / Critical / Active …) ---- */
  statusBadge(status){
    const map = {
      'Healthy':'badge-good','Active':'badge-info','Optimal':'badge-good','Good':'badge-good',
      'Medium':'badge-warn','Moderate':'badge-warn','Acknowledged':'badge-warn',
      'Critical':'badge-bad','High':'badge-bad','Poor':'badge-bad',
      'Resolved':'badge-neutral','Low':'badge-neutral',
    };
    return `<span class="badge ${map[status]||'badge-neutral'}"><span class="dot"></span>${status}</span>`;
  },

  /* ---- ring gauge: <circle class="ring-fill" data-value="0-100"> ---- */
  setRing(circle, pct){
    requestAnimationFrame(()=>{ circle.style.strokeDashoffset = 100 - Math.max(0,Math.min(100,pct)); });
  },
  initRings(root=document){
    root.querySelectorAll('.ring-fill[data-value]').forEach(c=> WHG.setRing(c, parseFloat(c.dataset.value)));
  },

  /* ---- progress bar: <div class="bar-fill" data-w="0-100"> ---- */
  initBars(root=document){
    root.querySelectorAll('.bar-fill[data-w]').forEach(el=> requestAnimationFrame(()=>{ el.style.width = el.dataset.w+'%'; }));
  },
};

/* ---------- layout shell ---------- */
const SPA = !!document.body.dataset.spa;   // single-page mode: all sections in one html
function buildShell(){
  const page = document.body.dataset.page;
  const content = document.querySelector('main.content');
  if(!content) return;

  const nav = NAV.map(g=>`
    <div class="nav-group">
      <div class="nav-group-label">${g.group}</div>
      ${g.items.map(it=>`<a href="${SPA?'#'+it.id:it.href}" data-view="${it.id}" class="nav-item ${it.id===page?'active':''}">${WHG.icon(it.icon,17)}<span>${it.label}</span></a>`).join('')}
    </div>`).join('');

  const shell = document.createElement('div');
  shell.className = 'app';
  shell.innerHTML = `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V6l-8-4z" fill="#04140f"/><path d="M9 12l2 2 4-4" stroke="#2ee6b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div><div class="brand-name">Wellness Home<br>Guardian</div></div>
      </div>
      <nav class="nav-scroll">${nav}</nav>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="icon-btn hamburger" id="hamburgerBtn" aria-label="Menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
        <div class="page-heading"><h1>${document.body.dataset.title||''}</h1><p>${document.body.dataset.sub||''}</p></div>
        <div class="topbar-right">
          <div class="demo-badge"><span class="pulse"></span><span>Demo Data</span></div>
          <div class="rel">
            <button class="icon-btn notif-btn" id="notifBtn" aria-label="Notifications">${WHG.icon('bell',17)}<span class="count">4</span></button>
            <div class="dropdown" id="notifDropdown">
              <div class="dd-head">Notifications</div>
              <div class="dd-item"><b>CO2 threshold exceeded</b> — Living Room, Green Residency<div class="t">2 minutes ago</div></div>
              <div class="dd-item"><b>Anomaly detected</b> — LSTM model flagged sensor SEN001<div class="t">18 minutes ago</div></div>
              <div class="dd-item"><b>Humidity sensor</b> maintenance due — SEN003<div class="t">1 hour ago</div></div>
              <div class="dd-item"><b>Wellness score</b> improved<div class="t">3 hours ago</div></div>
            </div>
          </div>
          <div class="rel">
            <button class="profile-chip" id="profileBtn"><div class="avatar">RA</div><div><div class="who">Riya Admin</div><div class="role">Facility Owner</div></div></button>
            <div class="dropdown" id="profileDropdown">
              <div class="dd-head">Riya Admin · Demo Account</div>
              <div class="dd-item">Account Settings</div>
              <div class="dd-item">Notification Preferences</div>
              <div class="dd-item" style="color:var(--rose);">Sign Out</div>
            </div>
          </div>
        </div>
      </header>
    </div>`;
  content.parentNode.insertBefore(shell, content);
  shell.querySelector('.main').appendChild(content);

  /* single-page mode: sidebar click switches section, no page reload */
  if(SPA){
    const showView = id=>{
      const v = document.getElementById('view-'+id) || document.querySelector('.view');
      id = v.id.replace('view-','');
      document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active', x===v));
      shell.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.view===id));
      shell.querySelector('.page-heading h1').textContent = v.dataset.title;
      shell.querySelector('.page-heading p').textContent  = v.dataset.sub;
      /* replay ring / bar animations for the section being shown */
      v.querySelectorAll('.ring-fill[data-value]').forEach(c=>{ c.style.transition='none'; c.style.strokeDashoffset=100; c.getBoundingClientRect(); c.style.transition=''; WHG.setRing(c, +c.dataset.value); });
      v.querySelectorAll('.bar-fill[data-w]').forEach(b=>{ b.style.transition='none'; b.style.width='0'; b.getBoundingClientRect(); b.style.transition=''; requestAnimationFrame(()=>b.style.width=b.dataset.w+'%'); });
      window.scrollTo({top:0});
    };
    shell.querySelectorAll('.nav-item').forEach(a=>a.addEventListener('click', e=>{
      e.preventDefault(); history.replaceState(null,'','#'+a.dataset.view); showView(a.dataset.view);
      document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('open');
    }));
    showView(location.hash.slice(1) || page);
  }

  /* mobile sidebar */
  const sb = shell.querySelector('#sidebar'), ov = shell.querySelector('#sidebarOverlay');
  shell.querySelector('#hamburgerBtn').addEventListener('click', ()=>{ sb.classList.add('open'); ov.classList.add('open'); });
  ov.addEventListener('click', ()=>{ sb.classList.remove('open'); ov.classList.remove('open'); });

  /* dropdowns */
  [['notifBtn','notifDropdown'],['profileBtn','profileDropdown']].forEach(([b,d])=>{
    const btn = shell.querySelector('#'+b), dd = shell.querySelector('#'+d);
    btn.addEventListener('click', e=>{ e.stopPropagation(); dd.classList.toggle('open'); });
    document.addEventListener('click', ()=> dd.classList.remove('open'));
    dd.addEventListener('click', e=> e.stopPropagation());
  });
}

/* fill every <span class="ico" data-icon="name" data-size="18"> */
function fillIcons(root=document){
  root.querySelectorAll('[data-icon]').forEach(el=>{
    el.classList.add('ico');
    if(el.dataset.size) el.style.setProperty('--s', el.dataset.size+'px');
    el.innerHTML = ICONS[el.dataset.icon] || '';
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  buildShell();
  fillIcons();
  WHG.initRings();
  WHG.initBars();
});
