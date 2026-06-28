async function getAlerts() {
  const res = await fetch("alerts.json");
  return await res.json();
}

/* =========================
ICON + COLOR CONFIG
========================= */

const ICONS = {
  bus: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/bus.svg",
  tourist: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/torist-bus.svg",
  night: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/night-bus.svg",
  trolley: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/trolley.svg",
  tram: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/tram.svg",
  metro: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/metro.svg"
};

/* метро цветове */
function getMetroColor(line) {
  switch (String(line)) {
    case "1": return "#ec2029";
    case "2": return "#1077bc";
    case "3": return "#3bb44b";
    case "4": return "#fcd403";
    default: return "#111827";
  }
}

/* транспортни цветове */
function getTypeColor(type) {
  switch (type) {
    case "bus": return "#be1e2d";
    case "tourist": return "#006838";
    case "night": return "#000000";
    case "trolley": return "#2AA9E0";
    case "tram": return "#F6921E";
    case "metro": return "#111827";
    default: return "#111827";
  }
}

function getIcon(type) {
  return ICONS[type] || ICONS.bus;
}

/* =========================
HOME PAGE (ICON + PILL UI)
========================= */

async function loadHomeAlerts() {
  const container = document.getElementById("alertsContainer");
  if (!container) return;

  const alerts = await getAlerts();

  if (!alerts.length) {
    container.innerHTML = "<p>Няма активни маршрутни промени.</p>";
    return;
  }

  container.innerHTML = alerts.map(alert => {

    const linesHTML = (alert.lines || []).map(line => {

      const isMetro = alert.type === "metro";
      const bgColor = isMetro ? getMetroColor(line) : getTypeColor(alert.type);
      const icon = getIcon(alert.type);

      return `
        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          margin:4px 0;
        ">

          <!-- ICON -->
          <div style="
            width:30px;
            height:30px;
            border-radius:50%;
            background:${bgColor};
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <img src="${icon}" style="width:16px;height:16px;" />
          </div>

          <!-- PILL -->
          <div style="
            background:${bgColor};
            color:white;
            padding:6px 12px;
            border-radius:8px;
            font-weight:700;
            font-size:16px;
            min-width:42px;
            text-align:center;
          ">
            ${line}
          </div>

        </div>
      `;
    }).join("");

    return `
      <div class="info-card" style="margin-bottom:10px;">

        <div style="margin-bottom:10px; font-weight:700; font-size:16px;">
          ${alert.title}
        </div>

        <!-- LINES -->
        <div style="margin-bottom:10px;">
          ${linesHTML}
        </div>

        <!-- MESSAGE -->
        <div style="margin-bottom:10px; font-size:14px; color:#374151;">
          ${alert.text}
        </div>

        <!-- DATE -->
        ${alert.to ? `
          <div style="font-size:13px; color:#6b7280;">
            До: ${alert.to}
          </div>
        ` : ""}

      </div>
    `;
  }).join("");
}

/* =========================
TRANSPORT PAGE ALERTS (UNCHANGED)
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
