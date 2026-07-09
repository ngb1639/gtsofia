let currentFilter = null;

function renderLines() {

  const grid = document.getElementById("linesGrid");
  const search = document.getElementById("searchInput").value.toLowerCase();

  grid.innerHTML = "";

  lines.filter(l =>
    (!currentFilter || l.type === currentFilter) &&
    l.number.toLowerCase().includes(search)
  ).forEach(line => {

    if (line.type === "metro") {

      const el = document.createElement("div");
      el.className = "metro-pill";
      el.style.background = line.color;
      el.style.color = line.textColor;
      el.innerText = line.number;
      el.onclick = () => selectLine(line);
      grid.appendChild(el);

    } else {

      const el = document.createElement("div");
      el.className = "line-pill";
      el.style.background = line.color;
      el.innerText = line.number;
      el.onclick = () => selectLine(line);
      grid.appendChild(el);

    }

  });

}


function selectLine(line) {

    if (typeof destroyRouteMap === "function") {

    destroyRouteMap();

  }

  const direction = line.activeDirection === "A"
    ? line.directionA
    : line.directionB;

  const stops = line.activeDirection === "A"
    ? line.stopsA
    : line.stopsB;


  const content = document.getElementById("contentArea");


  const pill = line.type === "metro"

    ? `
      <div class="details-pill">

        <div class="details-icon">
          <img src="${line.icon}" />
        </div>

        <div class="metro-pill"
          style="background:${line.color}; color:${line.textColor};">
          ${line.number}
        </div>

      </div>
      `

    : `
      <div class="details-pill">

        <div class="details-icon">
          <img src="${line.icon}" />
        </div>

        <div class="details-number"
          style="background:${line.color}">
          ${line.number}
        </div>

      </div>
      `;


  content.innerHTML = `

    <div class="line-header">

      <div class="line-left">

        <div class="route-direction">

          ${pill}

          <img class="direction-arrow"
          src="https://raw.githubusercontent.com/ngb1639/gtsofia/03b985e9342c60d21a83135f675ba3446480d31c/Icons/destinationarrow.svg"/>


          <div class="destination-name">
            ${direction}
          </div>


        </div>

      </div>


      <button class="switch-btn"
        onclick="switchDirection('${line.type}', '${line.number}')">

        Промяна на посоката

      </button>


    </div>


    <!-- ALERTS -->

    <div id="lineAlerts"></div>


    <!-- STOPS -->

    <div class="stops-card">

      <div class="stops-line">

        ${stops.map(s => `

          <div class="stop-item">

            <div class="stop-dot"></div>

            <div class="stop-name">
              ${s}
            </div>

          </div>

        `).join("")}


      </div>

    </div>


    <!-- MAP -->

    <div class="stops-card" style="margin-top:20px;">

      <h2 style="margin-bottom:15px;">
        Карта
      </h2>


      <div id="routeMap">

      </div>


    </div>


  `;



  // Load alerts

  if (typeof showLineAlerts === "function") {

    showLineAlerts(
      line.number,
      line.type
    );

  }



  // Load map

  if (typeof loadRouteMap === "function") {

    loadRouteMap(
      line,
      line.activeDirection
    );

  }


}



function switchDirection(type, number) {


  const line = lines.find(
    l =>
      l.type === type &&
      l.number === number
  );


  if (!line) return;


  line.activeDirection =
    line.activeDirection === "A"
      ? "B"
      : "A";


  selectLine(line);

}



function setFilter(type, el) {


  currentFilter = type;


  document.querySelectorAll(".filter-btn")
    .forEach(b =>
      b.classList.remove("active")
    );


  if (el)
    el.classList.add("active");


  renderLines();

}



document.getElementById("searchInput")
  .addEventListener(
    "input",
    renderLines
  );


renderLines();
