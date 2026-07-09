let routeMap = null;
let routePolyline = null;

const routeCache = {};


/*
=========================
TRANSPORT COLORS
=========================
*/
function getTransportColor(line) {

  if (line.color) {
    return line.color;
  }


  switch(line.type) {

    case "bus":
      return "#BD202E";

    case "trolley":
      return "#2AA9E0";

    case "tram":
      return "#F7941F";

    case "night":
      return "#000000";

    case "tourist":
      return "#006838";

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

  const container =
    document.getElementById("routeMap");


  if (!container) {
    return false;
  }



  // Ако картата вече съществува,
  // просто я преоразмеряваме
  if (routeMap) {

    setTimeout(() => {
      routeMap.invalidateSize();
    }, 100);

    return true;
  }



  try {


    container.innerHTML = "";



    routeMap = L.map(
      "routeMap",
      {
        center: [
          42.6977,
          23.3219
        ],

        zoom: 13
      }
    );



    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; OpenStreetMap contributors',

        maxZoom: 19
      }

    ).addTo(routeMap);



    return true;



  } catch(error) {


    console.error(
      "Error initializing map:",
      error
    );


    return false;
  }
}





/*
=========================
LOAD ROUTE
=========================
*/
async function loadRouteMap(
  line,
  direction
) {


  const container =
    document.getElementById("routeMap");


  if (!container) {
    return;
  }



  const relationID =
    direction === "A"
      ? line.relationA
      : line.relationB;



  console.log(
    "Loading relation:",
    relationID,
    "direction:",
    direction
  );



  if (!relationID) {

    container.innerHTML =
      '<div class="empty-state">Няма налична карта</div>';

    return;
  }




  if (!initRouteMap()) {

    container.innerHTML =
      '<div class="empty-state">Няма налична карта</div>';

    return;
  }




  try {


    let data;



    /*
    =========================
    CHECK CACHE
    =========================
    */


    if (routeCache[relationID]) {


      data =
        routeCache[relationID];


    } else {


      const query = `
        [out:json];

        relation(${relationID});

        >;

        out geom;
      `;



      const response =
        await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",
            body: query
          }
        );



      if (!response.ok) {


        throw new Error(
          `Overpass error: ${response.status}`
        );

      }



      data =
        await response.json();



      routeCache[relationID] =
        data;

    }





    if (
      !data.elements ||
      data.elements.length === 0
    ) {

      throw new Error(
        "No route data found"
      );

    }





    /*
    =========================
    REMOVE OLD POLYLINE
    =========================
    */


    if (routePolyline) {

      routeMap.removeLayer(
        routePolyline
      );

      routePolyline = null;

    }





    /*
    =========================
    DRAW ROUTE
    =========================
    */


    routePolyline =
      L.layerGroup();



    let bounds =
      L.latLngBounds();




    data.elements.forEach(el => {



      if (
        el.type !== "way" ||
        !el.geometry
      ) {

        return;

      }




      if (
        el.geometry.length < 2
      ) {

        return;

      }




      const coords =
        el.geometry.map(
          p => {


            const point =
              [
                p.lat,
                p.lon
              ];


            bounds.extend(
              point
            );


            return point;

          }
        );





      L.polyline(
        coords,
        {

          color:
            getTransportColor(line),


          weight: 5,


          opacity: 1,


          smoothFactor: 1

        }

      ).addTo(
        routePolyline
      );



    });






    if (
      bounds.isValid()
    ) {


      routePolyline.addTo(
        routeMap
      );



      routeMap.fitBounds(
        bounds,
        {
          padding:
            [
              50,
              50
            ]
        }
      );



      setTimeout(() => {

        routeMap.invalidateSize();

      }, 200);




    } else {


      throw new Error(
        "No valid geometry"
      );

    }




  } catch(error) {


    console.error(
      "Error loading route:",
      error
    );


    container.innerHTML =
      '<div class="empty-state">Няма налична карта</div>';

  }

}
