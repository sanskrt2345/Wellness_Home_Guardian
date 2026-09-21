/* wellness-score.js — overall score = weighted average of the formula bars */
document.addEventListener('DOMContentLoaded', ()=>{
  const bars = [...document.querySelectorAll('.bar-fill[data-weight]')];
  const totalWeight = bars.reduce((s,b)=> s + parseFloat(b.dataset.weight), 0);
  const overall = Math.round(bars.reduce((s,b)=> s + parseFloat(b.dataset.w) * parseFloat(b.dataset.weight), 0) / totalWeight);

  const rating = overall>=85 ? 'Excellent' : overall>=70 ? 'Good' : overall>=50 ? 'Moderate' : 'Poor';
  const color  = overall>=85 ? 'var(--teal)' : overall>=70 ? 'var(--emerald)' : overall>=50 ? 'var(--amber)' : 'var(--rose)';

  document.getElementById('overallNum').textContent = overall;
  document.getElementById('overallLbl').textContent = `/ 100 · ${rating}`;
  const ring = document.getElementById('overallRing');
  ring.style.setProperty('--ring-color', color);
  WHG.setRing(ring, overall);
});
