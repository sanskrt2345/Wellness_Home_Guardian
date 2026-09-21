/* ================================================================
   WELLNESS HOME GUARDIAN — DASHBOARD FRONTEND JS
   Frontend-only demo. Sensor values and chart data are simulated.
================================================================ */

/* ---------------------------------------------------------------
   1. ICONS
---------------------------------------------------------------- */
const ICONS = {
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>',
  sensor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M4.9 4.9a10 10 0 000 14.2M19.1 4.9a10 10 0 010 14.2M8 8a5 5 0 000 8M16 8a5 5 0 010 8"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"/><circle cx="17.5" cy="8.5" r="2.6"/><path d="M16 13.8c2.6.4 4.5 2.6 4.5 5.4"/></svg>',
  room:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 10h18M9 20v-6"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V9M11 19V5M18 19v-7"/><path d="M2 19h20"/></svg>',
  air:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h11a3 3 0 100-3"/><path d="M2 13h15a3 3 0 110 3"/><path d="M4 18h9a2.5 2.5 0 102-4"/></svg>',
  brain:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4a3 3 0 00-3 3v.3A3 3 0 004 10v1a3 3 0 001 2.2V15a3 3 0 003 3h1"/><path d="M15 4a3 3 0 013 3v.3A3 3 0 0120 10v1a3 3 0 01-1 2.2V15a3 3 0 01-3 3h-1"/><path d="M9 4v16M15 4v16"/></svg>',
  pulse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 5.7-8 11-8 11z"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>',
  wrench:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-2.4 2.6-2.6z"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  trend:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 6h6v6"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>'
};

function ic(name, size = 17) {
  return `<span style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center">${ICONS[name] || ''}</span>`;
}


/* ---------------------------------------------------------------
   2. NAVIGATION
---------------------------------------------------------------- */
const NAV = [
  {
    group: 'Overview',
    items: [
      {id:'dashboard', label:'Dashboard', icon:'dashboard'}
    ]
  },

  {
    group: 'Home Management',
    items: [
      {id:'homes', label:'Home Registry', icon:'home'},
      {id:'occupants', label:'Occupants', icon:'users'},
      {id:'rooms', label:'Rooms', icon:'room'}
    ]
  },

  {
    group: 'Environment',
    items: [
      {id:'sensors', label:'Sensors', icon:'sensor'},
      {id:'timeseries', label:'Time-Series Data', icon:'chart'},
      {id:'iaq', label:'Indoor Air Quality', icon:'air'}
    ]
  },

  {
    group: 'AI Intelligence',
    items: [
      {id:'lstm', label:'LSTM Anomaly Detection', icon:'brain'},
      {id:'riskpred', label:'Health Risk Prediction', icon:'pulse'}
    ]
  },

  {
    group: 'Wellness',
    items: [
      {id:'wellness', label:'Wellness Scores', icon:'heart'},
      {id:'recommendations', label:'Recommendations', icon:'spark'}
    ]
  },

  {
    group: 'Operations',
    items: [
      {id:'alerts', label:'Alerts', icon:'bell'},
      {id:'maintenance', label:'Maintenance', icon:'wrench'},
      {id:'energy', label:'Energy Monitoring', icon:'bolt'},
      {id:'audit', label:'Audit Trail', icon:'clock'}
    ]
  },

  {
    group: 'Analytics',
    items: [
      {id:'analytics', label:'Analytics', icon:'trend'},
      {id:'sdg', label:'SDG Impact', icon:'globe'}
    ]
  }
];

