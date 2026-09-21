/* dashboard-insights-links.js
   Adds an "Insights" group (4 links) to the sidebar of pages/dashboard.html.
   Add this ONE line just before </body> in dashboard.html (after dashboard.js):
       <script src="../js/insights/dashboard-insights-links.js"></script>
   It re-adds itself if dashboard.js rebuilds the sidebar. */
(function () {
  const LINKS = [
    {label:'Health Risk Prediction', href:'insights/risk-prediction.html', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>'},
    {label:'Wellness Score',         href:'insights/wellness-score.html',  icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 5.7-8 11-8 11z"/></svg>'},
    {label:'Recommendations',        href:'insights/recommendations.html', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z"/></svg>'},
    {label:'Alerts',                 href:'insights/alerts.html',          icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>'},
  ];

  function ensure() {
    const nav = document.getElementById('navScroll');
    if (!nav || nav.querySelector('[data-insights-group]')) return;
    const g = document.createElement('div');
    g.className = 'nav-group';
    g.setAttribute('data-insights-group', '');
    g.innerHTML = '<div class="nav-group-label">Insights</div>' +
      LINKS.map(l => `<a href="${l.href}" class="nav-item">${l.icon}<span>${l.label}</span></a>`).join('');
    nav.appendChild(g);
  }

  ensure();
  const nav = document.getElementById('navScroll');
  if (nav) new MutationObserver(ensure).observe(nav, {childList: true});
})();
