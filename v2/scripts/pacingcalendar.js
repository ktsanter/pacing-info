"use strict";
//-----------------------------------------------------------------------------------
// pacing calendar class
//-----------------------------------------------------------------------------------
// TODO: 
//-----------------------------------------------------------------------------------
class PacingCalendar {
  constructor (calendarData, term, ap, highlightweek, linkcallback) {
    this._appversion = '0.02';
    
    this._calendarData = calendarData;
    this._term = term;
    this._ap = ap;
    this._highlightweek = highlightweek;
    this._linkcallback = linkcallback;
  }
	
	//-----------------------------------------------------------------------------
	// rendering
	//-----------------------------------------------------------------------------  
  render() {
    var container = CreateElement.createDiv(null, 'calendar-container');
    var termData = this._calendarData[this._term];    
    
    var headers;
    var cells;
    var highlightWeek = null;
    
    if (this._ap) {
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'Pacing calendar'));
      
      var startMsg1 = DateTime.formatDateShortWithWeekday(termData.ap.startdate);
      var endMsg1 = DateTime.formatDateShortWithWeekday(termData.ap.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
            
      headers = ['', msg1];
      
      var cells = [];
      var cellhandlers = [];
      var handler = function (me) { return function(e) {me._handleSelection(e);}} (this);
      for (var i = 0; i < termData.ap.weeks.length - 1; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDateShortWithWeekday(weekDate), 
          '<span>' + termData.ap.weeks[i].weekname + '</span>'
        ]);
        cellhandlers.push([
          null, 
          termData.ap.weeks[i].weekname != '-' ? handler : null
        ]);
      }
      
    } else if (this._term == 'summer') {
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'Pacing calendar'));
      
      var startMsg1 = DateTime.formatDateShortWithWeekday(termData.start1.startdate);
      var endMsg1 = DateTime.formatDateShortWithWeekday(termData.start1.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
            
      headers = ['', msg1];
      
      var cells = [];
      var cellhandlers = [];
      var handler = function (me) { return function(e) {me._handleSelection(e);}} (this);
      for (var i = 0; i < termData.start1.weeks.length - 1; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDateShortWithWeekday(weekDate), 
          '</span>' + termData.start1.weeks[i].weekname + '</span>'
        ]);
        cellhandlers.push([
          null, 
          termData.start1.weeks[i].weekname != '-' ? handler : null
        ]);
      }
      
    } else {
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'Pacing calendar'));
      
      var startMsg1 = DateTime.formatDateShortWithWeekday(termData.start1.startdate);
      var endMsg1 = DateTime.formatDateShortWithWeekday(termData.start1.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
      
      var startMsg2 = DateTime.formatDateShortWithWeekday(termData.start2.startdate);
      var endMsg2 =  DateTime.formatDateShortWithWeekday(termData.start2.enddate);
      var msg2 = startMsg2 + '<br>' + endMsg2;
      
      headers = ['', msg1, msg2];
      
      var cells = [];
      var cellhandlers = [];
      var handler = function (me) { return function(e) {me._handleSelection(e);}} (this);
      for (var i = 0; i < termData.start1.weeks.length; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDateShortWithWeekday(weekDate), 
          '<span>' + termData.start1.weeks[i].weekname + '</span>',
          '<span>' + termData.start2.weeks[i].weekname + '</span>'
        ]);
        cellhandlers.push([
          null, 
          termData.start1.weeks[i].weekname != '-' ? handler : null, 
          termData.start2.weeks[i].weekname != '-' ? handler : null
        ]);
      }
    }

    var table = CreateElement.createTable('pacingCalendar', 'table table-hover table-condensed', headers, cells, cellhandlers);
    container.appendChild(table);
    if (this._highlightweek && highlightWeek != null) {
      var trNode = table.getElementsByTagName('tbody')[0].childNodes[highlightWeek];
      trNode.classList.add('highlightweek');
    }

    return container;
  }
  
  _handleSelection(e) {
    this._linkcallback(e.target.innerHTML);
  } 
}
