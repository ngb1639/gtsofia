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

  if (!container) return;


  if (!routeMap) {

    routeMap = L.map("routeMap");

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
        '&copy; OpenStreetMap contributors'
      }
    ).addTo(routeMap);

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


  initRouteMap();


  if (routePolyline) {
    routeMap.removeLayer(routePolyline);
    routePolyline = null;
  }


  /*
  direction contains relation IDs
  */

  const relationID =
    direction === "A"
      ? line.relationA
      : line.relationB;


  if (!relationID) {

    container.innerHTML =
      `
      <div class="empty-state">
        No map available
      </div>
      `;

    return;

  }


  try {


    const query = `
    [out:json];
    relation(${relationID});
    (._;>;);
    out geom;
    `;


    const response =
      await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method:"POST",
          body: query
        }
      );


    const data =
      await response.json();


    let points = [];


    data.elements.forEach(el => {

      if (!el.geometry)
        return;


      el.geometry.forEach(p => {

        points.push([
          p.lat,
          p.lon
        ]);

      });

    });


    if (!points.length) {

      container.innerHTML =
      `
      <div class="empty-state">
        No map available
      </div>
      `;

      return;

    }



    routePolyline =
      L.polyline(
        points,
        {
          color:
          getTransportColor(line.type),

          weight: 6
        }
      )
      .addTo(routeMap);



    routeMap.fitBounds(
      routePolyline.getBounds()
    );


  }

  catch(error) {

    console.error(error);

    container.innerHTML =
    `
    <div class="empty-state">
      No map available
    </div>
    `;

  }

}
