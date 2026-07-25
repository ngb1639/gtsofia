let scheduleLines = document.getElementById("scheduleLines");
let scheduleContent = document.getElementById("scheduleContent");



fetch("schedules/index.json")
.then(response => response.json())
.then(lines => {


    lines.forEach(line => {


        let button = document.createElement("button");

        button.className = "line-pill";

        button.innerText = line;


        button.onclick = () => {

            loadSchedule(line);

        };


        scheduleLines.appendChild(button);


    });


})
.catch(error => {

console.error("Грешка при зареждане на линиите:", error);

});





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


<h3>
${direction.direction}
</h3>


<table>

<tr>

<th>
Час
</th>

<th>
Спирка
</th>

</tr>


`;


direction.stops.forEach(stop=>{


html += `

<tr>

<td>
${stop.time}
</td>

<td>
${stop.stop}
</td>

</tr>

`;


});


html += `

</table>


</div>

`;


});


scheduleContent.innerHTML = html;


})


.catch(error=>{


console.error(error);


scheduleContent.innerHTML =

`
<div class="empty-state">

Няма намерено разписание за линия ${line}

</div>
`;

});


}
