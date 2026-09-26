/* ================= EVENTS ================= */

const events = [
  { time: "11:40:00", actor: "System", sub: "AI Engine", role: "AI Engine", text: "LSTM flagged anomalous CO2 sequence" },
  { time: "11:05:32", actor: "Owner", sub: "Owner", role: "Owner", text: "acknowledged ALT003" },
  { time: "10:42:09", actor: "System", sub: "AI Engine", role: "AI Engine", text: "raised alert ALT001 (CO2 threshold)" },
  { time: "10:02:15", actor: "System", sub: "AI Engine", role: "AI Engine", text: "generated health risk prediction" },
  { time: "09:24:41", actor: "Technician", sub: "Technician", role: "Technician", text: "calibrated SEN001" },
  { time: "09:18:03", actor: "Admin", sub: "Owner", role: "Owner", text: "created HOME001" },
];

/* ================= ELEMENTS ================= */

const timeline = document.getElementById("timeline");
const logBody = document.getElementById("logBody");

/* ================= DISPLAY EVENTS ================= */

events.forEach((e) => {
  /* Timeline */
  const item = document.createElement("div");
  item.className = "t-item";
  item.innerHTML = `
    <div class="t-time">${e.time}</div>
    <div class="t-desc"><b>${e.actor} (${e.sub})</b> ${e.text}</div>
  `;
  timeline.appendChild(item);

  /* Activity Table */
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="time">${e.time}</td>
    <td class="user">${e.actor}</td>
    <td class="role">${e.role}</td>
  `;
  logBody.appendChild(row);
});

/* ================= LIVE SIMULATION TOGGLE ================= */

const liveToggle = document.getElementById("liveToggle");

liveToggle.addEventListener("click", () => {
  const isOn = liveToggle.getAttribute("aria-checked") === "true";
  liveToggle.setAttribute("aria-checked", String(!isOn));
});