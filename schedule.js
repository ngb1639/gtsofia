console.log("schedule.js е зареден");


const scheduleLines = document.getElementById("scheduleLines");
const scheduleContent = document.getElementById("scheduleContent");


const scheduleCache = {};

let availableSchedules = [];



// =========================
// LOAD AVAILABLE SCHEDULES
// =========================

fetch("schedules/index.json")

.then(response => response.json())

.then(data => {

    availableSchedules = data.map(String);

    renderScheduleLines();

})

.catch(error => {

    console.error(
        "Грешка при зареждане на списъка с линии:",
        error
    );


    scheduleLines.innerHTML = `

    <div class="empty-state">

        Не могат да се заредят линиите.

    </div>

    `;

});





// =========================
// RENDER LINE BUTTONS
// USING data.js
// =========================

function renderScheduleLines(){


    const scheduleData = lines.filter(line =>

        availableSchedules.includes(String(line.number))

    );



    scheduleData.forEach(line => {


        const button = document.createElement("button");


        button.className = "line-pill";


        button.textContent = line.number;


        button.style.background = line.color || "#111827";



        if(line.type === "metro"){


            button.className = "metro-pill";


            button.style.background = line.color;


            button.style.color =
                line.textColor || "white";

        }




        button.onclick = () => {

            loadSchedule(line);

        };



        scheduleLines.appendChild(button);


    });


}






// =========================
// LOAD SCHEDULE
// =========================

function loadSchedule(line){


    const number = String(line.number);



    if(scheduleCache[number]){


        renderSchedule(
            line,
            scheduleCache[number]
        );


        return;

    }




    fetch(`schedules/${number}.json`)

    .then(response => response.json())

    .then(data => {


        scheduleCache[number] = data;


        renderSchedule(
            line,
            data
        );


    })


    .catch(error => {


        console.error(
            "Грешка при зареждане на разписанието:",
            error
        );


        scheduleContent.innerHTML = `


        <div class="empty-state">

            Няма намерено разписание за линия ${number}

        </div>


        `;


    });


}






// =========================
// RENDER SCHEDULE
// =========================

function renderSchedule(line, data){



    // махане на дублиращи направления

    const uniqueDirections = data.filter(
        (item, index, self) =>

        index === self.findIndex(d =>

            d.direction === item.direction &&

            d.stops[0]?.stop === item.stops[0]?.stop

        )

    );





    let html = `



    <div class="line-header">


        <div class="details-pill">


            <div class="details-number"

            style="
            background:${line.color || "#111827"};
            ${line.type === "metro" ?
            `border-radius:50%; background:${line.color}; color:${line.textColor || "white"};`
            :
            ""}
            ">

                ${line.number}

            </div>


        </div>


    </div>



    `;





    uniqueDirections.forEach(direction => {



        html += `



        <div class="schedule-card">


            <h2>

                Линия ${line.number}

            </h2>


            <h3>

                ${direction.direction}

            </h3>



            <table>


                <thead>

                    <tr>

                        <th>
                            Час
                        </th>


                        <th>
                            Спирка
                        </th>


                    </tr>


                </thead>



                <tbody>



                ${direction.stops.map(stop => `


                    <tr>


                        <td>

                            ${stop.time}

                        </td>


                        <td>

                            ${stop.stop}

                        </td>


                    </tr>


                `).join("")}



                </tbody>



            </table>



        </div>



        `;


    });





    scheduleContent.innerHTML = html;


}
