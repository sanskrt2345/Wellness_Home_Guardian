/* =====================================================
   time-series.js  —  ONLY for time-series.html
   Simulated data: 60 readings (1 per minute) per sensor
   ===================================================== */

(function () {
  // Typical values for each sensor (data is generated around these)
  const SENSORS = [
    { id: "SEN001", type: "CO2",         base: { temp: 24.9, hum: 54, co2: 690, pm: 18 } },
    { id: "SEN002", type: "PM2.5",       base: { temp: 24.2, hum: 50, co2: 610, pm: 18 } },
    { id: "SEN003", type: "Humidity",    base: { temp: 26.1, hum: 63, co2: 720, pm: 22 } },
    { id: "SEN004", type: "Temperature", base: { temp: 25.4, hum: 48, co2: 560, pm: 12 } },
    { id: "SEN005", type: "VOC",         base: { temp: 23.8, hum: 45, co2: 780, pm: 15 } },
    { id: "SEN006", type: "Noise",       base: { temp: 25.0, hum: 51, co2: 600, pm: 10 } },
  ];

  const METRICS = {
    temperature: { label: "Temperature", unit: "°C",    key: "temp" },
    humidity:    { label: "Humidity",    unit: "%",     key: "hum" },
    co2:         { label: "CO2",         unit: "ppm",   key: "co2" },
    pm25:        { label: "PM2.5",       unit: "µg/m³", key: "pm" },
  };

  const WINDOW = 60;            // number of readings shown

  let sensorId = SENSORS[0].id;
  let metric = "temperature";
  let timeQuery = "";
  let data = [];                // oldest -> newest
  let chart = null;
  let simTimer = null;

  const $ = (id) => document.getElementById(id);
  const rowsEl = $("readingRows");

  /* ---------- Data helpers ---------- */
  const round = (v, d = 0) => Math.round(v * 10 ** d) / 10 ** d;
  const noise = (amp) => (Math.random() - 0.5) * 2 * amp;
  const timeLabel = (d) => d.toTimeString().slice(0, 5);   // "HH:MM"
  const currentBase = () => SENSORS.find((s) => s.id === sensorId).base;

  function makeReading(date) {
    const b = currentBase();
    return {
      label: timeLabel(date),
      temp: round(b.temp + noise(0.6), 1),
      hum: round(b.hum + noise(3)),
      co2: round(b.co2 + noise(50)),
      pm: Math.max(1, round(b.pm + noise(4))),
    };
  }

  // Keep a Date on the side so live simulation can add the next minute
  let lastTime = null;

  function buildWindow() {
    const now = new Date();
    now.setSeconds(0, 0);
    data = [];
    for (let i = WINDOW - 1; i >= 0; i--) {
      data.push(makeReading(new Date(now.getTime() - i * 60000)));
    }
    lastTime = now;
  }

  const visibleRows = () =>
    data.slice().reverse().filter((r) => !timeQuery || r.label.includes(timeQuery));   // newest first

  /* ---------- Table ---------- */
  function renderTable() {
    const rows = visibleRows();
    rowsEl.innerHTML = rows.length
      ? rows.map((r) => `
          <tr>
            <td class="time">${r.label}</td>
            <td>${r.temp}</td>
            <td>${r.hum}</td>
            <td>${r.co2}</td>
            <td>${r.pm}</td>
          </tr>`).join("")
      : `<tr><td colspan="5" class="empty">No readings match this time.</td></tr>`;

    // Brighten the header of the selected metric
    document.querySelectorAll("th[data-metric]").forEach((th) => {
      th.classList.toggle("is-active", th.dataset.metric === metric);
    });
  }

  /* ---------- Chart ---------- */
  function renderChart(animate = true) {
    if (!window.Chart) {
      $("tsChart").hidden = true;
      $("chartFallback").hidden = false;
      return;
    }
    const m = METRICS[metric];
    const labels = data.map((r) => r.label);
    const values = data.map((r) => r[m.key]);

    if (!chart) {
      Chart.defaults.color = "#7f8d89";
      Chart.defaults.font.family = '"Inter", system-ui, sans-serif';

      chart = new Chart($("tsChart"), {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: m.label,
            data: values,
            borderColor: "#2de2be",
            backgroundColor: "rgba(45, 226, 190, 0.10)",
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: "#2de2be",
            tension: 0.35,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0b1312",
              borderColor: "rgba(255,255,255,0.1)",
              borderWidth: 1,
              titleColor: "#eef4f2",
              bodyColor: "#c5d0cc",
              padding: 10,
              displayColors: false,
              callbacks: {
                label: (c) => `${METRICS[metric].label}: ${c.parsed.y} ${METRICS[metric].unit}`,
              },
            },
          },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { maxTicksLimit: 8, maxRotation: 0 } },
            y: {
              grid: { color: "rgba(255,255,255,0.05)" },
              grace: "10%",
              title: { display: true, text: `${m.label} (${m.unit})`, color: "#7f8d89" },
            },
          },
        },
      });
      return;
    }

    chart.data.labels = labels;
    chart.data.datasets[0].label = m.label;
    chart.data.datasets[0].data = values;
    chart.options.scales.y.title.text = `${m.label} (${m.unit})`;
    chart.update(animate ? undefined : "none");
  }

  function renderAll() {
    renderChart();
    renderTable();
  }

  /* ---------- Controls ---------- */
  $("sensorSelect").innerHTML = SENSORS
    .map((s) => `<option value="${s.id}">${s.id} · ${s.type}</option>`)
    .join("");

  $("metricSelect").addEventListener("change", (e) => {
    metric = e.target.value;
    renderAll();
  });

  $("sensorSelect").addEventListener("change", (e) => {
    sensorId = e.target.value;
    buildWindow();
    renderAll();
  });

  $("timeFilter").addEventListener("input", (e) => {
    timeQuery = e.target.value.trim();
    renderTable();
  });

  $("refreshBtn").addEventListener("click", () => {
    buildWindow();
    renderAll();
  });

  /* ---------- Export CSV (exports the rows you see) ---------- */
  $("exportBtn").addEventListener("click", () => {
    const header = ["Time", "Temperature (°C)", "Humidity (%)", "CO2 (ppm)", "PM2.5 (µg/m³)"];
    const lines = [header, ...visibleRows().map((r) => [r.label, r.temp, r.hum, r.co2, r.pm])]
      .map((row) => row.join(","))
      .join("\n");

    // "\ufeff" helps Excel show ° and µ correctly
    const blob = new Blob(["\ufeff" + lines], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sensorId}_time-series.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  /* ---------- Live Simulation (sidebar toggle) ---------- */
  function tick() {
    lastTime = new Date(lastTime.getTime() + 60000);
    data.push(makeReading(lastTime));
    data.shift();
    renderChart(false);
    renderTable();
  }

  function startSim() { if (!simTimer) simTimer = setInterval(tick, 3000); }
  function stopSim() { clearInterval(simTimer); simTimer = null; }

  window.addEventListener("livesim", (e) => (e.detail.on ? startSim() : stopSim()));
  if ($("liveSim").checked) startSim();

  /* ---------- Start ---------- */
  buildWindow();
  renderAll();
})();
