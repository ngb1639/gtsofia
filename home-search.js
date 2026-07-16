document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("homeLineSearch");
  const results = document.getElementById("homeLineResults");

  if (!input || !results) return;


  input.addEventListener("input", () => {

    const value = input.value.trim().toLowerCase();

    results.innerHTML = "";

    if (!value) return;


    const matches = lines.filter(line =>
      line.number.toLowerCase().includes(value)
    );


    matches.slice(0, 10).forEach(line => {

      const item = document.createElement("div");

      item.style.padding = "10px 14px";
      item.style.cursor = "pointer";
      item.style.fontWeight = "600";


      item.innerHTML = `
        ${line.number}
        <span style="
          color:#6b7280;
          font-size:13px;
          margin-left:8px;
        ">
          ${getTypeName(line.type)}
        </span>
      `;


      item.onclick = () => {

        window.location.href =
          `transport.html?line=${encodeURIComponent(line.type)}:${encodeURIComponent(line.number)}`;

      };


      item.onmouseenter = () => {
        item.style.background = "#f3f4f6";
      };

      item.onmouseleave = () => {
        item.style.background = "white";
      };


      results.appendChild(item);

    });

  });


  document.addEventListener("click", e => {

    if (!input.contains(e.target) &&
        !results.contains(e.target)) {

      results.innerHTML = "";

    }

  });

});


function getTypeName(type) {

  const names = {
    bus: "Автобус",
    trolley: "Тролейбус",
    tram: "Трамвай",
    metro: "Метро",
    night: "Нощна линия"
  };

  return names[type] || "";

}
