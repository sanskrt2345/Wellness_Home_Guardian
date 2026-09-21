/* recommendations.js — acknowledge / dismiss actions */
document.addEventListener('DOMContentLoaded', ()=>{
  const grid  = document.getElementById('recGrid');
  const empty = document.getElementById('recEmpty');

  grid.addEventListener('click', e=>{
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const card  = btn.closest('.rec-card');
    const title = card.dataset.title;

    if(btn.dataset.action === 'ack'){
      card.classList.add('acknowledged');
      btn.disabled = true; btn.style.opacity = .6;
      WHG.toast('Recommendation acknowledged', title, 'success');
    }else{
      card.remove();
      WHG.toast('Recommendation dismissed', title, 'info');
      if(!grid.children.length){ grid.style.display = 'none'; empty.style.display = 'block'; }
    }
  });
});
