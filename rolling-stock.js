
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
    lines: ["M1", "M2", "M3", "M4"]
  }
];

/* =========================
COLOR SYSTEM (YOUR RULES)
========================= */

const lineColors = {

  // transport categories (fallback if needed)
  bus: { color: "#be1e2d", text: "white" },
  tourist: { color: "#006838", text: "white" },
  trolley: { color: "#2AA9E0", text: "white" },
  tram: { color: "#F6921E", text: "white" },
  night: { color: "#000000", text: "white" },

  // metro lines
  M1: { color: "#ec2029", text: "white" },
  M2: { color: "#1077bc", text: "white" },
  M3: { color: "#3bb44b", text: "white" },
  M4: { color: "#fcd403", text: "black" }

};

/* =========================
RENDER FUNCTION
========================= */

function renderStock() {

  const grid = document.getElementById("stockGrid");

  if (!grid) {
    console.error("stockGrid not found");
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

    const items = rollingStock.filter(v => v.type === type);

    if (items.length === 0) return;

    // SECTION TITLE
    const title = document.createElement("h2");
    title.textContent = groups[type];
    title.style.margin = "24px 0 12px";
    title.style.fontSize = "20px";

    grid.appendChild(title);

    // CARDS
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
            ${item.lines.map(line => {

              const isMetro = line.startsWith("M");

              const meta = lineColors[line] || {
                color: "#111827",
                text: "white"
              };

              return `
                <div
                  class="stock-line-pill ${isMetro ? 'stock-metro-pill' : ''}"
                  style="background:${meta.color}; color:${meta.text}"
                >
                  ${line}
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
