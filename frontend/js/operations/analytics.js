document.addEventListener("DOMContentLoaded", function () {

  /* =================================================
     CHECK CHART.JS
  ================================================= */
  if (typeof Chart === "undefined") {
    ["riskChart", "wellnessChart", "airChart", "sensorChart", "anomalyChart"].forEach(function (id) {
      showChartError(id, "Chart.js could not be loaded. Please check your internet connection and refresh the page.");
    });
  } else {
    initCharts();
  }

  /* =================================================
     SIDEBAR NAVIGATION (active state)
  ================================================= */
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      navLinks.forEach(function (item) { item.classList.remove("active"); });
      this.classList.add("active");
      closeSidebar();
    });
  });

  /* =================================================
     MOBILE SIDEBAR TOGGLE
  ================================================= */
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuBtn = document.getElementById("menuBtn");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openSidebar);
  }
  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  /* =================================================
     LIVE SIMULATION SWITCH
  ================================================= */
  const simSwitch = document.getElementById("simSwitch");
  if (simSwitch) {
    simSwitch.addEventListener("click", function () {
      const isOn = this.classList.toggle("on");
      this.setAttribute("aria-pressed", isOn ? "true" : "false");
    });
  }

  /* =================================================
     RANGE BUTTONS
  ================================================= */
  const rangeButtons = document.querySelectorAll(".range-tabs button");
  rangeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      rangeButtons.forEach(function (item) { item.classList.remove("active"); });
      this.classList.add("active");
      const selectedRange = this.dataset.range;
      console.log("Selected range:", selectedRange, "days");
    });
  });

});

/* =====================================================
   CHART ERROR FUNCTION
===================================================== */
function showChartError(canvasId, message) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const parent = canvas.parentElement;
  parent.innerHTML = '<div class="chart-error">' + message + "</div>";
}

/* =====================================================
   CHART INITIALIZATION
===================================================== */
function initCharts() {

  Chart.defaults.color = "#8ea1a8";
  Chart.defaults.font.family = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  Chart.defaults.font.size = 11.5;

  const teal = "#2dd9c0";
  const tealFill = "rgba(45,217,192,0.12)";
  const gridColor = "rgba(255,255,255,0.05)";

  function commonOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0e151c",
          borderColor: "#1c2933",
          borderWidth: 1,
          titleColor: "#eef3f4",
          bodyColor: "#8ea1a8",
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8ea1a8", maxRotation: 0 },
          border: { display: false }
        },
        y: {
          grid: { color: gridColor },
          border: { display: false },
          ticks: { color: "#8ea1a8" }
        }
      }
    };
  }

  /* HEALTH RISK TREND */
  new Chart(document.getElementById("riskChart"), {
    type: "line",
    data: {
      labels: ["Wk1", "Wk2", "Wk3", "Wk4", "Wk5", "Wk6", "Wk7"],
      datasets: [{
        label: "Risk Score",
        data: [38, 44, 58, 63, 34, 47, 29],
        borderColor: "#e0a94f",
        backgroundColor: "rgba(224,169,79,0.10)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#e0a94f",
        pointBorderColor: "#0e151c",
        pointBorderWidth: 2,
        borderWidth: 2.5
      }]
    },
    options: commonOptions()
  });

  /* WELLNESS SCORE */
  const wellnessOptions = commonOptions();
  wellnessOptions.scales.y = {
    grid: { color: gridColor },
    border: { display: false },
    min: 60,
    max: 100,
    ticks: { color: "#8ea1a8" }
  };

  new Chart(document.getElementById("wellnessChart"), {
    type: "line",
    data: {
      labels: ["Wk1", "Wk2", "Wk3", "Wk4", "Wk5", "Wk6", "Wk7"],
      datasets: [{
        label: "Wellness Score",
        data: [79, 81, 80, 83, 85, 84, 86],
        borderColor: teal,
        backgroundColor: tealFill,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: teal,
        pointBorderColor: "#0e151c",
        pointBorderWidth: 2,
        borderWidth: 2.5
      }]
    },
    options: wellnessOptions
  });

  /* AIR QUALITY */
  new Chart(document.getElementById("airChart"), {
    type: "doughnut",
    data: {
      labels: ["Good", "Moderate", "Poor"],
      datasets: [{
        data: [64, 29, 7],
        backgroundColor: [teal, "#e0a94f", "#e0716a"],
        borderColor: "#0e151c",
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { color: "#8ea1a8", boxWidth: 10, boxHeight: 10, padding: 14, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: "#0e151c",
          borderColor: "#1c2933",
          borderWidth: 1,
          titleColor: "#eef3f4",
          bodyColor: "#8ea1a8",
          padding: 10,
          callbacks: {
            label: function (context) {
              return " " + context.label + ": " + context.parsed + "%";
            }
          }
        }
      }
    }
  });

  /* SENSOR HEALTH */
  const sensorOptions = commonOptions();
  sensorOptions.indexAxis = "y";
  sensorOptions.scales = {
    x: {
      grid: { color: gridColor },
      min: 0,
      max: 100,
      ticks: { color: "#8ea1a8", callback: function (value) { return value + "%"; } },
      border: { display: false }
    },
    y: {
      grid: { display: false },
      ticks: { color: "#8ea1a8" },
      border: { display: false }
    }
  };

  new Chart(document.getElementById("sensorChart"), {
    type: "bar",
    data: {
      labels: ["Motion", "Air", "Temp", "Water", "Door", "Smoke"],
      datasets: [{
        label: "Health",
        data: [98, 95, 100, 88, 92, 100],
        backgroundColor: teal,
        borderRadius: 6,
        maxBarThickness: 22
      }]
    },
    options: sensorOptions
  });

  /* ANOMALY FREQUENCY */
  const anomalyOptions = commonOptions();
  anomalyOptions.scales = {
    x: {
      grid: { display: false },
      ticks: { color: "#8ea1a8", maxTicksLimit: 7 },
      border: { display: false }
    },
    y: {
      grid: { color: gridColor },
      beginAtZero: true,
      ticks: { color: "#8ea1a8", stepSize: 1 },
      border: { display: false }
    }
  };

  new Chart(document.getElementById("anomalyChart"), {
    type: "bar",
    data: {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"],
      datasets: [{
        label: "Anomalies",
        data: [1, 0, 2, 1, 3, 2, 1, 0, 1, 4, 2, 1, 0, 1],
        backgroundColor: "rgba(45,217,192,0.55)",
        borderRadius: 4,
        maxBarThickness: 16
      }]
    },
    options: anomalyOptions
  });

}