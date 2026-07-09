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
DESTROY MAP
=========================
*/
function destroyRouteMap() {


  if (routePolyline) {

    routePolyline = null;

  }


  if (routeMap) {

    routeMap.remove();

    routeMap = null;

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



  try {


    container.innerHTML = "";



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
        response.status
      );

    }




    const data =
      await response.json();




    if (
      !data.elements ||
      data.elements.length === 0
    ) {

      throw new Error(
        "No route data"
      );

    }





    routePolyline =
      L.layerGroup();



    const bounds =
      L.latLngBounds();





    data.elements.forEach(
      el => {


        if (
          el.type !== "way" ||
          !el.geometry
        ) {

          return;

        }




        const coords =
          el.geometry.map(
            p =>
            {

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





        if (
          coords.length > 1
        ) {


          L.polyline(
            coords,
            {

              color:
                getTransportColor(
                  line
                ),


              weight:5,


              opacity:1,


              smoothFactor:1

            }

          ).addTo(
            routePolyline
          );


        }


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
      200
    );





  } catch(error) {


    console.error(
      "Route error:",
      error
    );


  }

}
