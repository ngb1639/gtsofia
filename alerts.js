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

    let linesHTML = "";

    // MULTIPLE LINES
    if ((alert.lines || []).length > 1) {

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

      linesHTML = `
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

    } else {

      // SINGLE LINE (your original design)

      const line = alert.lines[0];
      const color = isMetro
        ? getMetroColor(line)
        : getTypeColor(alert.type);

      if (isMetro) {

        linesHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin:6px 0;">

            <div style="
              width:30px;
              height:30px;
              display:flex;
              align-items:center;
              justify-content:center;
            ">
              <img src="${icon}" style="width:30px;height:30px;" />
            </div>

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

          </div>
        `;

      } else {

        linesHTML = `
          <div style="display:flex;align-items:center;gap:8px;margin:4px 0;">

            <div style="
              width:30px;
              height:30px;
              border-radius:50%;
              background:${color};
              display:flex;
              align-items:center;
              justify-content:center;
            ">
              <img src="${icon}" style="width:30px;height:30px;" />
            </div>

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

          </div>
        `;

      }
    }

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
