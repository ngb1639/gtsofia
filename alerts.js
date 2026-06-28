async function getAlerts() {
  const res = await fetch("alerts.json");
  return await res.json();
}

/* =========================
HELPER: affected lines
========================= */
function getAffectedLines(alerts) {
  const set = new Set();

  alerts.forEach(a => {
    (a.lines || []).forEach(l => set.add(String(l)));
  });

  return set;
}

/* =========================
HOME PAGE ALERTS
========================= */
async function loadHomeAlerts() {
  const container = document.getElementById("alertsContainer");
  if (!container) return;

  const alerts = await getAlerts();

  if (!alerts.length) {
    container.innerHTML = "<p>Няма активни маршрутни промени.</p>";
    return;
  }

  const affected = getAffectedLines(alerts);

  container.innerHTML = alerts.map(a => `
    <div class="info-card" style="margin-bottom:10px;">
      
      <h3>
        ${a.lines.some(l => affected.has(String(l))) ? "⚠ " : ""}
        ${a.title}
      </h3>

      <p>${a.text}</p>

      ${a.to ? `<small>До: ${a.to}</small>` : ""}

      <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
        ${a.lines.map(l => `
          <span style="
            background:${affected.has(String(l)) ? '#111827' : '#e5e7eb'};
            color:${affected.has(String(l)) ? 'white' : '#111827'};
            font-size:12px;
            padding:3px 8px;
            border-radius:999px;
            font-weight:600;
          ">
            ${affected.has(String(l)) ? "⚠ " : ""}${l}
          </span>
        `).join("")}
      </div>

    </div>
  `).join("");
}

/* =========================
TRANSPORT PAGE ALERTS
========================= */
async function showLineAlerts(lineNumber) {
  const container = document.getElementById("lineAlerts");
  if (!container) return;

  const alerts = await getAlerts();

  const filtered = alerts.filter(a =>
    a.lines.includes(String(lineNumber))
  );

  if (!filtered.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="line-note">
      ⚠ Има активни маршрутни промени за тази линия
    </div>

    ${filtered.map(a => `
      <div class="info-card" style="margin-bottom:10px;">
        <strong>${a.title}</strong>
        <p>${a.text}</p>
        ${a.to ? `<small>До: ${a.to}</small>` : ""}
      </div>
    `).join("")}
  `;
}
