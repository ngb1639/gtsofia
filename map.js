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

  if (routeMap) {
    routeMap.remove();
    routeMap = null;
  }

  try {
    container.innerHTML = "";
    
    routeMap = L.map("routeMap", {
      center: [42.6977, 23.3219],
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
    container.innerHTML = '<div class="empty-state">No map available</div>';
    return;
  }

  try {
    const query = `[out:json];relation(${relationID});out geom;`;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      throw new Error("No route data found");
    }

    let longestWay = null;
    let maxPoints = 0;

    data.elements.forEach(el => {
      if (el.type === "relation" && el.members) {
        el.members.forEach(member => {
          if (member.geometry && member.geometry.length > maxPoints) {
            maxPoints = member.geometry.length;
            longestWay = member.geometry;
          }
        });
      }
    });

    if (!longestWay) {
      throw new Error("No valid points");
    }

    let points = longestWay.map(p => [p.lat, p.lon]);

    if (routePolyline) {
      routeMap.removeLayer(routePolyline);
      routePolyline = null;
    }

    routePolyline = L.polyline(points, {
      color: getTransportColor(line.type),
      weight: 5,
      opacity: 1
    }).addTo(routeMap);

    routeMap.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });

  } catch(error) {
    console.error("Error loading route:", error);
    container.innerHTML = '<div class="empty-state">No map available</div>';
  }
}
