async function getAlerts() {
  const res = await fetch("alerts.json");
  return await res.json();
}

/* =========================
HELPER: ICONS + COLORS
========================= */

const iconMap = {
  bus: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/bus.svg",
  tourist: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/torist-bus.svg",
  night: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/night-bus.svg",
  trolley: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/trolley.svg",
  tram: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%20icons/tram.svg",
  metro: "https://raw.githubusercontent.com/ngb1639/gtsofia/refs/heads/main/Icons/Active%icons/metro.svg"
};

const typeColors = {
  bus: "#be1e2d",
  tourist: "#006838",
  night: "#000000",
  trolley: "#2AA9E0",
  tram: "#F6921E"
};

const metroColors = {
  "1": "#ec2029",
  "2": "#1077bc",
  "3": "#3bb44b",
  "4": "#fcd403"
};

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

  container.innerHTML = alerts.map(a => {

    const type = a.type || "bus";
    const icon = iconMap[type] || iconMap.bus;

    return `
      <div class="info-card" style="margin-bottom:10px;">

        <!-- HEADER -->
        <div style="display:flex; align-items:center; gap:10px;">

          <img src="${icon}" style="width:28px;height:28px;" />

          <h3 style="margin:0;">
            ⚠ ${a.title}
          </h3>

        </div>

        <p style="margin-top:8px;">${a.text}</p>

        ${a.to ? `<small>До: ${a.to}</small>` : ""}

        <!-- BADGES -->
        <div style="
          margin-top:10px;
          display:flex;
          gap:6px;
          flex-wrap:wrap;
        ">

          ${a.lines.map(l => {

            let color = "#111827";

            if (type === "metro") {
              color = metroColors[l] || "#1077bc";
            }

            return `
              <span style="
                background:${color};
                color:white;
                font-size:12px;
                padding:3px 8px;
                border-radius:999px;
                font-weight:600;
                display:flex;
                align-items:center;
                gap:4px;
              ">
                ⚠ ${l}
              </span>
            `;
          }).join("")}

        </div>

      </div>
    `;
  }).join("");
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
