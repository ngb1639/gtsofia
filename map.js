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
BUILD ORDERED ROUTE
=========================
*/
function buildOrderedRoute(ways) {
  if (!ways || ways.length === 0) return [];
  
  let allSegments = ways.map(way => ({
    points: way.geometry,
    used: false
  }));

  let route = [];
  let currentSegment = allSegments[0];
  currentSegment.used = true;
  route.push(...currentSegment.points);

  while (true) {
    let found = false;
    let lastPoint = route[route.length - 1];

    for (let segment of allSegments) {
      if (segment.used) continue;

      let firstPoint = segment.points[0];
      let lastSegmentPoint = segment.points[segment.points.length - 1];

      let distToFirst = Math.hypot(
        lastPoint.lat - firstPoint.lat,
        lastPoint.lon - firstPoint.lon
      );

      let distToLast = Math.hypot(
        lastPoint.lat - lastSegmentPoint.lat,
        lastPoint.lon - lastSegmentPoint.lon
      );

      if (distToFirst < distToLast) {
        segment.used = true;
        route.push(...segment.points);
        found = true;
        break;
      } else if (distToLast < 0.01) {
        segment.used = true;
        route.push(...segment.points.reverse());
        found = true;
        break;
      }
    }

    if (!found) break;
  }

  return route.map(p => [p.lat, p.lon]);
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

  try {
    const query = `[out:json];relation(${relationID});(._;>;);out geom;`;

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

    let ways = data.elements.filter(el => el.type === "way" && el.geometry);

    if (!ways.length) {
      throw new Error("No valid ways");
    }

    let points = buildOrderedRoute(ways);

    if (!points.length) {
      throw new Error("No valid points");
    }

    if (routePolyline) {
      routeMap.removeLayer(routePolyline);
      routePolyline = null;
    }

    routePolyline = L.polyline(points, {
      color: getTransportColor(line.type),
      weight: 5,
      opacity: 0.7
    }).addTo(routeMap);

    routeMap.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });

  } catch(error) {
    console.error("Error loading route:", error);
    container.innerHTML = '<div class="empty-state">No map available</div>';
  }
}
