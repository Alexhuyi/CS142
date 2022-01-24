'use strict'; 
function DatePicker(id,callback) {
  this.id = id;
  this.callback = callback;
}

DatePicker.prototype.render = function(date){
  var elem = document.getElementById(this.id);
  var table = document.createElement('table');
  elem.appendChild(table); 

  var header = table.createTHead();
  var headerrow =  header.insertRow(0);
  // < month year >
  var left = headerrow.insertCell(0);
  left.innerHTML = "<";
  left.setAttribute("id","previous");

  var monthcell = headerrow.insertCell(1);
  var months = ["January", "February","March", "April","May", "June", "July", "August", "September",
        "October","November","December"];
  monthcell.innerHTML =  months[date.getMonth()]+"  "+date.getFullYear();
  monthcell.colSpan = 5;
  monthcell.setAttribute("id","month");

  var right = headerrow.insertCell(2);
  right.innerHTML = ">";
  right.setAttribute("id","next");
  
  var getcal = () => {
    // add 7 days Sun ... Sat
    const days = ["Sun", "Mon","Tues","Wed","Thur","Fri","Sat"];
    const week = header.insertRow(1);
    for (let i = 0; i < 7; i++) {
      const cell = week.insertCell(i);
      cell.innerHTML = days[i];
      cell.setAttribute("id","week");
    }
    
    const firstDay = new Date(date.getTime());
    firstDay.setDate(1);
    const lastDay = new Date(date.getTime());
    lastDay.setMonth(date.getMonth()+1);
    lastDay.setDate(0);
    
    const currDate = new Date(firstDay.getTime());
    currDate.setDate(-firstDay.getDay()+1);

    this.numWeeks = Math.ceil((firstDay.getDay() + lastDay.getDate())/7);
    let cnt = 1;

    while(cnt <= this.numWeeks) {
      const row = table.insertRow(-1);

      for(let i = 0; i < 7; i++){
        var cell = row.insertCell(i);
        cell.innerHTML = currDate.getDate();
        if (currDate.getMonth() === date.getMonth()){
          cell.setAttribute("id","normal");
          const obj={};
          obj.month = currDate.getMonth()+1;
          obj.day =  currDate.getDate();
          obj.year= currDate.getFullYear();
          cell.onclick = () => {this.callback(this.id,obj);};
        }
        else{
          cell.setAttribute("id","dim");
        }
        currDate.setDate(currDate.getDate()+1);
      }
      cnt += 1;
    }
  };

 left.onclick = () => {
    date.setMonth(date.getMonth() - 1);
    table.remove();
    this.render(date);
  };

  right.onclick = () => {
    date.setMonth(date.getMonth() + 1);
    table.remove();
    this.render(date);
  };

  getcal();
};