const PAGE_META = {
  dashboard: [
    'Dashboard',
    'Real-time indoor health intelligence overview'
  ],

  homes: [
    'Home Registry',
    'Manage properties enrolled in the monitoring program'
  ],

  occupants: [
    'Occupants',
    'Residents and their environmental health sensitivity profile'
  ],

  rooms: [
    'Rooms',
    'Room-level environmental zones across all homes'
  ],

  sensors: [
    'Sensors',
    'IoT sensor fleet — simulated frontend devices'
  ],

  timeseries: [
    'Time-Series Data',
    'Explore historical simulated sensor readings'
  ],

  iaq: [
    'Indoor Air Quality',
    'Pollutant levels and air quality index'
  ],

  lstm: [
    'LSTM Anomaly Detection',
    'Simulated deep-learning anomaly detection on sensor sequences'
  ],

  riskpred: [
    'Health Risk Prediction',
    'Simulated environmental health-risk model'
  ],

  wellness: [
    'Wellness Scores',
    'Composite indoor wellness scoring engine'
  ],

  recommendations: [
    'Recommendations',
    'AI-generated action suggestions'
  ],

  alerts: [
    'Alerts',
    'Active and historical environmental alerts'
  ],

  maintenance: [
    'Maintenance',
    'Device calibration & service schedule'
  ],

  energy: [
    'Energy Monitoring',
    'Consumption across connected devices'
  ],

  audit: [
    'Audit Trail',
    'System and user activity log'
  ],

  analytics: [
    'Analytics',
    'Cross-module trends and distributions'
  ],

  sdg: [
    'SDG Impact',
    'Alignment with UN Sustainable Development Goals'
  ]
};


/* ---------------------------------------------------------------
   3. DEMO DATA
---------------------------------------------------------------- */
const DB = {

  homes: [
    {
      id:'HOME001',
      name:'Green Residency',
      address:'Baner Road',
      city:'Pune',
      country:'India',
      owner:'Riya Admin',
      type:'Apartment',
      area:'1450 sq.ft'
    },

    {
      id:'HOME002',
      name:'Wellness Villa',
      address:'Bandra West',
      city:'Mumbai',
      country:'India',
      owner:'Karan Mehta',
      type:'Villa',
      area:'3200 sq.ft'
    },

    {
      id:'HOME003',
      name:'Smart Habitat',
      address:'Hinjewadi Phase 2',
      city:'Pune',
      country:'India',
      owner:'Anita Shah',
      type:'Office',
      area:'5100 sq.ft'
    }
  ],

  rooms: [
    {
      id:'ROOM001',
      home:'HOME001',
      name:'Living Room',
      status:'Optimal'
    },

    {
      id:'ROOM002',
      home:'HOME001',
      name:'Master Bedroom',
      status:'Optimal'
    },

    {
      id:'ROOM003',
      home:'HOME001',
      name:'Kitchen',
      status:'Attention'
    },

    {
      id:'ROOM004',
      home:'HOME003',
      name:'Open Office',
      status:'Optimal'
    }
  ],

  sensors: [
    {
      id:'SEN001',
      type:'CO2',
      status:'Healthy'
    },

    {
      id:'SEN002',
      type:'PM2.5',
      status:'Healthy'
    },

    {
      id:'SEN003',
      type:'Humidity',
      status:'Maintenance Due'
    },

    {
      id:'SEN004',
      type:'Temperature',
      status:'Healthy'
    }
  ],

  alerts: [
    {
      severity:'High',
      message:'CO2 exceeding threshold in Living Room',
      time:'10:42 AM'
    },

    {
      severity:'Medium',
      message:'PM2.5 level increasing steadily',
      time:'09:15 AM'
    },

    {
      severity:'Low',
      message:'Humidity approaching recommended range boundary',
      time:'Yesterday'
    },

    {
      severity:'Critical',
      message:'VOC spike detected after cleaning activity',
      time:'2 days ago'
    }
  ]
};


/* ---------------------------------------------------------------
   4. ENVIRONMENT
---------------------------------------------------------------- */
let ENV = {
  temp:25.4,
  hum:54,
  co2:680,
  pm25:18,
  voc:0.42,
  noise:38
};

let liveOn = false;
let liveTimer = null;
let chartInstance = null;


/* ---------------------------------------------------------------
   5. HELPERS
---------------------------------------------------------------- */
function rand(min, max, dec = 0) {

  const value = Math.random() * (max - min) + min;

  return Number(value.toFixed(dec));
}


