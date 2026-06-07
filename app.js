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

  // Check cache first
  if (mapCache[relationId]) {
    initializeMapAndRender(mapContainer, mapCache[relationId], color);
    return;
  }

  // Fetch data for the first time
  fetchMapData(relationId, color, mapContainer);
}

function initializeMapAndRender(mapContainer, cachedData, color) {
  // Clear any previous content
  mapContainer.innerHTML = '';

  // Initialize map with a default center (Sofia, Bulgaria)
  currentMap = L.map(mapContainer, {
    center: [42.6977, 23.3219],
    zoom: 12
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(currentMap);

  // Use cached data
  renderPolyline(cachedData, color);
}

function fetchMapData(relationId, color, mapContainer) {
  // Clear container and initialize map
  mapContainer.innerHTML = '';

  currentMap = L.map(mapContainer, {
    center: [42.6977, 23.3219],
    zoom: 12
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(currentMap);

  // Create loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'map-loading';
  loadingOverlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; border-radius: 18px;';
  loadingOverlay.innerHTML = '<div style="color: #9ca3af; font-size: 14px;">Зареждане на картата...</div>';
  mapContainer.appendChild(loadingOverlay);

  const query = `[out:json];
relation(${relationId});
(._;>;);
out body geom;`;

  console.log("Fetching relation", relationId, "with full geometry query");

  fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    })
    .then(data => {
      console.log("Overpass response for relation", relationId, "elements:", data.elements.length);

      const coords = [];

      if (!data.elements || data.elements.length === 0) {
        console.warn("No elements found for relation", relationId);
        const loading = document.getElementById('map-loading');
        if (loading) loading.remove();
        currentMap.setView([42.6977, 23.3219], 12);
        return;
      }

      // Extract coordinates from all ways with their full geometry in order
      data.elements.forEach((element, index) => {
        if (element.type === "way" && element.geometry && Array.isArray(element.geometry)) {
          console.log(`Processing way ${element.id} with ${element.geometry.length} points`);
          
          element.geometry.forEach(p => {
            if (p.lat && p.lon) {
              coords.push([p.lat, p.lon]);
            }
          });
        }
      });

      console.log("Total coordinates extracted:", coords.length);
      console.log("First 5 coordinates:", coords.slice(0, 5));
      console.log("Last 5 coordinates:", coords.slice(-5));

      if (!coords.length) {
        console.warn("No valid coordinates found for relation", relationId);
        const loading = document.getElementById('map-loading');
        if (loading) loading.remove();
        currentMap.setView([42.6977, 23.3219], 12);
        return;
      }

      // Cache the coordinates
      mapCache[relationId] = { coords, color };

      // Remove loading overlay
      const loading = document.getElementById('map-loading');
      if (loading) loading.remove();

      renderPolyline({ coords, color }, color);

    })
    .catch(err => {
      console.error("Map error:", err);
      const loading = document.getElementById('map-loading');
      if (loading) {
        loading.innerHTML = '<div style="color: #ef4444; font-size: 14px;">Грешка при зареждане на картата</div>';
      }
    });
}

function renderPolyline(data, color) {
  const { coords } = data;

  console.log("Rendering polyline with", coords.length, "coordinates");

  if (!coords || coords.length === 0) {
    console.warn("No coordinates to render");
    return;
  }

  const polyline = L.polyline(coords, {
    color: color,
    weight: 6,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(currentMap);

  console.log("Polyline added to map");

  const bounds = polyline.getBounds();

  if (bounds && bounds.isValid()) {
    console.log("Fitting map to bounds");
    currentMap.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 16
    });
  } else {
    console.warn("Invalid bounds, setting default view");
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
