let currentFilter = null;
let currentMap = null;

function renderLines() {

  const grid = document.getElementById("linesGrid");
  const search = document.getElementById("searchInput").value.toLowerCase();

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

  const relationId =
    line.activeDirection === "A"
      ? line.relationIdA
      : line.relationIdB;

  const hasMap = !!relationId;

  const content = document.getElementById("contentArea");

  const buttonClass = hasMap
    ? "map-toggle-buttons two-buttons"
    : "map-toggle-buttons one-button";

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

      <div class="${buttonClass}">
        <button class="switch-btn"
          onclick="switchDirection('${line.type}', '${line.number}')">
          Смяна на посоката
        </button>

        ${hasMap ? `
          <button class="map-btn"
            onclick="toggleMap(${relationId}, '${line.color}')">
            Покажи картата
          </button>
        ` : ""}
      </div>
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

    <div id="map" class="map-card"></div>
  `;
}

function toggleMap(relationId, color) {

  const mapContainer = document.getElementById("map");

  if (mapContainer.classList.contains("active")) {
    mapContainer.classList.remove("active");

    if (currentMap) {
      currentMap.remove();
      currentMap = null;
    }

    return;
  }

  mapContainer.classList.add("active");

  if (currentMap) {
    currentMap.remove();
    currentMap = null;
  }

  currentMap = L.map("map");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(currentMap);

  fetch(`https://overpass-api.de/api/interpreter?data=
[out:json];
relation(${relationId});
way(r);
out geom;
`)
    .then(r => r.json())
    .then(data => {

      const coords = [];

      const seen = new Set();

      data.elements
        .filter(el => el.type === "way" && el.geometry)
        .forEach(way => {

          way.geometry.forEach(p => {
            const key = p.lat + "," + p.lon;

            if (!seen.has(key)) {
              seen.add(key);
              coords.push([p.lat, p.lon]);
            }
          });

        });

      if (!coords.length) return;

      const polyline = L.polyline(coords, {
        color: color,
        weight: 4,
        smoothFactor: 1.3
      }).addTo(currentMap);

      currentMap.fitBounds(polyline.getBounds(), {
        padding: [20, 20]
      });

    })
    .catch(err => console.error("Map error:", err));
}

function switchDirection(type, number) {

  const line = lines.find(l =>
    l.type === type && l.number === number
  );

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

document.getElementById("searchInput")
  .addEventListener("input", renderLines);

renderLines();
