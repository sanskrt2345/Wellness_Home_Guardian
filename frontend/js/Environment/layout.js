/* =====================================================
   layout.js  —  SHARED by every page (one owner only)
   Builds the sidebar + topbar so all 4 teammates get
   the SAME navigation. Each page only sets data-page,
   data-title and data-subtitle on <body>.
   ===================================================== */

(function () {
  const NAV = [
    { group: "Overview", items: [
      { id: "dashboard", label: "Dashboard", icon: "layout-dashboard", href: "dashboard.html" },
    ]},
    { group: "Home Management", items: [
      { id: "home-registry", label: "Home Registry", icon: "home", href: "home-registry.html" },
      { id: "occupants", label: "Occupants", icon: "users", href: "occupants.html" },
      { id: "rooms", label: "Rooms", icon: "app-window", href: "rooms.html" },
    ]},
    { group: "Environment", items: [
      { id: "sensors", label: "Sensors", icon: "radio", href: "sensors.html" },
      { id: "time-series", label: "Time-Series Data", icon: "bar-chart-2", href: "time-series.html" },
      { id: "indoor-air-quality", label: "Indoor Air Quality", icon: "wind", href: "indoor-air-quality.html" },
    ]},
    { group: "AI Intelligence", items: [
      { id: "lstm-anomaly", label: "LSTM Anomaly Detection", icon: "audio-lines", href: "lstm-anomaly.html" },
      { id: "health-risk", label: "Health Risk Prediction", icon: "activity", href: "health-risk.html" },
    ]},
    { group: "Wellness", items: [
      { id: "wellness-scores", label: "Wellness Scores", icon: "heart", href: "wellness-scores.html" },
      { id: "recommendations", label: "Recommendations", icon: "sparkle", href: "recommendations.html" },
    ]},
    { group: "Operations", items: [
      { id: "alerts", label: "Alerts", icon: "bell", href: "alerts.html" },
      { id: "maintenance", label: "Maintenance", icon: "wrench", href: "maintenance.html" },
      { id: "energy-monitoring", label: "Energy Monitoring", icon: "zap", href: "energy-monitoring.html" },
      { id: "audit-trail", label: "Audit Trail", icon: "clock", href: "audit-trail.html" },
    ]},
    { group: "Analytics", items: [
      { id: "analytics", label: "Analytics", icon: "trending-up", href: "analytics.html" },
      { id: "sdg-impact", label: "SDG Impact", icon: "globe", href: "sdg-impact.html" },
    ]},
  ];

  const body = document.body;
  const current = body.dataset.page;
  const title = body.dataset.title || "";
  const subtitle = body.dataset.subtitle || "";

  const navHTML = NAV.map((g) => `
    <div class="nav-group">
      <div class="nav-label">${g.group}</div>
      ${g.items.map((i) => `
        <a class="nav-item ${i.id === current ? "is-active" : ""}" href="${i.href}"
           ${i.id === current ? 'aria-current="page"' : ""}>
          <i data-lucide="${i.icon}"></i><span>${i.label}</span>
        </a>`).join("")}
    </div>`).join("");

  document.getElementById("sidebar").innerHTML = `
    <div class="brand">
      <div class="brand-logo"><i data-lucide="shield-check"></i></div>
      <div class="brand-name">Wellness Home<br />Guardian</div>
    </div>
    <nav class="nav" aria-label="Main">${navHTML}</nav>
    <div class="sidebar-footer">
      <span>Live Simulation</span>
      <label class="switch">
        <input type="checkbox" id="liveSim" aria-label="Live simulation" />
        <span class="slider"></span>
      </label>
    </div>`;

  document.getElementById("topbar").innerHTML = `
    <div class="topbar-title">
      <h2>${title}</h2>
      <p>${subtitle}</p>
    </div>
    <div class="search-box search-global">
      <i data-lucide="search"></i>
      <input type="text" id="globalSearch" placeholder="Search homes, sensors, occupants…" autocomplete="off" />
    </div>
    <div class="topbar-right">
      <span class="demo-pill"><span class="dot"></span>Demo Data</span>
      <button class="bell" aria-label="Notifications, 4 unread">
        <i data-lucide="bell"></i><span class="badge">4</span>
      </button>
      <div class="user">
        <span class="avatar">RA</span>
        <div><strong>Riya Admin</strong><small>Facility Owner</small></div>
      </div>
    </div>`;

  // Live Simulation toggle (remembered between pages)
  const live = document.getElementById("liveSim");
  try { live.checked = localStorage.getItem("liveSim") === "on"; } catch (e) {}
  live.addEventListener("change", () => {
    try { localStorage.setItem("liveSim", live.checked ? "on" : "off"); } catch (e) {}
    window.dispatchEvent(new CustomEvent("livesim", { detail: { on: live.checked } }));
  });

  if (window.lucide) lucide.createIcons();
})();
