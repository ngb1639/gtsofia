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
    case "bus": return "#BD202E";
    case "tourist": return "#006838";
    case "night": return "#000000";
    case "trolley": return "#2AA9E0";
    case "tram": return "#F7941F";
    case "metro": return "#111827";
    default: return "#111827";
  }
}

function getIcon(type) {
  return ICONS[type] || ICONS.bus;
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

  container.innerHTML = alerts.map(alert => {

    const linesHTML = (() => {
      const lines = alert.lines || [];
      if (!lines.length) return "";

      // GROUP BY TYPE
      const grouped = lines.reduce((acc, l) => {
        if (!acc[l.type]) acc[l.type] = [];
        acc[l.type].push(l.number);
        return acc;
      }, {});

      return Object.entries(grouped).map(([type, numbers]) => {

        const icon = getIcon(type);
        const isMetro = type === "metro";

        return `
          <div style="display:flex;align-items:flex-start;gap:8px;margin:6px 0;flex-wrap:wrap;">

            <!-- ICON -->
            <div style="
              width:30px;
              height:30px;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
            ">
              <img src="${icon}" style="width:30px;height:30px;" />
            </div>

            <!-- BADGES -->
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">

              ${
                isMetro
                  ? numbers.map(num => `
                      <div style="
                        width:30px;
                        height:30px;
                        border-radius:50%;
                        background:${getMetroColor(num)};
                        color:${getMetroTextColor(num)};
                        font-weight:700;
                        font-size:16px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        line-height:1;
                        flex:0 0 auto;
                      ">
                        ${num}
                      </div>
                    `).join("")
                  : numbers.map(num => `
                      <div style="
                        background:${getTypeColor(type)};
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
                        ${num}
                      </div>
                    `).join("")
              }

            </div>

          </div>
        `;
      }).join("");

    })();

    return `
      <div class="info-card" style="margin-bottom:10px;">

        <div style="margin-bottom:10px;">
          ${linesHTML}
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

  const alerts = await getAlerts();

  // Bus lines that should also match "tourist" alerts
  const touristLines = ["X43", "61", "63", "66", "103"];

  const filtered = alerts.filter(alert =>
    (alert.lines || []).some(l => {

      // Exact type match
      if (
        l.type === lineType &&
        String(l.number) === String(lineNumber)
      ) {
        return true;
      }

      // Tourist alerts should also appear on the corresponding bus pages
      if (
        l.type === "tourist" &&
        lineType === "bus" &&
        touristLines.includes(String(lineNumber)) &&
        String(l.number) === String(lineNumber)
      ) {
        return true;
      }

      return false;
    })
  );

  if (!filtered.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = filtered.map(a => `
    <div class="info-card" style="margin-bottom:10px;">

      <div style="font-weight:700;margin-bottom:6px;">
        ${a.title || ""}
      </div>

      <div style="margin-bottom:6px;">
        ${a.text}
      </div>

      ${a.to ? `
        <div style="font-size:13px;opacity:0.8;">
          До: ${a.to}
        </div>
      ` : ""}

    </div>
  `).join("");
}
