let routeMap = null;
let routePolyline = null;

/*
=========================
TRANSPORT COLORS
=========================
*/
function getTransportColor(type) {
  switch(type) {
    case "bus":
      return "#BD202E";
    case "trolley":
      return "#2AA9E0";
    case "tram":
      return "#F7941F";
    case "metro":
      return "#111827";
    case "night":
      return "#000000";
    default:
      return "#111827";
  }
}

/*
=========================
INIT MAP
=========================
*/
function initRouteMap() {
  const container = document.getElementById("routeMap");
  
  if (!container) return false;

  if (!routeMap) {
    try {
      // Очисти контейнера преди инициализация
      container.innerHTML = "";
      
      routeMap = L.map("routeMap", {
        center: [42.6977, 23.3219], // Sofia coordinates as default
        zoom: 13
      });

      L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }
      ).addTo(routeMap);
      
      return true;
    } catch(error) {
      console.error("Error initializing map:", error);
      return false;
    }
  }
  
  return true;
}

/*
=========================
LOAD ROUTE
=========================
*/
async function loadRouteMap(line, direction) {
  const container = document.getElementById("routeMap");
  
  if (!container) return;

  container.innerHTML = '<div class="empty-state">Loading map...</div>';

  if (!initRouteMap()) {
    container.innerHTML = '<div class="empty-state">Failed to initialize map</div>';
    return;
  }

  if (routePolyline) {
    routeMap.removeLayer(routePolyline);
    routePolyline = null;
  }

  const relationID = direction === "A" ? line.relationA : line.relationB;

  if (!relationID) {
    container.innerHTML = '<div class="empty-state">No map available</div>';
    return;
  }

  try {
    const query = `
    [out:json];
    relation(${relationID});
    (._;>;);
    out geom;
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query,
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      throw new Error("No elements returned from API");
    }

    let points = [];

    data.elements.forEach(el => {
      if (!el.geometry) return;

      el.geometry.forEach(p => {
        if (p.lat && p.lon) {
          points.push([p.lat, p.lon]);
        }
      });
    });

    if (!points.length) {
      throw new Error("No valid points found");
    }

    container.innerHTML = "";

    routePolyline = L.polyline(points, {
      color: getTransportColor(line.type),
      weight: 6,
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(routeMap);

    const bounds = routePolyline.getBounds();
    if (bounds.isValid()) {
      routeMap.fitBounds(bounds, { padding: [50, 50] });
    } else {
      throw new Error("Invalid bounds");
    }

  } catch(error) {
    console.error("Error loading route:", error);
    container.innerHTML = `
    <div class="empty-state">
      No map available<br>
      <small>${error.message || 'Please try again'}</small>
    </div>
    `;
  }
}
