let scheduleLines = [];



fetch("schedules/index.json")
.then(r => r.json())
.then(data => {

    scheduleLines = data;

    renderLines();

});



function renderLines(){

const container =
document.getElementById("scheduleLines");


container.innerHTML="";


scheduleLines.forEach(line=>{


let pill=document.createElement("div");


pill.className="line-pill";

pill.innerText=line;


pill.onclick=()=>loadSchedule(line);



container.appendChild(pill);



});


}



function loadSchedule(line){


fetch(`schedules/${line}.json`)
.then(r=>r.json())
.then(data=>{


let content =
document.getElementById("scheduleContent");


content.innerHTML="";



let card=document.createElement("div");

card.className="stops-card";



card.innerHTML=`

<h2>
Линия ${line}
</h2>

<br>

<h3>
${data[0].direction}
</h3>


<br>

<div class="stops-line">


${data[0].stops.map(stop=>`

<div class="stop-item">

<div class="stop-dot"></div>


<div>

<b>${stop.time}</b>
<br>

${stop.stop}

</div>


</div>


`).join("")}



</div>

`;



content.appendChild(card);



});


}
