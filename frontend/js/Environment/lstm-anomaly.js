/* =====================================================
   lstm-anomaly.js  —  ONLY for lstm-anomaly.html
   Frontend simulation only: no real model, no server
   ===================================================== */

(function () {
  const $ = (id) => document.getElementById(id);

  const STEPS = 30;                    // sequence window (timesteps)
  const THRESHOLD = 0.75;              // reconstruction threshold
  const EXPECTED = 650;                // CO2 (ppm) the model expects
  const RING_C = 2 * Math.PI * 62;     // ring circle length

  const rand = (a, b) => a + Math.random() * (b - a);

  // score >= 0.75 High, >= 0.5 Medium, otherwise Low
  function levelOf(score) {
    if (score >= THRESHOLD) return { cls: "rose",    label: "High",   color: "var(--rose)" };
    if (score >= 0.5)       return { cls: "warn",    label: "Medium", color: "var(--amber)" };
    return                         { cls: "neutral", label: "Low",    color: "var(--green)" };
  }

  /* ---------- Fake data ---------- */
  // Normal line stays near 650 ppm. The anomalous line copies it,
  // then jumps to the "reading" in the last 3 timesteps.
  function makeScenario(reading) {
    const normal = Array.from({ length: STEPS }, () => Math.round(EXPECTED + rand(-25, 25)));
    const anomalous = normal.map((v, i) =>
      i < STEPS - 3 ? v : Math.round(v + (reading - v) * [0.12, 0.45, 1][i - (STEPS - 3)])
    );
    const score = Math.min(0.99, Math.abs(reading - EXPECTED) / 2010);
    return { normal, anomalous, reading, score };
  }

  function randomReading() {
    const r = Math.random();
    if (r < 0.4) return Math.round(EXPECTED + rand(1300, 2150));   // usually High
    if (r < 0.7) return Math.round(EXPECTED + rand(700, 1200));    // Medium / High
    return Math.round(EXPECTED + rand(80, 500));                   // Low
  }

  let current = makeScenario(2500);                                 // same as the screenshot

  const timeline = [
    { time: "12:15 PM", sensor: "CO2",   score: 0.92 },
    { time: "02:10 PM", sensor: "VOC",   score: 0.61 },
    { time: "08:45 AM", sensor: "PM2.5", score: 0.38 },
  ];

  /* ---------- Rendering ---------- */
  function renderResult() {
    const lv = levelOf(current.score);
    $("scoreValue").textContent = current.score.toFixed(2);

    const arc = $("ringArc");
    arc.style.strokeDasharray = `${current.score * RING_C} ${RING_C}`;
    arc.style.stroke = lv.color;

    const pill = $("levelPill");
    pill.className = `pill pill-${lv.cls}`;
    pill.innerHTML = `<span class="dot"></span>${lv.label}`;

    $("detNote").textContent = `Reading of ${current.reading} ppm vs expected ~${EXPECTED} ppm`;
  }

  function renderTimeline() {
    $("timelineRows").innerHTML = timeline.map((t) => {
      const lv = levelOf(t.score);
      return `
        <tr>
          <td class="mono">${t.time}</td>
          <td>${t.sensor}</td>
          <td class="mono">${t.score.toFixed(2)}</td>
          <td><span class="pill pill-${lv.cls}"><span class="dot"></span>${lv.label}</span></td>
        </tr>`;
    }).join("");
  }

  /* ---------- Chart (Chart.js) ---------- */
  let chart = null;
  const stepLabels = Array.from({ length: STEPS }, (_, i) => (i === STEPS - 1 ? "t" : `t-${STEPS - 1 - i}`));

  function renderChart() {
    if (!window.Chart) {
      $("seqChart").hidden = true;
      $("seqFallback").hidden = false;
      return;
    }

    if (chart) {
      chart.data.datasets[0].data = current.normal;
      chart.data.datasets[1].data = current.anomalous;
      chart.update();
      return;
    }

    Chart.defaults.color = "#7f8d89";
    Chart.defaults.font.family = '"Inter", system-ui, sans-serif';
    const grid = { color: "rgba(255,255,255,0.05)" };

    chart = new Chart($("seqChart"), {
      type: "line",
      data: {
        labels: stepLabels,
        datasets: [
          {
            label: "Normal input",
            data: current.normal,
            borderColor: "#2de2be", backgroundColor: "#2de2be",
            borderWidth: 2, pointRadius: 2, pointHoverRadius: 4, tension: 0.25,
          },
          {
            label: "Anomalous input",
            data: current.anomalous,
            borderColor: "#f4617f", backgroundColor: "#f4617f",
            borderWidth: 2, pointRadius: 2, pointHoverRadius: 4, tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top", align: "end",
            labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, color: "#c5d0cc" },
          },
          tooltip: {
            backgroundColor: "#0b1312",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            titleColor: "#eef4f2",
            bodyColor: "#c5d0cc",
            padding: 10,
            callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y} ppm` },
          },
        },
        scales: {
          x: { grid, ticks: { maxTicksLimit: 10, maxRotation: 0 } },
          y: { grid, beginAtZero: true, title: { display: true, text: "CO2 (ppm)", color: "#7f8d89" } },
        },
      },
    });
  }

  /* ---------- Run Detection ---------- */
  let busy = false;

  function run() {
    if (busy) return;
    busy = true;
    $("runBtn").disabled = true;
    $("runLabel").textContent = "Running…";
    $("modelNote").textContent = "Analysing sequence…";

    setTimeout(() => {
      current = makeScenario(randomReading());
      timeline.unshift({
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        sensor: "CO2",
        score: current.score,
      });
      if (timeline.length > 8) timeline.pop();

      renderResult();
      renderChart();
      renderTimeline();

      $("runBtn").disabled = false;
      $("runLabel").textContent = "Run Detection";
      $("modelNote").textContent = "Simulation Ready";
      busy = false;
    }, 900);
  }

  $("runBtn").addEventListener("click", run);

  /* ---------- Live Simulation (sidebar toggle): auto-run every 6 s ---------- */
  let simTimer = null;
  function startSim() { if (!simTimer) simTimer = setInterval(run, 6000); }
  function stopSim() { clearInterval(simTimer); simTimer = null; }

  window.addEventListener("livesim", (e) => (e.detail.on ? startSim() : stopSim()));
  if ($("liveSim").checked) startSim();

  /* ---------- Start ---------- */
  renderResult();
  renderChart();
  renderTimeline();
})();
