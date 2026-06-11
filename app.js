let currentFilter = null;

/* =========================
   ROUTER
========================= */

function showPage(page) {

  document.querySelectorAll(".page").forEach(p => {
    p.style.display = "none";
  });

  document.getElementById(page + "-page").style.display = "block";

  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.remove("active");
  });

  event?.target?.classList.add("active");

  if (page === "transport") renderLines();
  if (page === "fleet") renderFleet();
}

document.addEventListener("DOMContentLoaded", () => {
  showPage("home");
});

/* =========================
   TRANSPORT (ТВОЯ ЛОГИКА)
========================= */

function renderLines() {

  const grid = document.getElementById("linesGrid");
  const search = document.getElementById("searchInput")?.value?.toLowerCase() || "";

  grid.innerHTML = "";

  lines.filter(l =>
    (!currentFilter || l.type === currentFilter) &&
    l.number.toLowerCase().includes(search)
  ).forEach(line => {

    const el = document.createElement("div");

    if (line.type === "metro") {
      el.className = "metro-pill";
      el.style.background = line.color;
      el.style.color = line.textColor;
    } else {
      el.className = "line-pill";
      el.style.background = line.color;
    }

    el.innerText = line.number;
    el.onclick = () => selectLine(line);

    grid.appendChild(el);
  });
}

function selectLine(line) {

  const direction = line.activeDirection === "A"
    ? line.directionA
    : line.directionB;

  const stops = line.activeDirection === "A"
    ? line.stopsA
    : line.stopsB;

  const content = document.getElementById("contentArea");

  const pill = `
    <div class="details-pill">
      <div class="details-icon">
        <img src="${line.icon}" />
      </div>
      <div class="details-number" style="background:${line.color}; color:${line.textColor || 'white'}">
        ${line.number}
      </div>
    </div>`;

  content.innerHTML = `
    <div class="line-header">
      <div class="route-direction">
        ${pill}
        <img class="direction-arrow" src="https://sofiatraffic.bg/images/next.svg"/>
        <div class="destination-name">${direction}</div>
      </div>

      <button class="switch-btn" onclick="switchDirection('${line.type}','${line.number}')">
        Смяна на посоката
      </button>
    </div>

    ${line.note ? `<div class="line-note">${line.note}</div>` : ""}

    <div class="stops-card">
      ${stops.map(s => `
        <div class="stop-item">
          <div class="stop-dot"></div>
          <div class="stop-name">${s}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function switchDirection(type, number) {
  const line = lines.find(l => l.type === type && l.number === number);
  if (!line) return;

  line.activeDirection = line.activeDirection === "A" ? "B" : "A";
  selectLine(line);
}

function setFilter(type, el) {
  currentFilter = type;

  document.querySelectorAll(".filter-btn")
    .forEach(b => b.classList.remove("active"));

  if (el) el.classList.add("active");
  renderLines();
}

/* =========================
   FLEET (НОВО)
========================= */

function renderFleet() {

  const container = document.getElementById("fleetContainer");
  container.innerHTML = "";

  if (!fleet) return;

  fleet.forEach(v => {

    const card = document.createElement("div");
    card.className = "fleet-card";

    card.innerHTML = `
      <img src="${v.image}" class="fleet-img"/>

      <div class="fleet-title">
        ${v.manufacturer} ${v.model}
      </div>

      <div class="fleet-info">
        <div>Година: ${v.year}</div>
        <div>Бройки: ${v.quantity}</div>
      </div>

      <div class="fleet-routes">
        ${v.routes.map(r => `<span class="route-badge">${r}</span>`).join("")}
      </div>
    `;

    container.appendChild(card);
  });
}