function statusBadge(status) {

  const map = {
    Healthy:'badge-good',
    Optimal:'badge-good',
    Good:'badge-good',
    Active:'badge-info',
    Medium:'badge-warn',
    High:'badge-bad',
    Critical:'badge-bad',
    Low:'badge-neutral',
    Attention:'badge-warn',
    'Maintenance Due':'badge-warn'
  };

  return `
    <span class="badge ${map[status] || 'badge-neutral'}">
      <span class="dot"></span>
      ${status}
    </span>
  `;
}


function homeName(id) {

  const home = DB.homes.find(h => h.id === id);

  return home ? home.name : id;
}


function toast(message, sub = '', type = 'info') {

  const stack = document.getElementById('toastStack');

  if (!stack) return;

  const item = document.createElement('div');

  item.className = `toast ${type}`;

  item.innerHTML = `
    <div class="toast-ic">
      ${type === 'success'
        ? ICONS.check
        : ICONS.bell}
    </div>

    <div>
      <div class="msg">${message}</div>

      ${
        sub
          ? `<div class="sub">${sub}</div>`
          : ''
      }
    </div>
  `;

  stack.appendChild(item);

  setTimeout(() => {

    item.classList.add('out');

    setTimeout(() => {
      item.remove();
    }, 260);

  }, 3000);
}


function animateCounters(root = document) {

  root
    .querySelectorAll('[data-count]')
    .forEach(element => {

      const target = Number(
        element.dataset.count || 0
      );

      const suffix =
        element.dataset.suffix || '';

      const start = performance.now();

      const duration = 750;

      function step(now) {

        const progress =
          Math.min(
            1,
            (now - start) / duration
          );

        const eased =
          1 - Math.pow(1 - progress, 3);

        element.textContent =
          Math.round(target * eased)
          .toLocaleString()
          + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);

    });
}


function animateBars(root = document) {

  root
    .querySelectorAll('.bar-fill[data-w]')
    .forEach(element => {

      requestAnimationFrame(() => {

        element.style.width =
          `${element.dataset.w}%`;

      });

    });
}


function ringGauge(
  id,
  value,
  max,
  color,
  size = 150,
  stroke = 13
) {

  const radius =
    (size - stroke) / 2;

  const circumference =
    2 * Math.PI * radius;

  return `
    <div
      class="ring-wrap"
      style="
        width:${size}px;
        height:${size}px;
        position:relative;
        display:grid;
        place-items:center;
      "
    >

      <svg
        width="${size}"
        height="${size}"
        viewBox="0 0 ${size} ${size}"
        style="transform:rotate(-90deg)"
      >

        <circle
          cx="${size/2}"
          cy="${size/2}"
          r="${radius}"
          stroke="rgba(255,255,255,.07)"
          stroke-width="${stroke}"
          fill="none"
        />

        <circle
          id="${id}"
          cx="${size/2}"
          cy="${size/2}"
          r="${radius}"
          stroke="${color}"
          stroke-width="${stroke}"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${circumference}"
          style="transition:stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)"
        />

      </svg>

    </div>
  `;
}


function animateRing(id, value, max) {

  const element =
    document.getElementById(id);

  if (!element) return;

  const radius =
    element.r.baseVal.value;

  const circumference =
    2 * Math.PI * radius;

  const pct =
    Math.max(
      0,
      Math.min(1, value / max)
    );

  requestAnimationFrame(() => {

    element.style.strokeDashoffset =
      circumference * (1 - pct);

  });
}


function gridOpt() {

  return {
    grid: {
      color:'rgba(255,255,255,.055)'
    },

    ticks: {
      font:{
        size:11
      },

      color:'#9fb3ae'
    }
  };
}


