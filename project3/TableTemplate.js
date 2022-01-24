'use strict'; 
class TableTemplate{
  static fillIn(id,dic,columnName){
    const table = document.getElementById(id);
    const tbody = table.tBodies[0];
    const header = tbody.rows[0];
    const template = new Cs142TemplateProcessor(header.innerHTML);
    header.innerHTML = template.fillIn(dic);

    let col = -1;
    const headercells = header.cells;
    for (let i = 0; i <headercells.length; i++){
      const td = headercells[i];
      if (td.innerHTML === columnName){
        col=i;
      }
    }

    for (let i = 1; i< tbody.rows.length; i++){
      const row = tbody.rows[i];
      if (columnName === undefined){
        for (let j = 0; j < row.cells.length; j++){
          const cell = row.cells[j];
          const template1 = new Cs142TemplateProcessor(cell.innerHTML);
          cell.innerHTML = template1.fillIn(dic);
        }
      }
      if (col!== -1){
        const cell = row.cells[col];
        const template1 = new Cs142TemplateProcessor(cell.innerHTML);
        cell.innerHTML = template1.fillIn(dic);
      }
    }

    if (table.style.visibility === 'hidden') {
      table.style.visibility = 'visible';
    }
  }
}