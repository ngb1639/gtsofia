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
CLEAR ROUTE ONLY
=========================
*/

function clearRouteLayer() {

  if (
    routePolyline &&
    routeMap
  ) {

    routeMap.removeLayer(
      routePolyline
    );

    routePolyline = null;

  }

}



/*
=========================
INIT MAP
=========================
*/

function initRouteMap() {


  const container =
    document.getElementById(
      "routeMap"
    );


  if (!container) {
    return false;
  }



  // reuse existing map

  if (routeMap) {

    setTimeout(
      () => {

        routeMap.invalidateSize(
          true
        );

      },
      50
    );

    return true;

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

          zoom:13,

          preferCanvas:true

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



  // remove only old route

  clearRouteLayer();





  try {


    let data;




    /*
    =========================
    CHECK CACHE
    =========================
    */


    if (
      routeCache[relationID]
    ) {


      console.log(
        "Using cached route:",
        relationID
      );


      data =
        routeCache[relationID];



    } else {



      console.log(
        "Loading from Overpass:",
        relationID
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
          `Overpass error ${response.status}`
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
        "No route data"
      );

    }





    /*
    =========================
    CREATE SINGLE POLYLINE
    =========================
    */


    const allCoords = [];




    data.elements.forEach(
      el => {


        if (
          el.type !== "way" ||
          !el.geometry
        ) {

          return;

        }





        el.geometry.forEach(
          p => {


            allCoords.push(
              [
                p.lat,
                p.lon
              ]
            );


          }
        );


      }
    );





    if (
      allCoords.length < 2
    ) {

      throw new Error(
        "Not enough coordinates"
      );

    }






    /*
    =========================
    SIMPLIFY GEOMETRY
    =========================
    */


    const simplified =
      L.LineUtil.simplify(
        allCoords,
        0.00005
      );







    routePolyline =
      L.polyline(
        simplified,
        {

          color:
            getTransportColor(
              line
            ),

          weight:5,

          opacity:1,

          smoothFactor:1

        }
      );





    routePolyline.addTo(
      routeMap
    );






    /*
    =========================
    FIT MAP
    =========================
    */


    setTimeout(
      () => {


        routeMap.invalidateSize(
          true
        );



        const bounds =
          routePolyline.getBounds();




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
      50
    );







  } catch(error) {


    console.error(
      "Route loading error:",
      error
    );


  }

}