/* ---------------------------------------------------------------
   6. NAV BUILD
---------------------------------------------------------------- */
function buildNav() {

  const nav =
    document.getElementById('navScroll');

  if (!nav) return;

  nav.innerHTML =
    NAV.map(group => `

      <div class="nav-group">

        <div class="nav-group-label">
          ${group.group}
        </div>

        ${
          group.items
            .map(item => {

              const href =
                item.id === 'homes'
                  ? 'home/home-registry.html'
                  : '#';

              return `
                <a
                  href="${href}"
                  class="nav-item"
                  data-view="${item.id}"
                >

                  ${ic(item.icon,17)}

                  <span>
                    ${item.label}
                  </span>

                </a>
              `;

            })
            .join('')
        }

      </div>

    `).join('');


  nav
    .querySelectorAll('.nav-item')
    .forEach(item => {

      item.addEventListener(
        'click',
        event => {

          const view =
            item.dataset.view;

          /*
             Home Registry is a separate HTML page.
             Let the browser follow its real link.
          */
          if (view === 'homes') {

            closeMobileSidebar();

            return;
          }


          event.preventDefault();


          if (view !== 'dashboard') {

            toast(
              'Module ready for next frontend step',
              item.textContent.trim(),
              'info'
            );

            return;
          }


          navigateDashboard();

          closeMobileSidebar();

        }
      );

    });
}


function setActiveNav(view) {

  document
    .querySelectorAll('.nav-item')
    .forEach(item => {

      item.classList.toggle(
        'active',
        item.dataset.view === view
      );

    });
}


function navigateDashboard() {

  setActiveNav('dashboard');

  const title =
    document.getElementById('pageTitle');

  const sub =
    document.getElementById('pageSub');

  if (title) {
    title.textContent =
      PAGE_META.dashboard[0];
  }

  if (sub) {
    sub.textContent =
      PAGE_META.dashboard[1];
  }

  renderDashboard();

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
}


/* ---------------------------------------------------------------
   7. DASHBOARD UI
---------------------------------------------------------------- */
function envTile(label, value, id) {

  return `
    <div
      class="card-flat"
      style="padding:12px;"
    >

      <div class="eyebrow">
        ${label}
      </div>

      <div
        id="${id}"
        style="
          font-family:'Space Grotesk';
          font-size:17px;
          font-weight:700;
          margin-top:6px;
        "
      >
        ${value}
      </div>

    </div>
  `;
}


function liveSensorRow(name, status) {

  return `
    <div
      style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:8px 0;
        border-bottom:
          1px solid rgba(255,255,255,.05);
      "
    >

      <span
        style="
          font-size:12.5px;
          color:var(--ink-1);
        "
      >
        ${name}
      </span>

      ${statusBadge(status)}

    </div>
  `;
}


