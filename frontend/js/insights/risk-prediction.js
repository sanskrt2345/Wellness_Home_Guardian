/* risk-prediction.js — Health Risk Prediction section logic (simulated model) */
(function(){
  const inputs = {temp:25.4, hum:54, pm25:18, co2:680, voc:0.42};

  const NAMES = {pm25:'PM2.5', co2:'CO2', hum:'humidity', temp:'temperature', voc:'VOC'};

  /* each factor's contribution to the risk score */
  function contributions(){
    const {temp,hum,pm25,co2,voc} = inputs;
    return {
      pm25: Math.max(0, pm25-12) * 1.6,
      co2:  Math.max(0, co2-800) * 0.05,
      hum:  Math.max(0, hum-60) * 0.9 + Math.max(0, 40-hum) * 0.6,
      temp: Math.max(0, temp-27) * 2 + Math.max(0, 20-temp) * 1.5,
      voc:  voc * 30,
    };
  }

  function computeRisk(){
    const c = contributions();
    const score = Object.values(c).reduce((a,b)=>a+b, 0);
    const pct = Math.min(97, Math.max(4, Math.round(score)));
    let level, risk;
    if(pct < 30)      { level='Low';    risk='No Significant Risk'; }
    else if(pct < 60) { level='Medium'; risk='Mild Discomfort Risk'; }
    else              { level='High';   risk='Respiratory Stress'; }
    const confidence = Math.min(97, 70 + Math.round(pct/4));
    const top = Object.entries(c).sort((a,b)=>b[1]-a[1])[0];
    return {pct, level, risk, confidence, topFactor: top[1] > 0 ? NAMES[top[0]] : null};
  }

  function render(result){
    const color = {High:'var(--rose)', Medium:'var(--amber)', Low:'var(--emerald)'}[result.level];
    const ring = document.getElementById('riskRing');
    ring.style.setProperty('--ring-color', color);
    WHG.setRing(ring, result.pct);

    document.getElementById('riskPct').textContent = result.pct + '%';
    document.getElementById('riskBadge').innerHTML = WHG.statusBadge(result.level);
    document.getElementById('riskLabel').textContent = result.risk;
    document.getElementById('riskConf').textContent = result.confidence + '%';
    document.getElementById('riskConfBar').style.width = result.confidence + '%';
    document.getElementById('riskNote').textContent =
      'Demo environmental risk prediction — not a medical diagnosis. ' +
      (result.topFactor ? `Elevated ${result.topFactor} is the largest simulated contributor to this result.`
                        : 'All simulated factors are within comfortable ranges.');
  }

  /* sliders → live update */
  document.querySelectorAll('input[type=range][data-key]').forEach(el=>{
    el.addEventListener('input', ()=>{
      inputs[el.dataset.key] = parseFloat(el.value);
      document.getElementById('val-' + el.dataset.key).textContent = el.value;
      render(computeRisk());
    });
  });

  /* button → prediction with toast */
  document.getElementById('predictBtn').addEventListener('click', ()=>{
    const r = computeRisk();
    render(r);
    WHG.toast('Prediction generated', `${r.risk} · ${r.confidence}% confidence`, r.level==='High' ? 'error' : 'success');
  });

  document.addEventListener('DOMContentLoaded', ()=> render(computeRisk()));
})();
