/* =====================================================
   indoor-air-quality.js  —  ONLY for indoor-air-quality.html
   Everything is simulated (no real sensors)
   ===================================================== */

(function () {
  const $ = (id) => document.getElementById(id);
  const CIRC = 2 * Math.PI * 68;         // gauge circle length
  const HOUR = 3600000;

  // Starting values (same as the screenshot)
  const state = {
    pm25: 18,
    pm10: 31,
    co2: 680,
    voc: 0.42,
    trend: [30, 30, 42, 55, 45, 48, 48, 78, 40, 42],     // AQI, one point per hour
    rooms: [
      { name: "Living Room",    aqi: 87 },
      { name: "Master Bedroom", aqi: 30 },
      { name: "Kitchen",        aqi: 53 },
      { name: "Open Office",    aqi: 41 },
    ],
    mix: [62, 24, 14],                                    // share of each pollutant group (%)
  };

  const MIX_LABELS = ["CO2", "Particulates", "VOC"];
  const MIX_COLORS = ["#2de2be", "#38bdf8", "#fbbf24"];

  /* ---------- Rules: value -> [pill colour, label] ---------- */
  const RULES = {
    pm25: (v) => (v <= 35 ? ["ok", "Good"] : v <= 75 ? ["warn", "Moderate"] : ["off", "Poor"]),
    pm10: (v) => (v <= 50 ? ["ok", "Good"] : v <= 150 ? ["warn", "Moderate"] : ["off", "Poor"]),
    co2:  (v) => (v <= 1000 ? ["neutral", "Normal"] : v <= 1500 ? ["warn", "Elevated"] : ["off", "High"]),
    voc:  (v) => (v <= 0.5 ? ["neutral", "Normal"] : v <= 1 ? ["warn", "Elevated"] : ["off", "High"]),
  };

  // AQI bands: 0-50 Good, 51-100 Moderate, 101-150 Poor, 150+ Critical
  function band(aqi) {
    if (aqi <= 50)  return { cls: "ok",   label: "Good",     color: "var(--green)", msg: "Good — safe for all occupants" };
    if (aqi <= 100) return { cls: "warn", label: "Moderate", color: "var(--amber)", msg: "Moderate — sensitive occupants should limit exposure" };
    if (aqi <= 150) return { cls: "off",  label: "Poor",     color: "var(--red)",   msg: "Poor — improve ventilation now" };
    return              { cls: "off",  label: "Critical", color: "var(--red)",   msg: "Critical — take action immediately" };
  }

  /* ---------- Small helpers ---------- */
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const walk = (v, amp, lo, hi) => clamp(v + (Math.random() - 0.5) * 2 * amp, lo, hi);
  const aqiOf = () =>
    Math.round(Math.max(state.pm25 / 35, state.pm10 / 50, state.co2 / 1000, state.voc / 0.5) * 50);

  function setPill(el, [cls, text]) {
    el.className = `pill pill-${cls}`;
    el.innerHTML = `<span class="dot"></span>${text}`;
  }

  /* ---------- Trend labels (one per hour, ending now) ---------- */
  let lastHour = new Date();
  lastHour.setMinutes(0, 0, 0);
  const hourLabel = (d) => d.toTimeString().slice(0, 5);
  const labels = state.trend.map((_, i) =>
    hourLabel(new Date(lastHour.getTime() - (state.trend.length - 1 - i) * HOUR))
  );

  /* ---------- Rendering ---------- */
  function renderKpis() {
    $("kpiPm25").textContent = `${Math.round(state.pm25)} µg/m³`;
    $("kpiPm10").textContent = `${Math.round(state.pm10)} µg/m³`;
    $("kpiCo2").textContent = `${Math.round(state.co2)} ppm`;
    $("kpiVoc").textContent = `${state.voc.toFixed(2)} ppm`;
    setPill($("kpiPm25Pill"), RULES.pm25(state.pm25));
    setPill($("kpiPm10Pill"), RULES.pm10(state.pm10));
    setPill($("kpiCo2Pill"), RULES.co2(state.co2));
    setPill($("kpiVocPill"), RULES.voc(state.voc));
  }

  function renderGauge() {
    const aqi = aqiOf();
    const b = band(aqi);
    $("aqiValue").textContent = aqi;

    const arc = $("gaugeArc");
    arc.style.strokeDasharray = `${Math.min(aqi / 150, 1) * CIRC} ${CIRC}`;
    arc.style.stroke = b.color;

    const bar = $("aqiStatus");
    bar.className = `status-bar ${b.cls}`;
    bar.textContent = b.msg;
  }

  function renderRooms() {
    $("roomGrid").innerHTML = state.rooms.map((r) => {
      const b = band(r.aqi);
      return `
        <div class="room">
          <div class="room-name">${r.name}</div>
          <div class="room-score">${Math.round(r.aqi)}</div>
          <span class="pill pill-${b.cls}"><span class="dot"></span>${b.label}</span>
        </div>`;
    }).join("");
  }

  function renderLegend() {
    $("donutLegend").innerHTML = MIX_LABELS.map((name, i) =>
      `<li style="--c:${MIX_COLORS[i]}"><i></i>${name} <b>${state.mix[i]}%</b></li>`
    ).join("");
  }

  /* ---------- Charts (Chart.js) ---------- */
  let trendChart = null;
  let donutChart = null;

  function initCharts() {
    if (!window.Chart) {
      $("trendChart").hidden = true;
      $("trendFallback").hidden = false;
      $("donutChart").parentElement.hidden = true;
      $("donutFallback").hidden = false;
      return;
    }

    Chart.defaults.color = "#7f8d89";
    Chart.defaults.font.family = '"Inter", system-ui, sans-serif';

    const tooltip = {
      backgroundColor: "#0b1312",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#eef4f2",
      bodyColor: "#c5d0cc",
      padding: 10,
      displayColors: false,
    };
    const grid = { color: "rgba(255,255,255,0.05)" };

    trendChart = new Chart($("trendChart"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "AQI",
          data: state.trend,
          borderColor: "#2de2be",
          backgroundColor: "#2de2be",
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0,
          fill: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { display: false }, tooltip },
        scales: {
          x: { grid, ticks: { maxRotation: 0, maxTicksLimit: 10 } },
          y: { grid, beginAtZero: true, grace: "10%", title: { display: true, text: "AQI", color: "#7f8d89" } },
        },
      },
    });

    donutChart = new Chart($("donutChart"), {
      type: "doughnut",
      data: {
        labels: MIX_LABELS,
        datasets: [{
          data: state.mix,
          backgroundColor: MIX_COLORS,
          borderColor: "#0a1110",
          borderWidth: 3,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltip, callbacks: { label: (c) => `${c.label}: ${c.parsed}%` } },
        },
      },
    });
  }

  function updateCharts() {
    if (trendChart) {
      trendChart.data.labels = labels;
      trendChart.data.datasets[0].data = state.trend;
      trendChart.update("none");
    }
    if (donutChart) {
      donutChart.data.datasets[0].data = state.mix;
      donutChart.update("none");
    }
  }

  function renderAll() {
    renderKpis();
    renderGauge();
    renderRooms();
    renderLegend();
    updateCharts();
  }

  /* ---------- Live Simulation (sidebar toggle) ---------- */
  let simTimer = null;

  function tick() {
    state.pm25 = walk(state.pm25, 2, 6, 70);
    state.pm10 = walk(state.pm10, 3, 10, 120);
    state.co2 = walk(state.co2, 25, 450, 1400);
    state.voc = walk(state.voc, 0.03, 0.05, 0.9);
    state.rooms.forEach((r) => { r.aqi = walk(r.aqi, 4, 10, 180); });

    // move the trend one hour forward
    state.trend.push(aqiOf());
    state.trend.shift();
    lastHour = new Date(lastHour.getTime() + HOUR);
    labels.push(hourLabel(lastHour));
    labels.shift();

    // small changes in the pollutant mix (always adds up to ~100%)
    const raw = state.mix.map((v) => clamp(v + (Math.random() - 0.5) * 2, 5, 80));
    const total = raw.reduce((a, b) => a + b, 0);
    state.mix = raw.map((v) => Math.round((v / total) * 100));

    renderAll();
  }

  function startSim() { if (!simTimer) simTimer = setInterval(tick, 3000); }
  function stopSim() { clearInterval(simTimer); simTimer = null; }

  window.addEventListener("livesim", (e) => (e.detail.on ? startSim() : stopSim()));
  if ($("liveSim").checked) startSim();

  /* ---------- Start ---------- */
  initCharts();
  renderAll();
})();
