let routeMap = null;
let routePolyline = null;


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



  // Картата се създава само веднъж
  if (routeMap) {

    setTimeout(() => {

      routeMap.invalidateSize();

    }, 200);


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
    direction
  );




  if (!relationID) {


    container.innerHTML =
      '<div class="empty-state">No map available</div>';


    return;

  }




  if (!initRouteMap()) {


    container.innerHTML =
      '<div class="empty-state">No map available</div>';


    return;

  }




  try {


    /*
    =========================
    WAIT FOR MAP SIZE
    =========================
    */


    await new Promise(resolve => {

      setTimeout(resolve, 300);

    });


    routeMap.invalidateSize();





    /*
    =========================
    LOAD OSM RELATION
    =========================
    */


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





    const data =
      await response.json();





    console.log(
      "Loaded elements:",
      data.elements.length
    );





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
    REMOVE OLD ROUTE
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



      // Само OSM ways
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

      }, 300);





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


    // Не унищожаваме Leaflet картата
    if (routeMap) {

      routeMap.invalidateSize();

    }

  }

}
