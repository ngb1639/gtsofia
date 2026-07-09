let map;
let polyline;


function transportColor(type) {

  const colors = {
    bus: "#BD202E",
    trolley: "#2AA9E0",
    tram: "#F7941F",
    metro: "#111827",
    night: "#000000"
  };

  return colors[type] || "#111827";
}



function showRouteMap(line) {

  const container = document.getElementById("routeMap");

  if (!container) return;


  container.innerHTML = "";


  if (!line.route) {

    container.innerHTML =
      `
      <div class="empty-state">
        Няма налична карта
      </div>
      `;

    return;

  }


  if (map) {
    map.remove();
  }


  map = L.map("routeMap");


  L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
      "&copy; OpenStreetMap contributors"
    }
  ).addTo(map);



  polyline =
    L.polyline(
      line.route,
      {
        color: transportColor(line.type),
        weight: 6
      }
    )
    .addTo(map);



  map.fitBounds(
    polyline.getBounds()
  );

}
