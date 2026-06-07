let currentFilter = null;
let currentMap = null;
let mapCache = {}; // Cache for map data

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

  // Initialize map with a default center (Sofia, Bulgaria)
  currentMap = L.map("map", {
    center: [42.6977, 23.3219],
    zoom: 12
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(currentMap);

  // Check cache first
  if (mapCache[relationId]) {
    renderPolyline(mapCache[relationId], color);
    return;
  }

  // Show loading indicator
  mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af;">Зареждане на картата...</div>';
  mapContainer.classList.add("active");

  fetchMapData(relationId, color);
}

function fetchMapData(relationId, color) {
  const query = `[out:json];
(
  relation(${relationId});
  way(r:"route");
);
out geom;`;

  fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    })
    .then(data => {

      const coords = [];
      const seen = new Set();

      if (!data.elements || data.elements.length === 0) {
        console.warn("No elements found for relation", relationId);
        currentMap.setView([42.6977, 23.3219], 12);
        return;
      }

      data.elements
        .filter(el => el.type === "way" && el.geometry && Array.isArray(el.geometry))
        .forEach(way => {

          way.geometry.forEach(p => {
            if (p.lat && p.lon) {
              const key = p.lat + "," + p.lon;

              if (!seen.has(key)) {
                seen.add(key);
                coords.push([p.lat, p.lon]);
              }
            }
          });

        });

      if (!coords.length) {
        console.warn("No valid coordinates found for relation", relationId);
        currentMap.setView([42.6977, 23.3219], 12);
        return;
      }

      // Cache the coordinates
      mapCache[relationId] = { coords, color };

      renderPolyline({ coords, color }, color);

    })
    .catch(err => {
      console.error("Map error:", err);
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ef4444;">Грешка при зареждане на картата</div>';
      }
    });
}

function renderPolyline(data, color) {
  const { coords } = data;

  if (!coords || coords.length === 0) {
    console.warn("No coordinates to render");
    return;
  }

  // Clear the loading message and render the map
  const mapContainer = document.getElementById("map");
  if (mapContainer) {
    mapContainer.innerHTML = '';
  }

  // Re-initialize the map if needed
  if (!currentMap) {
    currentMap = L.map("map", {
      center: [42.6977, 23.3219],
      zoom: 12
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(currentMap);
  }

  const polyline = L.polyline(coords, {
    color: color,
    weight: 5,
    opacity: 0.8,
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(currentMap);

  const bounds = polyline.getBounds();

  if (bounds.isValid()) {
    currentMap.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 16
    });
  } else {
    currentMap.setView([42.6977, 23.3219], 12);
  }
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
