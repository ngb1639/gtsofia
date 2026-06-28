async function getAlerts() {
  const res = await fetch("alerts.json");
  return await res.json();
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

  container.innerHTML = alerts.map(a => `
    <div class="info-card" style="margin-bottom:10px;">
      <h3>⚠ ${a.title}</h3>
      <p>${a.text}</p>
      ${a.to ? `<small>До: ${a.to}</small>` : ""}
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
    a.lines.includes(lineNumber)
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
      </div>
    `).join("")}
  `;
}