function renderDashboard() {

  const content =
    document.getElementById('content');

  if (!content) return;


  content.innerHTML = `

    <div class="view active">


      <!-- =====================================================
           KPI ROW 1
      ====================================================== -->

      <div
        class="grid g4"
        style="margin-bottom:20px;"
      >

        <div class="card">

          <div class="kpi-top">

            <div class="kpi-icon">
              ${ic('home',20)}
            </div>

            <div class="trend up">
              ${ic('trend',13)}
              4.2%
            </div>

          </div>

          <div
            class="kpi-value"
            data-count="1250"
          >
            0
          </div>

          <div class="kpi-label">
            Homes Monitored
          </div>

        </div>


        <div class="card">

          <div class="kpi-top">

            <div
              class="kpi-icon"
              style="
                background:rgba(55,201,232,.12);
                color:var(--cyan);
              "
            >
              ${ic('sensor',20)}
            </div>

            <div class="trend up">
              ${ic('trend',13)}
              2.1%
            </div>

          </div>

          <div
            class="kpi-value"
            data-count="14850"
          >
            0
          </div>

          <div class="kpi-label">
            Active Sensors
          </div>

        </div>


        <div class="card">

          <div class="kpi-top">

            <div
              class="kpi-icon"
              style="
                background:rgba(242,99,122,.12);
                color:var(--rose);
              "
            >
              ${ic('bell',20)}
            </div>

            <div class="trend down">
              ${ic('trend',13)}
              1.4%
            </div>

          </div>

          <div
            class="kpi-value"
            data-count="87"
          >
            0
          </div>

          <div class="kpi-label">
            Health Alerts
          </div>

        </div>


        <div class="card">

          <div class="kpi-top">

            <div
              class="kpi-icon"
              style="
                background:rgba(245,182,77,.12);
                color:var(--amber);
              "
            >
              ${ic('brain',20)}
            </div>

            <div class="trend up">
              ${ic('trend',13)}
              6.7%
            </div>

          </div>

          <div
            class="kpi-value"
            data-count="132"
          >
            0
          </div>

          <div class="kpi-label">
            Anomalies Detected
          </div>

        </div>

      </div>


      <!-- =====================================================
           KPI ROW 2
      ====================================================== -->

      <div
        class="grid g4"
        style="margin-bottom:20px;"
      >

        <div class="card">

          <div class="kpi-top">

            <div
              class="kpi-icon"
              style="
                background:rgba(139,123,240,.12);
                color:var(--violet);
              "
            >
              ${ic('spark',20)}
            </div>

            <div class="trend up">
              ${ic('trend',13)}
              3.5%
            </div>

          </div>

          <div
            class="kpi-value"
            data-count="5420"
          >
            0
          </div>

          <div class="kpi-label">
            Predictions Generated
          </div>

        </div>


        <div class="card">

          <div class="kpi-top">

            <div
              class="kpi-icon"
              style="
                background:rgba(52,211,153,.12);
                color:var(--emerald);
              "
            >
              ${ic('heart',20)}
            </div>

            <div class="trend up">
              ${ic('trend',13)}
              1.8%
            </div>

          </div>

          <div
            class="kpi-value"
            data-count="86"
            data-suffix="%"
          >
            0
          </div>

          <div class="kpi-label">
            Average Wellness Score
          </div>

        </div>


        <div
          class="card"
          style="grid-column:span 2;"
        >

          <div class="ai-head">

            <div class="ai-orb">
              ${ic('brain',17)}
            </div>

            <div>

              <div
                style="
                  font-weight:700;
                  font-size:13.5px;
                "
              >
                AI Insight
              </div>

              <div class="eyebrow">
                Simulated model output
              </div>

            </div>

          </div>

          <p
            style="
              font-size:12.5px;
              color:var(--ink-2);
              line-height:1.6;
            "
          >
            CO2 levels are currently normal, but the model
            estimates a gradual increase during the next 2 hours
            if ventilation remains unchanged. Consider opening
            windows in the Living Room.
          </p>

        </div>

      </div>


      <!-- =====================================================
           ENVIRONMENT TREND
      ====================================================== -->

      <div
        class="grid g-2-1"
        style="margin-bottom:20px;"
      >

        <div class="card">

          <div
            style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              margin-bottom:18px;
            "
          >

            <div>

              <div
                class="section-title"
                style="font-size:16px;"
              >
                Environmental Trend
              </div>

              <div class="eyebrow">
                Last 24 hours · Simulated Data
              </div>

            </div>

          </div>

          <div class="chart-box">

            <canvas
              id="dashTrendChart"
            ></canvas>

          </div>

        </div>


        <!-- WELLNESS -->

        <div class="card">

          <div
            class="section-title"
            style="
              font-size:16px;
              margin-bottom:16px;
            "
          >
            Wellness Score
          </div>

          <div
            style="
              display:flex;
              justify-content:center;
              position:relative;
            "
          >

            ${ringGauge(
              'dashWellnessRing',
              86,
              100,
              '#2ee6b8',
              150,
              13
            )}

            <div class="ring-center">

              <div class="num">
                86
              </div>

              <div class="lbl">
                Excellent
              </div>

            </div>

          </div>

        </div>

      </div>


      <!-- =====================================================
           ENVIRONMENT DETAILS
      ====================================================== -->

      <div
        class="grid g3"
        style="margin-bottom:20px;"
      >


        <!-- INDOOR ENVIRONMENT -->

        <div class="card">

          <div
            class="section-title"
            style="
              font-size:15px;
              margin-bottom:14px;
            "
          >
            Indoor Environment
          </div>

          <div
            style="
              display:grid;
              grid-template-columns:1fr 1fr;
              gap:12px;
            "
          >

            ${envTile(
              'Temperature',
              `${ENV.temp}°C`,
              'temp-tile-t'
            )}

            ${envTile(
              'Humidity',
              `${ENV.hum}%`,
              'temp-tile-h'
            )}

            ${envTile(
              'CO2',
              `${ENV.co2} ppm`,
              'temp-tile-c'
            )}

            ${envTile(
              'PM2.5',
              `${ENV.pm25} µg/m³`,
              'temp-tile-p'
            )}

            ${envTile(
              'VOC',
              `${ENV.voc} ppm`,
              'temp-tile-v'
            )}

            ${envTile(
              'Noise',
              `${ENV.noise} dB`,
              'temp-tile-n'
            )}

          </div>

        </div>


        <!-- AIR QUALITY -->

        <div class="card">

          <div
            class="section-title"
            style="
              font-size:15px;
              margin-bottom:16px;
            "
          >
            Air Quality Score
          </div>

          <div
            style="
              display:flex;
              justify-content:center;
              position:relative;
              margin-bottom:10px;
            "
          >

            ${ringGauge(
              'dashAqiRing',
              42,
              150,
              '#37c9e8',
              130,
              12
            )}

            <div class="ring-center">

              <div
                class="num"
                style="font-size:24px;"
              >
                42
              </div>

              <div class="lbl">
                AQI · Good
              </div>

            </div>

          </div>

          <div
            class="badge badge-good"
            style="
              justify-content:center;
              width:100%;
            "
          >
            Air quality within safe range
          </div>

        </div>


        <!-- SENSOR STATUS -->

        <div class="card">

          <div
            class="section-title"
            style="
              font-size:15px;
              margin-bottom:14px;
            "
          >
            Live Sensor Status
          </div>

          ${liveSensorRow(
            'CO2 Sensor',
            'Healthy'
          )}

          ${liveSensorRow(
            'PM2.5 Sensor',
            'Healthy'
          )}

          ${liveSensorRow(
            'Humidity Sensor',
            'Maintenance Due'
          )}

          ${liveSensorRow(
            'Temperature Sensor',
            'Healthy'
          )}

          <div
            class="pulse-strip"
            style="margin-top:12px;"
          >
            <span class="pulse"></span>
            4/4 sensors reporting · simulated feed
          </div>

        </div>

      </div>


      <!-- =====================================================
           ALERTS + ROOM OVERVIEW
      ====================================================== -->

      <div class="grid g-1-2">


        <!-- RECENT ALERTS -->

        <div class="card">

          <div
            class="section-title"
            style="
              font-size:15px;
              margin-bottom:14px;
            "
          >
            Recent Alerts
          </div>

          ${
            DB.alerts
              .map(alert => `

                <div
                  style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:10px 0;
                    border-bottom:
                      1px solid rgba(255,255,255,.05);
                    gap:12px;
                  "
                >

                  <div>

                    <div
                      style="
                        font-size:12.5px;
                        font-weight:600;
                      "
                    >
                      ${alert.message}
                    </div>

                    <div
                      class="eyebrow"
                      style="margin-top:2px;"
                    >
                      ${alert.time}
                    </div>

                  </div>

                  ${statusBadge(alert.severity)}

                </div>

              `)
              .join('')
          }

        </div>


        <!-- ROOM OVERVIEW -->

        <div class="card">

          <div
            class="section-title"
            style="
              font-size:15px;
              margin-bottom:14px;
            "
          >
            Room Environment Overview
          </div>

          <div class="grid g4">

            ${
              DB.rooms
                .map(room => `

                  <div
                    class="card-flat"
                    style="padding:14px;"
                  >

                    <div class="eyebrow">
                      ${homeName(room.home)}
                    </div>

                    <div
                      style="
                        font-weight:600;
                        font-size:13.5px;
                        margin:4px 0 8px;
                      "
                    >
                      ${room.name}
                    </div>

                    ${statusBadge(room.status)}

                  </div>

                `)
                .join('')
            }

          </div>

        </div>

      </div>

    </div>
  `;


  animateCounters(content);

  animateBars(content);

  setupDashboardChart();


  setTimeout(() => {

    animateRing(
      'dashWellnessRing',
      86,
      100
    );

    animateRing(
      'dashAqiRing',
      42,
      150
    );

  }, 80);
}


