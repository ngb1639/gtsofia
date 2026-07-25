let schedules = {};



fetch("schedule.json")

.then(response => response.json())

.then(data => {

    schedules = data;

    loadLines();

});




function loadLines(){

    const select = document.getElementById(
        "lineSelect"
    );


    select.innerHTML = "";


    Object.keys(schedules)
    .sort()
    .forEach(line=>{


        let option=document.createElement(
            "option"
        );


        option.value=line;
        option.textContent="Линия "+line;


        select.appendChild(option);


    });



    showSchedule(
        select.value
    );


}



document
.getElementById("lineSelect")
.addEventListener(
"change",
function(){

    showSchedule(this.value);

});





function showSchedule(line){


let container=document.getElementById(
"scheduleResult"
);


container.innerHTML="";


let directions=schedules[line];



directions.forEach(direction=>{


let card=document.createElement(
"div"
);


card.className="info-card";



card.innerHTML=`

<h2>
Линия ${line}
</h2>


<h3>
${direction.direction}
</h3>


<hr>


${direction.stops.map(stop=>`

<p>
<b>${stop.time}</b>
-
${stop.stop}
</p>

`).join("")}


`;



container.appendChild(card);



});


}
