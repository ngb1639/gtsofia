console.log("schedule.js е зареден");

fetch("schedules/index.json")
.then(response => response.json())
.then(data => {
    console.log("Линии:", data);
});


const scheduleLines = document.getElementById("scheduleLines");
const scheduleContent = document.getElementById("scheduleContent");


// Зареждаме списъка с линии
fetch("schedules/index.json")

.then(response => response.json())

.then(lines => {


    lines.forEach(line => {


        const button = document.createElement("button");


        button.className = "line-pill";


        button.textContent = line;


        button.onclick = function(){

            loadSchedule(line);

        };


        scheduleLines.appendChild(button);


    });


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





// Зареждане на конкретно разписание
function loadSchedule(line){


    fetch(`schedules/${line}.json`)

    .then(response => response.json())

    .then(data => {



        let html = `


        <div class="line-header">


            <span class="line-number">

                ${line}

            </span>


        </div>


        `;



        data.forEach(direction => {



            html += `


            <div class="schedule-card">


                <h2>

                    Линия ${line}

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



    })


    .catch(error => {


        console.error(
            "Грешка при зареждане на разписанието:",
            error
        );


        scheduleContent.innerHTML = `


        <div class="empty-state">


            Няма намерено разписание за линия ${line}


        </div>


        `;


    });


}
