"use strict";
//-----------------------------------------------------------------------------------
// pacing guide class
//-----------------------------------------------------------------------------------
// TODO: styling
//-----------------------------------------------------------------------------------

class PacingGuide {
  constructor (pacingguideData) {
    this._pacingguideData = pacingguideData;
  }    
	
	//-----------------------------------------------------------------------------
	// rendering
	//-----------------------------------------------------------------------------  
  render (attachTo, displayTitle) {
    var guide = CreateElement.createDiv(null, null);
    attachTo.appendChild(guide);

    if (displayTitle) {
      var title = this._pacingguideData.coursename;
      title += '<br>' + this._pacingguideData.numberofweeks + ' week pacing guide';
      guide.appendChild(CreateElement.createDiv(null, 'guide-label', title));
    }
    
    var table = CreateElement.createTable('pacingGuide', 'guide-table');
    guide.appendChild(table);

    var headers = ['week', 'unit/module', 'lesson/assignment', 'complete?<br>yes/no'];
    if (this._pacingguideData.ap) headers[3] = 'due date<br>(11:59pm)';
  
    var row = CreateElement.createTableRow(null, null, table);
    for (var i = 0; i < headers.length; i++) {
      CreateElement.createTableCell(null, null, headers[i], true, row);
    }
    
    for (var i = 0; i < this._pacingguideData.pacingguide.length; i++) {
      var rowData = this._pacingguideData.pacingguide[i];
      var rowClassList = 'guide-week guide-oddweek';
      if (rowData.week % 2 == 0) rowClassList = 'guide-week guide-evenweek';
      
      var taskClassList = null;
      if (rowData.graded) taskClassList = 'guide-graded';
      if (rowData.progresscheck) taskClassList += ' guide-progresscheck';
      
      row = CreateElement.createTableRow(null, rowClassList, table);
      if (rowData.unit.indexOf('[colspan]') == 0) {
        var truncMessage = rowData.unit.slice('[colspan]'.length);
        if (!taskClassList) taskClassList = 'guide-week-long';
        else taskClassList += ' guide-week-long';
        var cell = CreateElement.createTableCell(null, taskClassList, null, false, row);
        cell.appendChild(CreateElement.createDiv(null, null, truncMessage));
        cell.colSpan = 4;
        
      } else {
        CreateElement.createTableCell(null, null, rowData.week, false, row);      
        CreateElement.createTableCell(null, null, rowData.unit, false, row);      
        
        var cell = CreateElement.createTableCell(null, taskClassList, null, false, row);
        cell.appendChild(CreateElement.createDiv(null, null, rowData.task));
        
        if (this._pacingguideData.ap) {
          CreateElement.createTableCell(null, null, DateTime.formatDate(rowData.duedate).slice(0, -3), false, row);
        } else {
          CreateElement.createTableCell(null, null, '', false, row);
        }
      }
    }
  }

  renderWeek (attachTo, weekNumber, displayTitle, displayWeekNumber) {
    var guide = CreateElement.createDiv(null, null);
    attachTo.appendChild(guide);

    var title = '';
    if (displayTitle) {
      title += this._pacingguideData.coursename;
      title += '<br>' + this._pacingguideData.numberofweeks + ' week pacing guide';
    } 
    if (displayTitle && displayWeekNumber) title += '<br>';
    if (displayWeekNumber) {
      title += 'Week ' + weekNumber;
    }
    if (title != '') guide.appendChild(CreateElement.createDiv(null, 'guide-label', title));
    
    var table = CreateElement.createTable('pacingGuide', 'guide-table');
    guide.appendChild(table);

    var headers = ['unit/module', 'lesson/assignment'];
    if (this._pacingguideData.ap) headers = headers.concat(['due date<br>(11:59pm)']);
  
    var row = CreateElement.createTableRow(null, null, table);
    for (var i = 0; i < headers.length; i++) {
      CreateElement.createTableCell(null, null, headers[i], true, row);
    }
    
    for (var i = 0; i < this._pacingguideData.pacingguide.length; i++) {
      var rowData = this._pacingguideData.pacingguide[i];
      
      if (rowData.week == weekNumber) {
        row = CreateElement.createTableRow(null, null, table);
        if (rowData.unit.indexOf('[colspan]') == 0) {
          var truncMessage = rowData.unit.slice('[colspan]'.length);
          if (!taskClassList) taskClassList = 'guide-week-long';
          else taskClassList += ' guide-week-long';
          var cell = CreateElement.createTableCell(null, taskClassList, null, false, row);
          cell.appendChild(CreateElement.createDiv(null, null, truncMessage));
          cell.colSpan = 3;
          
        } else {        
          var taskClassList = 'guide-week';
          if (rowData.graded) taskClassList += ' guide-graded';
          if (rowData.progresscheck) taskClassList += ' guide-progresscheck';
          
          CreateElement.createTableCell(null, null, rowData.unit, false, row);      
          var cell = CreateElement.createTableCell(null, taskClassList, null, false, row);
          cell.appendChild(CreateElement.createDiv(null, null, rowData.task));
          if (this._pacingguideData.ap) CreateElement.createTableCell(null, null, DateTime.formatDate(rowData.duedate).slice(0, -3), false, row);
        }
      }
    }
  }

	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    

}
