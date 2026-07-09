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
DESTROY MAP
=========================
*/
function destroyRouteMap() {


  if (routeMap) {

    routeMap.remove();

    routeMap = null;

  }


  routePolyline = null;

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



  try {


    routeMap =
      L.map(
        "routeMap",
        {
          center:
          [
            42.6977,
            23.3219
          ],

          zoom:13
        }
      );



    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {

        attribution:
          "&copy; OpenStreetMap contributors",

        maxZoom:19

      }

    ).addTo(
      routeMap
    );



    return true;


  } catch(error) {


    console.error(
      "Map init error:",
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
    document.getElementById(
      "routeMap"
    );



  if (!container) {
    return;
  }





  const relationID =
    direction === "A"
      ? line.relationA
      : line.relationB;





  if (!relationID) {
    return;
  }





  if (!initRouteMap()) {
    return;
  }





  try {


    const cacheKey =
      `${relationID}_${direction}`;



    let segments;



    /*
    =========================
    CHECK CACHE
    =========================
    */


    if (
      routeCache[cacheKey]
    ) {


      console.log(
        "Route from cache:",
        cacheKey
      );


      segments =
        routeCache[cacheKey];



    } else {



      console.log(
        "Loading route:",
        cacheKey
      );



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
            method:"POST",
            body:query
          }
        );




      if (!response.ok) {

        throw new Error(
          `Overpass ${response.status}`
        );

      }





      const data =
        await response.json();





      segments = [];





      data.elements.forEach(
        el => {


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





          segments.push(
            el.geometry.map(
              p =>
              [
                p.lat,
                p.lon
              ]
            )
          );



        }
      );





      routeCache[cacheKey] =
        segments;


    }





    /*
    =========================
    CREATE POLYLINE
    =========================
    */


    routePolyline =
      L.layerGroup();



    const bounds =
      L.latLngBounds();





    segments.forEach(
      coords => {


        coords.forEach(
          point => {

            bounds.extend(
              point
            );

          }
        );





        L.polyline(
          coords,
          {

            color:
              getTransportColor(
                line
              ),

            weight:5,

            opacity:1,

            smoothFactor:2

          }

        ).addTo(
          routePolyline
        );



      }
    );





    routePolyline.addTo(
      routeMap
    );





    setTimeout(
      () => {


        routeMap.invalidateSize(
          true
        );



        if (
          bounds.isValid()
        ) {


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

        }


      },
      100
    );





  } catch(error) {


    console.error(
      "Route loading error:",
      error
    );


  }

}
