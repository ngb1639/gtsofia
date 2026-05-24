let currentFilter = null;

function renderLines() {
  const grid = document.getElementById("linesGrid");
  const search = document.getElementById("searchInput").value.toLowerCase();

  grid.innerHTML = "";

  lines
    .filter(l =>
      (!currentFilter || l.type === currentFilter) &&
      l.number.toLowerCase().includes(search)
    )
    .forEach(line => {

      const el = document.createElement("div");

      if (line.type === "metro") {
        el.className = "metro-pill";
        el.style.background = line.color;
        el.style.color = line.textColor || "white";
      } else {
        el.className = "line-pill";
        el.style.background = line.color;
      }

      el.innerText = line.number;
      el.onclick = () => selectLine(line);
      grid.appendChild(el);
    });
}

function selectLine(line) {
  const direction = line.activeDirection === "A"
    ? line.directionA
    : line.directionB;

  const stops = line.activeDirection === "A"
    ? line.stopsA
    : line.stopsB;

  const content = document.getElementById("contentArea");

  content.innerHTML = `
    <div class="line-header">
      <div class="route-direction">

        <div style="display:flex; gap:10px; align-items:center;">
          <img src="${line.icon}" width="24"/>

          <div style="background:${line.color}; color:white; padding:6px 10px; border-radius:6px;">
            ${line.number}
          </div>
        </div>

        <div class="destination-name">${direction}</div>
      </div>

      <button class="switch-btn" onclick="switchDirection('${line.number}')">
        Смяна на посоката
      </button>
    </div>

    <div class="stops-card">
      <div class="stops-line">
        ${stops.map(s => `
          <div class="stop-item">
            <div class="stop-dot"></div>
            <div class="stop-name">${s}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function switchDirection(number) {
  const line = lines.find(l => l.number === number);
  line.activeDirection = line.activeDirection === "A" ? "B" : "A";
  selectLine(line);
}

function setFilter(type, el) {
  currentFilter = type;

  document.querySelectorAll(".filter-btn")
    .forEach(b => b.classList.remove("active"));

  if (el) el.classList.add("active");

  renderLines();
}

document.getElementById("searchInput")
  .addEventListener("input", renderLines);

renderLines();
