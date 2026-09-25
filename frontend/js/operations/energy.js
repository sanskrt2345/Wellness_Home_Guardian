/* =========================================================
   CHECK CHART.JS
========================================================= */

if (typeof Chart === "undefined") {

  document.getElementById("chartTrend").parentElement.innerHTML =
    '<div class="chart-error">Chart.js could not be loaded. Please check your internet connection and refresh the page.</div>';

  document.getElementById("chartDevices").parentElement.innerHTML =
    '<div class="chart-error">Chart.js could not be loaded.</div>';

} else {

  /* =====================================================
     CHART DEFAULT SETTINGS
  ===================================================== */

  Chart.defaults.font.family = "'IBM Plex Sans', 'Segoe UI', sans-serif";
  Chart.defaults.color = "#8ba39e";

  const gridColor = "rgba(139,163,158,0.12)";

  /* =====================================================
     MONTHLY TREND DATA
  ===================================================== */

  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    values: [610, 585, 640, 660, 624],
  };

  /* =====================================================
     LINE CHART
  ===================================================== */

  const trendCanvas = document.getElementById("chartTrend");

  new Chart(trendCanvas, {
    type: "line",
    data: {
      labels: trendData.labels,
      datasets: [{
        label: "Energy (kWh)",
        data: trendData.values,
        borderColor: "#2fe0c2",
        backgroundColor: "rgba(47,224,194,.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#2fe0c2",
        pointBorderColor: "#101b1a",
        pointBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#152524",
          borderColor: "#1f3432",
          borderWidth: 1,
          titleColor: "#eaf5f3",
          bodyColor: "#8ba39e",
          padding: 12,
          callbacks: {
            label: function (context) {
              return " " + context.parsed.y + " kWh";
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: "#8ba39e" },
        },
        y: {
          beginAtZero: false,
          grid: { color: gridColor },
          ticks: {
            color: "#8ba39e",
            callback: function (value) {
              return value + " kWh";
            },
          },
        },
      },
    },
  });

  /* =====================================================
     DEVICE DATA
  ===================================================== */

  const deviceData = [
    { name: "HVAC", kwh: 420, color: "#2fe0c2" },
    { name: "Air Purifiers", kwh: 120, color: "#e0a44a" },
    { name: "Fans", kwh: 90, color: "#ef6b5c" },
    { name: "Sensor Network", kwh: 24, color: "#4f6b66" },
  ];

  /* =====================================================
     DOUGHNUT CHART
  ===================================================== */

  const deviceCanvas = document.getElementById("chartDevices");

  new Chart(deviceCanvas, {
    type: "doughnut",
    data: {
      labels: deviceData.map((device) => device.name),
      datasets: [{
        data: deviceData.map((device) => device.kwh),
        backgroundColor: deviceData.map((device) => device.color),
        borderColor: "#101b1a",
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#152524",
          borderColor: "#1f3432",
          borderWidth: 1,
          titleColor: "#eaf5f3",
          bodyColor: "#8ba39e",
          padding: 12,
          callbacks: {
            label: function (context) {
              return " " + context.label + ": " + context.parsed + " kWh";
            },
          },
        },
      },
    },
  });

  /* =====================================================
     DEVICE LIST
  ===================================================== */

  const deviceList = document.getElementById("deviceList");

  deviceList.innerHTML = deviceData
    .map(function (device) {
      return `
        <div class="device-row">
          <span class="swatch" style="background:${device.color}"></span>
          <span class="name">${device.name}</span>
          <span class="kwh">${device.kwh} kWh</span>
        </div>
      `;
    })
    .join("");
}

/* =========================================================
   REFRESH BUTTON
========================================================= */

const refreshButton = document.getElementById("refreshBtn");

refreshButton.addEventListener("click", function () {
  const button = this;
  const originalHTML = button.innerHTML;

  button.disabled = true;
  button.innerHTML = "Refreshing…";

  setTimeout(function () {
    button.innerHTML = originalHTML;
    button.disabled = false;
  }, 700);
});

/* =========================================================
   RANGE SELECT
========================================================= */

const rangeSelect = document.getElementById("rangeSelect");

rangeSelect.addEventListener("change", function () {
  console.log("Selected range:", this.value, "days");
});

/* =========================================================
   LIVE SIMULATION TOGGLE
========================================================= */

const liveToggle = document.getElementById("liveToggle");

liveToggle.addEventListener("click", () => {
  const isOn = liveToggle.getAttribute("aria-checked") === "true";
  liveToggle.setAttribute("aria-checked", String(!isOn));
});