/* ---------------------------------------------------------------
   8. CHART
---------------------------------------------------------------- */
function setupDashboardChart() {

  const canvas =
    document.getElementById(
      'dashTrendChart'
    );

  if (
    !canvas ||
    typeof Chart === 'undefined'
  ) {
    return;
  }


  if (chartInstance) {

    try {
      chartInstance.destroy();
    } catch (_) {}

  }


  const labels =
    Array.from(
      {length:12},
      (_,i) => `${8+i}:00`
    );


  chartInstance = new Chart(
    canvas,
    {
      type:'line',

      data:{
        labels,

        datasets:[
          {
            label:'Temperature (°C)',

            data:
              labels.map(
                () => rand(23,27,1)
              ),

            borderColor:'#2ee6b8',

            backgroundColor:
              'rgba(46,230,184,.08)',

            tension:.4,

            fill:true,

            pointRadius:0,

            borderWidth:2
          },

          {
            label:'Humidity (%)',

            data:
              labels.map(
                () => rand(45,65,0)
              ),

            borderColor:'#37c9e8',

            tension:.4,

            pointRadius:0,

            borderWidth:2
          },

          {
            label:'CO2 (÷10 ppm)',

            data:
              labels.map(
                () => rand(60,110,0)
              ),

            borderColor:'#f5b64d',

            tension:.4,

            pointRadius:0,

            borderWidth:2
          },

          {
            label:'PM2.5 (µg/m³)',

            data:
              labels.map(
                () => rand(10,30,0)
              ),

            borderColor:'#f2637a',

            tension:.4,

            pointRadius:0,

            borderWidth:2
          }
        ]
      },

      options:{

        responsive:true,

        maintainAspectRatio:false,

        interaction:{
          mode:'index',
          intersect:false
        },

        plugins:{

          legend:{
            position:'bottom',

            labels:{
              boxWidth:9,
              boxHeight:9,
              usePointStyle:true,
              padding:14,

              font:{
                size:11
              }
            }
          }

        },

        scales:{
          x:gridOpt(),
          y:gridOpt()
        }
      }
    }
  );
}


