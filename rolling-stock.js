
/* =========================
ROLLING STOCK DATA
========================= */

const rollingStock = [
  {
    type: "bus",
    manufacturer: "MAN",
    model: "Lion's City A21",
    year: 2018,
    quantity: 60,
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/MAN_Lion%27s_City_bus.jpg",
    lines: ["72", "76", "204", "305"]
  },

  {
    type: "bus",
    manufacturer: "Mercedes-Benz",
    model: "Citaro O530",
    year: 2012,
    quantity: 85,
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Mercedes-Benz_Citaro_C2.jpg",
    lines: ["84", "213", "305", "604"]
  },

  {
    type: "tram",
    manufacturer: "PESA",
    model: "122NaSF",
    year: 2014,
    quantity: 20,
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/PESA_122NaSF_Sofia.jpg",
    lines: ["5", "7", "20", "22"]
  },

  {
    type: "trolley",
    manufacturer: "Skoda",
    model: "26Tr Solaris",
    year: 2010,
    quantity: 40,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Skoda_26Tr_Solaris.jpg",
    lines: ["1", "2", "5", "9"]
  },

  {
    type: "metro",
    manufacturer: "Siemens",
    model: "Inspiro",
    year: 2018,
    quantity: 48,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sofia_Metro_train_Siemens_Inspiro.jpg",
    lines: ["M1", "M2", "M4"]
  }
];

/* =========================
RENDER FUNCTION
========================= */

function renderStock() {

  const grid = document.getElementById("stockGrid");

  if (!grid) {
    console.error("stockGrid not found in HTML");
    return;
  }

  grid.innerHTML = "";

  const groups = {
    bus: "Автобуси",
    trolley: "Тролеи",
    tram: "Трамваи",
    metro: "Метро"
  };

  Object.keys(groups).forEach(type => {

    const items = rollingStock.filter(s => s.type === type);

    if (items.length === 0) return;

    // SECTION TITLE
    const title = document.createElement("h2");
    title.textContent = groups[type];
    title.style.margin = "20px 0 10px";
    title.style.fontSize = "20px";

    grid.appendChild(title);

    // ITEMS
    items.forEach(item => {

      const card = document.createElement("div");
      card.className = "stock-card";

      card.innerHTML = `
        <img class="stock-image" src="${item.image}" alt="${item.model}" />

        <div class="stock-body">

          <h3>${item.manufacturer} ${item.model}</h3>

          <p><strong>Година:</strong> ${item.year}</p>
          <p><strong>Количество:</strong> ${item.quantity}</p>

          <div class="stock-lines">
            ${item.lines.map(lineNumber => {

              const lineData =
                (typeof lines !== "undefined")
                  ? lines.find(l => l.number === lineNumber)
                  : null;

              // fallback (no crash)
              if (!lineData) {
                return `<div class="stock-pill">${lineNumber}</div>`;
              }

              const isMetro = lineData.type === "metro";

              return `
                <div
                  class="${isMetro ? 'metro-pill' : 'line-pill stock-small'}"
                  style="background:${lineData.color}; color:${lineData.textColor || 'white'}"
                >
                  ${lineNumber}
                </div>
              `;
            }).join("")}
          </div>

        </div>
      `;

      grid.appendChild(card);
    });

  });
}

/* =========================
INIT
========================= */

document.addEventListener("DOMContentLoaded", renderStock);
