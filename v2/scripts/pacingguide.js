"use strict";
//-----------------------------------------------------------------------------------
// pacing guide class
//-----------------------------------------------------------------------------------
// TODO:
//-----------------------------------------------------------------------------------
class PacingGuide {
  constructor (pacingguideData) {
    this._pacingguideData = pacingguideData;
  }    
	
	//-----------------------------------------------------------------------------
	// rendering
	//-----------------------------------------------------------------------------  
  render (attachTo, displayTitle) {
    var guide = CreateElement.createDiv(null, 'guide-container');
    attachTo.appendChild(guide);

    if (displayTitle) {
      var title = this._pacingguideData.coursename;
      title += '<br>' + this._pacingguideData.numberofweeks + ' week pacing guide';
      guide.appendChild(CreateElement.createDiv(null, 'guide-label', title));
    }
    
    var table = CreateElement.createTable('pacingGuide', 'table table-hover table-condensed');
    guide.appendChild(table);

    var headers = ['week', 'unit', 'task', 'complete?'];
    if (this._pacingguideData.ap) headers[3] = 'due';

    var thead = CreateElement._createElement('thead', null, null);
    table.appendChild(thead);    
    var row = CreateElement.createTableRow(null, null, thead);
    for (var i = 0; i < headers.length; i++) {
      CreateElement.createTableCell(null, null, headers[i], true, row);
    }
    
    var tbody = CreateElement._createElement('tbody', null, null);
    table.appendChild(tbody);
    for (var i = 0; i < this._pacingguideData.pacingguide.length; i++) {
      var rowData = this._pacingguideData.pacingguide[i];
      var rowClassList = 'guide-week guide-oddweek';
      if (rowData.week % 2 == 0) rowClassList = 'guide-week guide-evenweek';
      
      var taskClassList = null;
      if (!rowData.graded) taskClassList = 'guide-notgraded';
      if (rowData.progresscheck) taskClassList += ' guide-progresscheck';
      
      row = CreateElement.createTableRow(null, rowClassList, tbody);
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
          CreateElement.createTableCell(null, null, DateTime.formatDateShortWithWeekday(rowData.duedate), false, row);
        } else {
          CreateElement.createTableCell(null, null, '', false, row);
        }
      }
    }
  }

  renderWeek (attachTo, weekNumber, displayTitle, displayWeekNumber) {
    var guide = CreateElement.createDiv(null, 'guide-container');
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
    
    var table = CreateElement.createTable('pacingGuide', 'table table-hover table-condensed');
    guide.appendChild(table);

    var headers = ['unit', 'task'];
    if (this._pacingguideData.ap) headers = headers.concat(['due']);
  
    var thead = CreateElement._createElement('thead', null, null);
    table.appendChild(thead);
    var row = CreateElement.createTableRow(null, null, thead);
    for (var i = 0; i < headers.length; i++) {
      CreateElement.createTableCell(null, null, headers[i], true, row);
    }
    
    var tbody = CreateElement._createElement('tbody', null, null);
    table.appendChild(tbody);
    for (var i = 0; i < this._pacingguideData.pacingguide.length; i++) {
      var rowData = this._pacingguideData.pacingguide[i];
      
      if (rowData.week == weekNumber) {
        row = CreateElement.createTableRow(null, null, tbody);
        if (rowData.unit.indexOf('[colspan]') == 0) {
          if (!taskClassList) taskClassList = 'guide-week-long';
          else taskClassList += ' guide-week-long';
          
          var truncMessage = rowData.unit.slice('[colspan]'.length);
          var cell = CreateElement.createTableCell(null, taskClassList, null, false, row);
          cell.appendChild(CreateElement.createDiv(null, null, truncMessage));
          cell.colSpan = 3;
          
        } else {        
          var taskClassList = 'guide-week';
          if (!rowData.graded) taskClassList += ' guide-notgraded';
          if (rowData.progresscheck) taskClassList += ' guide-progresscheck';
          
          CreateElement.createTableCell(null, null, rowData.unit, false, row);      
          var cell = CreateElement.createTableCell(null, taskClassList, null, false, row);
          cell.appendChild(CreateElement.createDiv(null, null, rowData.task));
          if (this._pacingguideData.ap) CreateElement.createTableCell(null, null, DateTime.formatDateShortWithWeekday(rowData.duedate), false, row);
        }
      }
    }
  }

	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    

}