/* ---------------------------------------------------------------
   9. LIVE SIMULATION
---------------------------------------------------------------- */
function updateDashboardEnv() {

  const values = {

    'temp-tile-t':
      `${ENV.temp}°C`,

    'temp-tile-h':
      `${ENV.hum}%`,

    'temp-tile-c':
      `${ENV.co2} ppm`,

    'temp-tile-p':
      `${ENV.pm25} µg/m³`,

    'temp-tile-v':
      `${ENV.voc} ppm`,

    'temp-tile-n':
      `${ENV.noise} dB`

  };


  Object
    .entries(values)
    .forEach(([id,value]) => {

      const element =
        document.getElementById(id);

      if (element) {
        element.textContent = value;
      }

    });
}


function tickLiveData() {

  ENV = {

    temp:
      rand(24,27,1),

    hum:
      rand(45,65,0),

    co2:
      rand(600,1200,0),

    pm25:
      rand(10,35,0),

    voc:
      rand(.2,.7,2),

    noise:
      rand(30,55,0)

  };


  updateDashboardEnv();
}


function setupSimulation() {

  const toggle =
    document.getElementById(
      'liveSwitch'
    );

  if (!toggle) return;


  toggle.addEventListener(
    'click',
    () => {

      liveOn = !liveOn;

      toggle.classList.toggle(
        'on',
        liveOn
      );


      if (liveOn) {

        toast(
          'Live simulation enabled',
          'Sensor values refresh every 3 seconds',
          'info'
        );

        tickLiveData();

        liveTimer =
          setInterval(
            tickLiveData,
            3000
          );

      } else {

        clearInterval(
          liveTimer
        );

        toast(
          'Live simulation paused',
          '',
          'info'
        );

      }

    }
  );
}


