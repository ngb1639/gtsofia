async function loadHomeAlerts() {
  const container = document.getElementById("alertsContainer");
  if (!container) return;

  const alerts = await getAlerts();

  if (!alerts.length) {
    container.innerHTML = "<p>Няма активни маршрутни промени.</p>";
    return;
  }

  container.innerHTML = alerts.map(alert => {

    const isMetro = alert.type === "metro";
    const icon = getIcon(alert.type);

    // Create all badges
    const badgesHTML = (alert.lines || []).map(line => {

      const color = isMetro
        ? getMetroColor(line)
        : getTypeColor(alert.type);

      if (isMetro) {
        return `
          <div style="
            width:30px;
            height:30px;
            border-radius:50%;
            background:${color};
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
          background:${color};
          color:white;
          padding:6px 12px;
          border-radius:6px;
          font-weight:700;
          font-size:17px;
          width:60px;
          height:30px;
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          ${line}
        </div>
      `;
    }).join("");

    // One icon + all badges
    const linesHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">

        <div style="
          width:30px;
          height:30px;
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
        ">
          <img src="${icon}" style="width:30px;height:30px;" />
        </div>

        <div style="
          display:flex;
          flex-wrap:wrap;
          gap:6px;
          align-items:center;
        ">
          ${badgesHTML}
        </div>

      </div>
    `;

    return `
      <div class="info-card" style="margin-bottom:10px;">

        ${linesHTML}

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
