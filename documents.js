const documents = [
  {
    name: "Еднократен билет",
    description: "Билет за еднократно пътуване във всички линии на градския транспорт.",
    price: "1.60 лв"
  },
  {
    name: "Билет 30+",
    description: "Еднократен билет с 30 минути валидност от първото валидиране.",
    price: "1.60 лв"
  },
  {
    name: "Дневна карта",
    description: "Неограничени пътувания в рамките на един календарен ден.",
    price: "4.00 лв"
  },
  {
    name: "Месечна карта",
    description: "Абонаментна карта за неограничени пътувания за 30 дни.",
    price: "50.00 лв"
  },
  {
    name: "Годишна карта",
    description: "Годишен абонамент за всички линии на градския транспорт.",
    price: "365.00 лв"
  }
];

function renderDocuments() {
  const container = document.getElementById("documentsContainer");
  if (!container) return;

  container.innerHTML = documents.map(doc => `
    <div class="info-card" style="margin-bottom: 12px;">

      <h2 style="margin-bottom: 8px;">
        ${doc.name}
      </h2>

      <p style="margin-bottom: 10px; color:#374151;">
        ${doc.description}
      </p>

      <div style="font-weight:700; font-size:16px;">
        Цена: ${doc.price}
      </div>

    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderDocuments);
