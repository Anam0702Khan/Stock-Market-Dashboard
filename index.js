'use strict';
function ShowModal (e, id){
    document.getElementById(id).classList.toggle("hide");
}

function DeleteRow(e, eid, mid){
    // Hide the row element and modal
    document.getElementById(eid).classList.add("hide");
    document.getElementById(mid).classList.add("hide");
    // So when we click button the onclick event of the row below that button is not triggered
    e.stopPropagation();
}
async function WatchList( TIME_SERIES ){
    var SYMBOL = document.getElementById('input').value;
    var url = `https://www.alphavantage.co/query?function=${TIME_SERIES}&symbol=${SYMBOL}&interval=5min&apikey=MLS8NJROVSL5PVZR`;
    var response = await fetch(url);
    var data = await response.json();
    var TimeSeries = Object.values(data)[1]
    // inner object.values return first row value in timeseries
    // outer object.values return fourth value that is the closing value of first row
    var closingValue = Math.floor(Object.values(Object.values(TimeSeries)[0])[3])
    console.log("data",data);
    //Empty the input field
    document.getElementById('input').value = "";
    if( data['Meta Data'] == null){
    return;
    }
    var addToWatchList = document.getElementById('addToWatchList');
    // Add Row in WatchList Card
    var element = document.createElement("div");
    element.classList.add("watch-row");
    element.classList.add("d-flex");
    // color class 
    var color;
    switch (TIME_SERIES) {
        case "TIME_SERIES_INTRADAY":
            color = "green";
            break;
        case "TIME_SERIES_MONTHLY":
            color = "red";
            break;
        case "TIME_SERIES_WEEKLY":
            color = "white";
            break;
    }
    // nowtime will be the id of modal
    var nowtime = Date.now().toString();
    // Add eventlistener for when we click on the row we show modal
    element.addEventListener('click', ($event)=> ShowModal($event,nowtime))
    element.id =  (Date.now()-1).toString();
    element.innerHTML = `
    <div class="text">${SYMBOL}</div>
    <div class=${color}>${closingValue}</div>
    <div class="time-series">${TIME_SERIES.split('_')[2]}</div>
    <button class="delete-btn"><i class="fa fa-times fa-lg"></i></button>
    `
    // Add eventlistener for when we click on the delete button we remove the row
    element.lastElementChild.addEventListener('click',($event) => DeleteRow($event,element.id,nowtime))
    addToWatchList.appendChild(element);

    //Add Modal for the row that we have added 
    var modal = document.createElement("div");
    modal.id = nowtime
    modal.classList.add("modal");
   /// modal.classList.add("card");
    modal.classList.add("hide");
    var rows = ""
    var time;
    var htime;
    // Map the data to the table rows for only 5 rows
    
    Object.keys(TimeSeries).forEach((el,i) => {
        if(i<5){
            console.log(el)
            console.log(Object.values(TimeSeries[el])[0])
            if(TIME_SERIES == "TIME_SERIES_INTRADAY") {
                time = el.split(" ")[1];
                htime = el.split(" ")[0];
            }
            else {
                time = el.split(" ")[0];
                htime = ""
            }
            var row = `
            <tr>
                <td>${time}</td>
                <td>${Object.values(TimeSeries[el])[0]}</td>
                <td>${Object.values(TimeSeries[el])[1]}</td>
                <td>${Object.values(TimeSeries[el])[2]}</td>
                <td>${Object.values(TimeSeries[el])[3]}</td>
                <td>${Object.values(TimeSeries[el])[4]}</td>
            </tr>    
            `  
            rows = rows + row
        }
    }); 
    modal.innerHTML = `
    <table>
        <thead>
            <tr>
                <th>${htime}</th>
                <th>OPEN</th>
                <th>HIGH</th>
                <th>LOW</th>
                <th>CLOSE</th>
                <th>VOLUME</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
    `
    addToWatchList.appendChild(modal);
}


