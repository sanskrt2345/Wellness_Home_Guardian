/* =====================================================
   sensors.js  —  ONLY for sensors.html (your page)
   ===================================================== */

(function () {
  // Unit + realistic range for each sensor type
  const TYPES = {
    "CO2":         { unit: "ppm",   dec: 0, min: 450, max: 900 },
    "PM2.5":       { unit: "µg/m³", dec: 0, min: 8,   max: 35 },
    "Humidity":    { unit: "%",     dec: 0, min: 40,  max: 70 },
    "Temperature": { unit: "°C",    dec: 1, min: 22,  max: 28 },
    "VOC":         { unit: "ppm",   dec: 2, min: 0.1, max: 0.6 },
    "Noise":       { unit: "dB",    dec: 0, min: 30,  max: 55 },
  };
  const STATUS_CLASS = { "Healthy": "ok", "Maintenance Due": "warn", "Offline": "off" };

  // Dummy data (same as the screenshot)
  let sensors = [
    { id: "SEN001", type: "CO2",         home: "Green Residency", room: "Living Room",    installed: "2026-02-14", value: 680,  status: "Healthy" },
    { id: "SEN002", type: "PM2.5",       home: "Green Residency", room: "Master Bedroom", installed: "2026-02-14", value: 18,   status: "Healthy" },
    { id: "SEN003", type: "Humidity",    home: "Green Residency", room: "Kitchen",        installed: "2026-01-30", value: 63,   status: "Maintenance Due" },
    { id: "SEN004", type: "Temperature", home: "Wellness Villa",  room: "Living Room",    installed: "2026-03-02", value: 25.4, status: "Healthy" },
    { id: "SEN005", type: "VOC",         home: "Smart Habitat",   room: "Open Office",    installed: "2026-03-10", value: 0.42, status: "Healthy" },
    { id: "SEN006", type: "Noise",       home: "Wellness Villa",  room: "Living Room",    installed: "2026-01-18", value: 38,   status: "Healthy" },
  ].map((s) => ({ ...s, unit: TYPES[s.type].unit, dec: TYPES[s.type].dec }));

  let query = "";
  let mode = "add";      // "add" | "edit" | "view"
  let editingId = null;
  let simTimer = null;

  const $ = (id) => document.getElementById(id);
  const rowsEl = $("sensorRows");
  const modal = $("modal");
  const form = $("sensorForm");

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (s) => `${s.value.toFixed(s.dec)} ${s.unit}`;
  const rand = (min, max) => min + Math.random() * (max - min);

  /* ---------- Table ---------- */
  function rowHTML(s) {
    return `
      <tr data-id="${s.id}">
        <td class="mono id">${esc(s.id)}</td>
        <td class="type">${esc(s.type)}</td>
        <td>${esc(s.home)}</td>
        <td>${esc(s.room)}</td>
        <td class="mono">${esc(s.installed)}</td>
        <td class="mono reading">${fmt(s)}</td>
        <td><span class="pill pill-${STATUS_CLASS[s.status]}"><span class="dot"></span>${esc(s.status)}</span></td>
        <td>
          <div class="actions">
            <button class="icon-btn" data-action="view" title="View" aria-label="View ${esc(s.id)}"><i data-lucide="eye"></i></button>
            <button class="icon-btn" data-action="edit" title="Edit" aria-label="Edit ${esc(s.id)}"><i data-lucide="pencil"></i></button>
            <button class="icon-btn danger" data-action="delete" title="Delete" aria-label="Delete ${esc(s.id)}"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>`;
  }

  function render() {
    const list = sensors.filter((s) =>
      !query || [s.id, s.type, s.home, s.room, s.status].join(" ").toLowerCase().includes(query)
    );
    rowsEl.innerHTML = list.length
      ? list.map(rowHTML).join("")
      : `<tr><td colspan="8" class="empty">No sensors match your search.</td></tr>`;

    const online = sensors.filter((s) => s.status !== "Offline").length;
    $("connectivityText").textContent = `Sensor Connectivity — ${online}/${sensors.length} online (simulated)`;
    lucide.createIcons();
  }

  /* ---------- Search (page box + topbar box) ---------- */
  ["searchSensors", "globalSearch"].forEach((id) => {
    $(id).addEventListener("input", (e) => {
      query = e.target.value.trim().toLowerCase();
      render();
    });
  });

  /* ---------- Row buttons ---------- */
  rowsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.closest("tr").dataset.id;
    const sensor = sensors.find((s) => s.id === id);

    if (btn.dataset.action === "delete") {
      if (confirm(`Delete ${id}? This cannot be undone.`)) {
        sensors = sensors.filter((s) => s.id !== id);
        render();
      }
    } else {
      openModal(btn.dataset.action, sensor);
    }
  });

  /* ---------- Modal ---------- */
  $("fType").innerHTML = Object.keys(TYPES).map((t) => `<option>${t}</option>`).join("");

  function openModal(m, s) {
    mode = m;
    editingId = s ? s.id : null;
    $("modalTitle").textContent = m === "view" ? "Sensor details" : m === "edit" ? "Edit sensor" : "Add sensor";
    $("fType").value = s ? s.type : "CO2";
    $("fStatus").value = s ? s.status : "Healthy";
    $("fHome").value = s ? s.home : "";
    $("fRoom").value = s ? s.room : "";
    $("fDate").value = s ? s.installed : new Date().toISOString().slice(0, 10);

    [...form.elements].forEach((el) => {
      if (el.tagName !== "BUTTON") el.disabled = m === "view";
    });
    $("modalSave").hidden = m === "view";
    modal.hidden = false;
    lucide.createIcons();
    (m === "view" ? $("modalClose") : $("fHome")).focus();
  }

  function closeModal() { modal.hidden = true; }

  $("addSensorBtn").addEventListener("click", () => openModal("add"));
  $("modalClose").addEventListener("click", closeModal);
  $("modalCancel").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (mode === "view") return;

    const data = {
      type: $("fType").value,
      status: $("fStatus").value,
      home: $("fHome").value.trim(),
      room: $("fRoom").value.trim(),
      installed: $("fDate").value,
    };

    if (mode === "add") {
      const t = TYPES[data.type];
      const next = Math.max(0, ...sensors.map((s) => parseInt(s.id.slice(3), 10))) + 1;
      sensors.push({ id: "SEN" + String(next).padStart(3, "0"), ...data, unit: t.unit, dec: t.dec, value: rand(t.min, t.max) });
    } else {
      const s = sensors.find((x) => x.id === editingId);
      const typeChanged = s.type !== data.type;
      Object.assign(s, data);
      if (typeChanged) {
        const t = TYPES[data.type];
        Object.assign(s, { unit: t.unit, dec: t.dec, value: rand(t.min, t.max) });
      }
    }
    closeModal();
    render();
  });

  /* ---------- Live Simulation (sidebar toggle) ---------- */
  function updateReadings() {
    rowsEl.querySelectorAll("tr[data-id]").forEach((tr) => {
      const s = sensors.find((x) => x.id === tr.dataset.id);
      if (s) tr.querySelector(".reading").textContent = fmt(s);
    });
  }

  function startSim() {
    if (simTimer) return;
    simTimer = setInterval(() => {
      sensors.forEach((s) => {
        if (s.status === "Offline") return;
        const t = TYPES[s.type];
        const step = (t.max - t.min) * 0.05;
        s.value = Math.min(t.max, Math.max(t.min, s.value + (Math.random() - 0.5) * step));
      });
      updateReadings();
    }, 2000);
  }

  function stopSim() { clearInterval(simTimer); simTimer = null; }

  window.addEventListener("livesim", (e) => (e.detail.on ? startSim() : stopSim()));
  if ($("liveSim").checked) startSim();

  render();
})();
