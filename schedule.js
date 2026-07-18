let schedules = [];

let currentLine = null;



async function loadSchedules(){

const response = await fetch("schedule.json");

schedules = await response.json();


renderLines();

}



function renderLines(){

const select =
document.getElementById("lineSelect");


select.innerHTML = "";


schedules.forEach(line=>{


const option=document.createElement("option");

option.value=line.line;

option.textContent =
(line.type==="bus" ? "Автобус " : "")
+ line.line;


select.appendChild(option);


});


currentLine=schedules[0];


renderDirections();

}




function renderDirections(){


const directionSelect =
document.getElementById("directionSelect");


directionSelect.innerHTML="";


currentLine.directions.forEach((d,index)=>{


const option=document.createElement("option");

option.value=index;

option.textContent=d.name;


directionSelect.appendChild(option);


});


renderStops();


}




function renderStops(){


const stopSelect =
document.getElementById("stopSelect");


stopSelect.innerHTML="";


const direction =
currentLine.directions[
document.getElementById("directionSelect").value || 0
];



direction.stops.forEach((stop,index)=>{


const option=document.createElement("option");

option.value=index;

option.textContent=stop.name;


stopSelect.appendChild(option);


});


renderTimes();

}




function renderTimes(){


const direction =
currentLine.directions[
document.getElementById("directionSelect").value || 0
];



const stop =
direction.stops[
document.getElementById("stopSelect").value || 0
];



const container =
document.getElementById("timesContainer");



container.innerHTML = stop.times.map(time=>{


return `

<div style="
background:#f3f4f6;
padding:12px;
border-radius:12px;
margin-bottom:8px;
font-size:18px;
font-weight:600;
">

${time}

</div>

`;


}).join("");

}




document
.getElementById("lineSelect")
.addEventListener("change",e=>{


currentLine =
schedules.find(
x=>x.line===e.target.value
);


renderDirections();


});



document
.getElementById("directionSelect")
.addEventListener("change",
renderStops);



document
.getElementById("stopSelect")
.addEventListener("change",
renderTimes);



loadSchedules();
