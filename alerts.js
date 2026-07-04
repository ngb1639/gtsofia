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

/* =========================
COLORS
========================= */

function getMetroColor(line) {
  switch (String(line)) {
    case "1": return "#ec2029";
    case "2": return "#1077bc";
    case "3": return "#3bb44b";
    case "4": return "#fcd403";
    default: return "#111827";
  }
}

function getMetroTextColor(line) {
  return String(line) === "4" ? "black" : "white";
}

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
HELPERS
========================= */

function getAllLinesByType(type) {
  if (typeof lines === "undefined") return [];
  return lines
    .filter(l => l.type === type)
    .map(l => String(l.number));
}

/* =========================
NORMALIZE ALERT
========================= */

function normalizeAlert(alert) {
  if (!alert.targets) {
    return {
      text: alert.text,
      to: alert.to,
      targets: [
        {
          type: alert.type,
          lines: alert.lines || []
        }
      ]
    };
  }

  return alert;
}

/* =========================
MATCH LOGIC
========================= */

function matchesAlert(alert, lineType, lineNumber) {
  const a = normalizeAlert(alert);

  return a.targets.some(t => {
    if (t.type !== lineType) return false;

    const lines = t.lines || [];

    const isAll =
      lines === "all" ||
      (Array.isArray(lines) && lines.includes("all")) ||
      (Array.isArray(lines) && lines.includes("Всички линии"));

    if (isAll) return true;

    return lines.includes(String(lineNumber));
  });
}

/* =========================
HOME PAGE ALERTS
========================= */

async function loadHomeAlerts() {
  const container = document.getElementById("alertsContainer");
  if (!container) return;

  let alerts;
  try {
    alerts = await getAlerts();
  } catch (e) {
    container.innerHTML = "<p>Грешка при зареждане на данни.</p>";
    return;
  }

  if (!alerts.length) {
    container.innerHTML = "<p>Няма активни маршрутни промени.</p>";
    return;
  }

  container.innerHTML = alerts.map(raw => {

    const alert = normalizeAlert(raw);

    const blocks = alert.targets.map(t => {

      const icon = getIcon(t.type);

      const isAll =
        t.lines === "all" ||
        (Array.isArray(t.lines) && t.lines.includes("all")) ||
        (Array.isArray(t.lines) && t.lines.includes("Всички линии"));

      const linesToShow = isAll
        ? getAllLinesByType(t.type)
        : (t.lines || []);

      const badgesHTML = isAll
        ? `
          <div style="
            display:flex;
            align-items:center;
            gap:6px;
            background:#111827;
            color:white;
            padding:6px 10px;
            border-radius:6px;
            font-weight:700;
            font-size:14px;
          ">
            Всички линии
          </div>
        `
        : linesToShow.map(line => {

            if (t.type === "metro") {
              return `
                <div style="
                  width:30px;
                  height:30px;
                  border-radius:50%;
                  background:${getMetroColor(line)};
                  color:${getMetroTextColor(line)};
                  font-weight:700;
                  font-size:17px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                ">
                  ${line}
                </div>
              `;
            }

            return `
              <div style="
                background:${getTypeColor(t.type)};
                color:white;
                padding:6px 10px;
                border-radius:6px;
                font-weight:700;
                font-size:17px;
                display:flex;
                align-items:center;
                justify-content:center;
                height:30px;
                width:60px;
              ">
                ${line}
              </div>
            `;
          }).join("");

      return `
        <div style="display:flex;align-items:center;gap:6px;margin:6px 0;flex-wrap:wrap;">

          <div style="
            width:30px;
            height:30px;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <img src="${icon}" style="width:30px;height:30px;" />
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${badgesHTML}
          </div>

        </div>
      `;
    }).join("");

    return `
      <div class="info-card" style="margin-bottom:10px;">

        <div style="margin-bottom:10px;">
          ${blocks}
        </div>

        <div style="margin-bottom:10px;font-size:15px;color:#374151;">
          ${alert.text}
        </div>

        ${alert.to ? `
          <div style="font-size:14px;color:#6b7280;">
            До: ${alert.to}
          </div>
        ` : ""}

      </div>
    `;
  }).join("");
}

/* =========================
TRANSPORT PAGE ALERTS
========================= */

async function showLineAlerts(lineNumber, lineType) {
  const container = document.getElementById("lineAlerts");
  if (!container) return;

  let alerts;
  try {
    alerts = await getAlerts();
  } catch {
    container.innerHTML = "";
    return;
  }

  const filtered = alerts.filter(a =>
    matchesAlert(a, lineType, lineNumber)
  );

  if (!filtered.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = filtered.map(a => {
    const alert = normalizeAlert(a);

    return `
      <div class="info-card" style="margin-bottom:10px;">

        <div style="margin-bottom:6px;">
          ${alert.text}
        </div>

        ${alert.to ? `
          <div style="font-size:13px;opacity:0.8;">
            До: ${alert.to}
          </div>
        ` : ""}

      </div>
    `;
  }).join("");
}