/* ---------------------------------------------------------------
   10. DROPDOWNS
---------------------------------------------------------------- */
function setupDropdown(
  buttonId,
  dropdownId
) {

  const button =
    document.getElementById(buttonId);

  const dropdown =
    document.getElementById(dropdownId);


  if (
    !button ||
    !dropdown
  ) {
    return;
  }


  button.addEventListener(
    'click',
    event => {

      event.stopPropagation();

      dropdown.classList.toggle(
        'open'
      );

    }
  );


  document.addEventListener(
    'click',
    () => {

      dropdown.classList.remove(
        'open'
      );

    }
  );


  dropdown.addEventListener(
    'click',
    event => {

      event.stopPropagation();

    }
  );
}


/* ---------------------------------------------------------------
   11. MOBILE SIDEBAR
---------------------------------------------------------------- */
function setupMobileSidebar() {

  const hamburger =
    document.getElementById(
      'hamburgerBtn'
    );

  const sidebar =
    document.getElementById(
      'sidebar'
    );

  const overlay =
    document.getElementById(
      'sidebarOverlay'
    );


  if (
    !hamburger ||
    !sidebar ||
    !overlay
  ) {
    return;
  }


  hamburger.addEventListener(
    'click',
    () => {

      sidebar.classList.add(
        'open'
      );

      overlay.classList.add(
        'open'
      );

    }
  );


  overlay.addEventListener(
    'click',
    closeMobileSidebar
  );
}


function closeMobileSidebar() {

  const sidebar =
    document.getElementById(
      'sidebar'
    );

  const overlay =
    document.getElementById(
      'sidebarOverlay'
    );


  if (sidebar) {
    sidebar.classList.remove(
      'open'
    );
  }


  if (overlay) {
    overlay.classList.remove(
      'open'
    );
  }
}


/* ---------------------------------------------------------------
   12. GLOBAL SEARCH
---------------------------------------------------------------- */
function setupGlobalSearch() {

  const input =
    document.getElementById(
      'globalSearch'
    );

  if (!input) return;


  input.addEventListener(
    'keydown',
    event => {

      if (event.key !== 'Enter') {
        return;
      }


      const query =
        input.value
          .trim()
          .toLowerCase();


      if (!query) {
        return;
      }


      const homeMatch =
        DB.homes.some(
          home =>
            `${home.name}
             ${home.id}
             ${home.city}`
            .toLowerCase()
            .includes(query)
        );


      if (homeMatch) {

        window.location.href =
          'home/home-registry.html';

        return;
      }


      const sensorMatch =
        DB.sensors.some(
          sensor =>
            `${sensor.id}
             ${sensor.type}`
            .toLowerCase()
            .includes(query)
        );


      if (sensorMatch) {

        toast(
          'Sensor found',
          'Sensors module will be connected next',
          'info'
        );

        return;
      }


      if (
        query.includes(
          'dashboard'
        )
      ) {

        navigateDashboard();

        return;
      }


      toast(
        'No direct match',
        'Try a home, sensor or occupant name',
        'info'
      );

    }
  );
}


/* ---------------------------------------------------------------
   13. INITIALIZE
---------------------------------------------------------------- */
document.addEventListener(
  'DOMContentLoaded',
  () => {

    buildNav();

    setActiveNav(
      'dashboard'
    );

    setupDropdown(
      'notifBtn',
      'notifDropdown'
    );

    setupDropdown(
      'profileBtn',
      'profileDropdown'
    );

    setupMobileSidebar();

    setupSimulation();

    setupGlobalSearch();


    const title =
      document.getElementById(
        'pageTitle'
      );

    const sub =
      document.getElementById(
        'pageSub'
      );


    if (title) {

      title.textContent =
        PAGE_META.dashboard[0];

    }


    if (sub) {

      sub.textContent =
        PAGE_META.dashboard[1];

    }


    renderDashboard();

  }
);