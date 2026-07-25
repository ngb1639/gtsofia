let lines = [];


async function loadRoutes() {

  try {

    const response = await fetch(
      "https://trinmo.org/gtfs-data/static/routes"
    );


    const json = await response.json();


    lines = json.data.map(route => {


      let type;


      switch(route.route_type) {

        case "0":
          type = "tram";
          break;

        case "1":
          type = "metro";
          break;

        case "3":
          type = "bus";
          break;

        case "11":
          type = "trolley";
          break;

        default:
          type = "bus";

      }


      return {

        type: type,

        number: route.route_short_name,

        color:
          route.route_color
          ? "#" + route.route_color
          : "#111827",


        textColor:
          route.route_text_color
          ? "#" + route.route_text_color
          : "#FFFFFF",


        routeId: route.route_id,


        activeDirection: "A",

        directionA: "",

        directionB: "",


        stopsA: [],

        stopsB: []

      };


    });


    console.log(
      "GTFS линии заредени:",
      lines.length
    );


    renderLines();


  }

  catch(error) {

    console.error(
      "Грешка при зареждане на GTFS routes:",
      error
    );

  }

}


loadRoutes();
