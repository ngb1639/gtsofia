let scheduleLines = [];

let currentSchedule = [];
let currentDirection = 0;



// Зареждаме списъка с линии

fetch("schedules/index.json")
.then(response => response.json())
.then(data => {

    scheduleLines = data;

    renderLines();

});




// Показване на линиите

function renderLines(){


    const container = document.getElementById("scheduleLines");

    container.innerHTML = "";


    scheduleLines.forEach(line => {


        let pill = document.createElement("div");


        pill.className = "line-pill";


        pill.innerText = line;



        pill.onclick = () => {

            loadSchedule(line);

        };


        container.appendChild(pill);


    });


}





// Зареждане на разписание

function loadSchedule(line){


    fetch(`schedules/${line}.json`)
    .then(response => response.json())
    .then(data => {


        currentSchedule = data;

        currentDirection = 0;


        showSchedule(line);


    });


}






// Визуализация

function showSchedule(line){


    const content = document.getElementById("scheduleContent");


    content.innerHTML = "";



    let header = document.createElement("div");


    header.className = "line-header";



    let directions = "";



    if(currentSchedule.length > 1){


        directions = `

        <div class="promo-actions">

        ${currentSchedule.map((item,index)=>`

            <button 
            class="promo-btn ${index===currentDirection ? '' : 'secondary'}"
            onclick="changeDirection(${index}, '${line}')">

            ${item.direction}

            </button>


        `).join("")}

        </div>


        `;


    }





    header.innerHTML = `


    <div class="line-left">


        <div class="line-pill">

            ${line}

        </div>


        <div>


            <h2>
                Линия ${line}
            </h2>


            <p>
                ${currentSchedule[currentDirection].direction}
            </p>


        </div>


    </div>



    ${directions}


    `;



    content.appendChild(header);






    let card = document.createElement("div");


    card.className = "stops-card";



    card.innerHTML = `


    <div class="stops-line">


    ${currentSchedule[currentDirection].stops.map(stop=>`


        <div class="stop-item">


            <div class="stop-dot"></div>


            <div>


                <strong>
                    ${formatTime(stop.time)}
                </strong>


                <br>


                ${stop.stop}


            </div>


        </div>



    `).join("")}



    </div>



    `;



    content.appendChild(card);



}





// Смяна на посока

function changeDirection(index,line){


    currentDirection = index;


    showSchedule(line);


}





// Премахване на секундите

function formatTime(time){


    if(!time) return "";


    return time.substring(0,5);


}
