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
      container.innerHTML = "";
      
      routeMap = L.map("routeMap", {
        center: [42.6977, 23.3219],
        zoom: 13,
        zoomControl: true
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

  const relationID = direction === "A" ? line.relationA : line.relationB;

  if (!relationID) {
    container.innerHTML = '<div class="empty-state">No map available</div>';
    return;
  }

  if (!initRouteMap()) {
    container.innerHTML = '<div class="empty-state">Failed to initialize map</div>';
    return;
  }

  if (routePolyline) {
    routeMap.removeLayer(routePolyline);
    routePolyline = null;
  }

  try {
    const query = `[out:json];relation(${relationID});(._;>;);out geom;`;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    if (response.status === 429) {
      throw new Error("Too many requests. Please wait and try again.");
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      throw new Error("No route data found");
    }

    let points = [];

    data.elements.forEach(el => {
      if (el.geometry && Array.isArray(el.geometry)) {
        el.geometry.forEach(p => {
          if (p.lat && p.lon) {
            points.push([p.lat, p.lon]);
          }
        });
      }
    });

    if (!points.length) {
      throw new Error("No valid points");
    }

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
    }

  } catch(error) {
    console.error("Error loading route:", error);
    container.innerHTML = `<div class="empty-state">No map available</div>`;
  }
}
