let currentFilter = null;

// =========================
// MAP STATE
// =========================
let map = null;
let currentPolyline = null;
let shapeIndex = {}; // will be filled later (optional)


// =========================
// RENDER LIST
// =========================
function renderLines() {

  const grid = document.getElementById("linesGrid");
  const search = document.getElementById("searchInput").value.toLowerCase();

  grid.innerHTML = "";

  lines.filter(l =>
    (!currentFilter || l.type === currentFilter) &&
    l.number.toLowerCase().includes(search)
  ).forEach(line => {

    if (line.type === "metro") {

      const el = document.createElement("div");
      el.className = "metro-pill";
      el.style.background = line.color;
      el.style.color = line.textColor;
      el.innerText = line.number;
      el.onclick = () => selectLine(line);
      grid.appendChild(el);

    } else {

      const el = document.createElement("div");
      el.className = "line-pill";
      el.style.background = line.color;
      el.innerText = line.number;
      el.onclick = () => selectLine(line);
      grid.appendChild(el);

    }

  });

}


// =========================
// LINE SELECTION
// =========================
function selectLine(line) {

  const direction = line.activeDirection === "A"
    ? line.directionA
    : line.directionB;

  const stops = line.activeDirection === "A"
    ? line.stopsA
    : line.stopsB;

  const content = document.getElementById("contentArea");

  const pill = line.type === "metro"
    ? `
      <div class="details-pill">
        <div class="details-icon">
          <img src="${line.icon}" />
        </div>
        <div class="metro-pill"
          style="background:${line.color}; color:${line.textColor};">
          ${line.number}
        </div>
      </div>`
    : `
      <div class="details-pill">
        <div class="details-icon">
          <img src="${line.icon}" />
        </div>
        <div class="details-number" style="background:${line.color}">
          ${line.number}
        </div>
      </div>`;

  content.innerHTML = `
    <div class="line-header">
      <div class="line-left">

        <div class="route-direction">
          ${pill}
          <img class="direction-arrow" src="https://sofiatraffic.bg/images/next.svg"/>
          <div class="destination-name">
            ${direction}
          </div>
        </div>

      </div>

      <button class="switch-btn"
        onclick="switchDirection('${line.type}', '${line.number}')">
        Смяна на посоката
      </button>
    </div>

    ${line.note ? `
      <div class="line-note">
        ${line.note}
      </div>
    ` : ""}

    <div class="stops-card">
      <div class="stops-line">
        ${stops.map(s => `
          <div class="stop-item">
            <div class="stop-dot"></div>
            <div class="stop-name">${s}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- MAP (NEW) -->
    <div id="routeMap" class="route-map"></div>
  `;

  // render map AFTER DOM update
  setTimeout(() => renderShapeForLine(line), 0);
}


// =========================
// SWITCH DIRECTION
// =========================
function switchDirection(type, number) {

  const line = lines.find(
    l => l.type === type && l.number === number
  );

  if (!line) return;

  line.activeDirection = line.activeDirection === "A" ? "B" : "A";
  selectLine(line);
}


// =========================
// FILTER
// =========================
function setFilter(type, el) {
  currentFilter = type;

  document.querySelectorAll(".filter-btn")
    .forEach(b => b.classList.remove("active"));

  if (el) el.classList.add("active");
  renderLines();
}


// =========================
// SEARCH
// =========================
document.getElementById("searchInput")
  .addEventListener("input", renderLines);


// =========================
// MAP INIT
// =========================
function initMap() {

  if (map) return;

  map = L.map("routeMap").setView([42.6977, 23.3219], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

}


// =========================
// LOAD SHAPE (SAFE)
// =========================
async function loadShape(shapeId) {
  try {
    const res = await fetch(`shapes/${shapeId}.json`);
    return await res.json();
  } catch (e) {
    console.warn("No shape found:", shapeId);
    return null;
  }
}


// =========================
// DRAW SHAPE
// =========================
function drawShape(points, color) {

  if (!map || !points) return;

  if (currentPolyline) {
    map.removeLayer(currentPolyline);
  }

  currentPolyline = L.polyline(points, {
    color,
    weight: 4
  }).addTo(map);

  map.fitBounds(currentPolyline.getBounds(), {
    padding: [20, 20]
  });
}


// =========================
// RENDER SHAPE FOR LINE
// =========================
async function renderShapeForLine(line) {

  const shapeInfo = shapeIndex[line.number];

  if (!shapeInfo) return;

  const shapeId =
    line.activeDirection === "A"
      ? shapeInfo.A
      : shapeInfo.B;

  if (!shapeId) return;

  initMap();

  const shape = await loadShape(shapeId);

  if (!shape) return;

  drawShape(shape, line.color);
}


// =========================
// INIT
// =========================
renderLines();
