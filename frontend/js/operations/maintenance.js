const devices = [
  { id: "SEN001", last: "2026-08-01", next: "2026-11-01", status: "healthy" },
  { id: "SEN002", last: "2026-07-15", next: "2026-10-15", status: "healthy" },
  { id: "SEN003", last: "2026-06-05", next: "2026-09-05", status: "due" },
  { id: "SEN004", last: "2026-08-20", next: "2026-11-20", status: "healthy" },
];

const statusMeta = {
  healthy: { label: "Healthy" },
  due: { label: "Due" },
  overdue: { label: "Overdue" },
};

const tbody = document.getElementById("deviceBody");

function render() {
  tbody.innerHTML = "";
  devices.forEach((d, idx) => {
    const tr = document.createElement("tr");

    const markBtn = d.status === "due" || d.status === "overdue"
      ? `<button class="mark-btn" data-idx="${idx}" data-action="complete">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>
           Mark Completed
         </button>`
      : "";

    tr.innerHTML = `
      <td class="device">${d.id}</td>
      <td class="date">${d.last}</td>
      <td class="date">${d.next}</td>
      <td><span class="status-pill ${d.status}"><span class="dot"></span>${statusMeta[d.status].label}</span></td>
      <td class="actions-cell">
        <div class="row-actions">
          ${markBtn}
          <button class="icon-action" data-idx="${idx}" data-action="edit" aria-label="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="icon-action danger" data-idx="${idx}" data-action="delete" aria-label="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  updateStats();
}

function updateStats() {
  document.getElementById("healthyCount").textContent = devices.filter(d => d.status === "healthy").length;
  document.getElementById("dueCount").textContent = devices.filter(d => d.status === "due").length;
  document.getElementById("overdueCount").textContent = devices.filter(d => d.status === "overdue").length;
}

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  const action = btn.dataset.action;

  if (action === "complete") {
    const today = new Date();
    const next = new Date(today);
    next.setMonth(next.getMonth() + 3);
    devices[idx].last = today.toISOString().slice(0, 10);
    devices[idx].next = next.toISOString().slice(0, 10);
    devices[idx].status = "healthy";
    render();
  } else if (action === "delete") {
    devices.splice(idx, 1);
    render();
  } else if (action === "edit") {
    alert(`Edit ${devices[idx].id} — wire this up to your edit modal/API.`);
  }
});

document.getElementById("scheduleBtn").addEventListener("click", () => {
  const id = prompt("Device ID (e.g. SEN005):");
  if (!id) return;
  devices.push({
    id,
    last: new Date().toISOString().slice(0, 10),
    next: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "healthy",
  });
  render();
});

/* ---- Live Simulation toggle ---- */
const liveToggle = document.getElementById("liveToggle");
liveToggle.addEventListener("click", () => {
  const isOn = liveToggle.getAttribute("aria-checked") === "true";
  liveToggle.setAttribute("aria-checked", String(!isOn));
});

render();