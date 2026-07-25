const select = document.getElementById("lineSelect");
const area = document.getElementById("scheduleArea");


let lines = [];


// Зареждаме списъка с разписания

fetch("schedules/index.json")

.then(response => response.json())

.then(data => {

    lines = data;


    lines.forEach(line => {

        let option = document.createElement("option");

        option.value = line;

        option.textContent = line;


        select.appendChild(option);

    });

});



select.addEventListener("change", () => {


    let line = select.value;


    if(!line){
        return;
    }


    fetch(`schedules/${line}.json`)

    .then(response => response.json())

    .then(data => {


        area.innerHTML = `

        <div class="home-card">

        <h2>
        Линия ${line}
        </h2>

        <pre>
${JSON.stringify(data,null,2)}
        </pre>


        </div>

        `;


    });


});
