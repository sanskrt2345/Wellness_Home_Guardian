/* alerts.js — alert table, filters, acknowledge/resolve, add & delete (localStorage) */
(function(){
  const KEY = 'whg_alerts';
  const DEFAULT_ALERTS = [
    {id:'ALT001',sensor:'CO2',severity:'High',message:'CO2 exceeding threshold in Living Room',time:'10:42 AM',status:'Active'},
    {id:'ALT002',sensor:'PM2.5',severity:'Medium',message:'PM2.5 level increasing steadily',time:'09:15 AM',status:'Active'},
    {id:'ALT003',sensor:'Humidity',severity:'Low',message:'Humidity approaching recommended range boundary',time:'Yesterday',status:'Acknowledged'},
    {id:'ALT004',sensor:'VOC',severity:'Critical',message:'VOC spike detected after cleaning activity',time:'2 days ago',status:'Resolved'},
  ];

  /* ---------- data ---------- */
  let alerts;
  try { alerts = JSON.parse(localStorage.getItem(KEY)) || null; } catch(e){ alerts = null; }
  if(!alerts) alerts = JSON.parse(JSON.stringify(DEFAULT_ALERTS));
  const save = ()=>{ try{ localStorage.setItem(KEY, JSON.stringify(alerts)); }catch(e){} };

  let filter = 'All';
  let pendingDeleteId = null;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ---------- table ---------- */
  function render(){
    const rows = alerts.filter(a => filter==='All' || a.severity===filter || a.status===filter);
    $('alertsTbody').innerHTML = rows.length ? rows.map(a=>`
      <tr>
        <td class="mono cell-dim">${a.id}</td>
        <td class="cell-strong">${esc(a.sensor)}</td>
        <td>${WHG.statusBadge(a.severity)}</td>
        <td style="white-space:normal;min-width:220px;">${esc(a.message)}</td>
        <td class="cell-dim">${esc(a.time)}</td>
        <td>${WHG.statusBadge(a.status)}</td>
        <td><div class="row-actions">
          ${a.status==='Active' ? `<button class="btn btn-sm" data-act="Acknowledged" data-id="${a.id}">Acknowledge</button>` : ''}
          ${a.status!=='Resolved' ? `<button class="btn btn-sm" data-act="Resolved" data-id="${a.id}">Resolve</button>` : ''}
          <button class="icon-btn" style="width:32px;height:32px;" data-act="delete" data-id="${a.id}" aria-label="Delete">${WHG.icon('trash',14)}</button>
        </div></td>
      </tr>`).join('')
    : `<tr><td colspan="7"><div class="empty-state">No alerts in this filter.</div></td></tr>`;
  }

  /* ---------- filters ---------- */
  $('alertFilters').addEventListener('click', e=>{
    const pill = e.target.closest('.filter-pill'); if(!pill) return;
    filter = pill.dataset.f;
    document.querySelectorAll('#alertFilters .filter-pill').forEach(b=>b.classList.toggle('active', b===pill));
    render();
  });

  /* ---------- row actions ---------- */
  $('alertsTbody').addEventListener('click', e=>{
    const btn = e.target.closest('[data-act]'); if(!btn) return;
    const id = btn.dataset.id, act = btn.dataset.act;
    if(act === 'delete'){
      pendingDeleteId = id;
      $('confirmText').textContent = `This will permanently remove ${id} from the system.`;
      $('confirmOverlay').classList.add('open');
      return;
    }
    alerts.find(a=>a.id===id).status = act;
    save(); render();
    WHG.toast(`Alert ${act}`, id, 'success');
  });

  /* ---------- delete modal ---------- */
  const closeConfirm = ()=>{ $('confirmOverlay').classList.remove('open'); pendingDeleteId = null; };
  $('confirmCancelBtn').addEventListener('click', closeConfirm);
  $('confirmDeleteBtn').addEventListener('click', ()=>{
    if(!pendingDeleteId) return;
    alerts = alerts.filter(a=>a.id!==pendingDeleteId);
    save(); render();
    WHG.toast('Alert deleted', pendingDeleteId, 'success');
    closeConfirm();
  });

  /* ---------- add-alert modal ---------- */
  const openForm  = ()=>{ ['fSensor','fSeverity','fMessage','fTime'].forEach(i=>$(i).value=''); $('fStatus').value='Active'; $('formOverlay').classList.add('open'); };
  const closeForm = ()=> $('formOverlay').classList.remove('open');
  $('logAlertBtn').addEventListener('click', openForm);
  $('formCloseBtn').addEventListener('click', closeForm);
  $('formCancelBtn').addEventListener('click', closeForm);

  function nextId(){
    const max = alerts.reduce((m,a)=> Math.max(m, parseInt(a.id.replace(/\D/g,''))||0), 0);
    return 'ALT' + String(max+1).padStart(3,'0');
  }
  $('formSaveBtn').addEventListener('click', ()=>{
    const data = {
      sensor:$('fSensor').value, severity:$('fSeverity').value,
      message:$('fMessage').value.trim(), time:$('fTime').value.trim(), status:$('fStatus').value,
    };
    if(Object.values(data).some(v=>!v)){ WHG.toast('Please fill all required fields','','error'); return; }
    const id = nextId();
    alerts.push({id, ...data});
    save(); render(); closeForm();
    WHG.toast('Alert added', id, 'success');
  });

  /* ---------- Esc / click-outside ---------- */
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeForm(); closeConfirm(); } });
  $('formOverlay').addEventListener('click', e=>{ if(e.target.id==='formOverlay') closeForm(); });
  $('confirmOverlay').addEventListener('click', e=>{ if(e.target.id==='confirmOverlay') closeConfirm(); });

  document.addEventListener('DOMContentLoaded', render);
})();
