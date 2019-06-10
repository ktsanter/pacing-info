"use strict";
//-----------------------------------------------------------------------------------
// pacing calendar class
//-----------------------------------------------------------------------------------
// TODO: 
//-----------------------------------------------------------------------------------
class PacingCalendar {
  constructor (calendarData, term, ap, highlightweek) {
    this._appversion = '0.01';
    
    this._calendarData = calendarData;
    this._term = term;
    this._ap = ap;
    this._highlightweek = highlightweek;
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
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'AP pacing calendar (' + this._term + ')'));
      
      var startMsg1 = 'start: ' + DateTime.formatDate(termData.ap.startdate);
      var endMsg1 = 'end: ' + DateTime.formatDate(termData.ap.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
            
      headers = ['date<br>(Sunday)', msg1];
      
      var cells = [];
      for (var i = 0; i < termData.ap.weeks.length - 1; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDate(weekDate), 
          termData.ap.weeks[i].weekname
        ]);
      }
      
    } else if (this._term == 'summer') {
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'Pacing calendar (' + this._term + ')'));
      
      var startMsg1 = 'start: ' + DateTime.formatDate(termData.start1.startdate);
      var endMsg1 = 'end: ' + DateTime.formatDate(termData.start1.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
            
      headers = ['date<br>(Sunday)', msg1];
      
      var cells = [];
      for (var i = 0; i < termData.start1.weeks.length - 1; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDate(weekDate), 
          termData.start1.weeks[i].weekname
        ]);
      }
      
    } else {
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'Pacing calendar (' + this._term + ')'));
      container.appendChild(CreateElement.createHR(null, null));
      
      var startMsg1 = 'start: ' + DateTime.formatDate(termData.start1.startdate);
      var endMsg1 = 'end: ' + DateTime.formatDate(termData.start1.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
      
      var startMsg2 = 'start: ' + DateTime.formatDate(termData.start2.startdate);
      var endMsg2 = 'end: ' + DateTime.formatDate(termData.start2.enddate);
      var msg2 = startMsg2 + '<br>' + endMsg2;
      
      headers = ['date<br>(Sunday)', msg1, msg2];
      
      var cells = [];
      for (var i = 0; i < termData.start1.weeks.length; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDate(weekDate), 
          termData.start1.weeks[i].weekname,
          termData.start2.weeks[i].weekname
        ]);
      }
    }

    var table = CreateElement.createTable('pacingCalendar', 'calendar-table', headers, cells);
    container.appendChild(table);
    if (this._highlightweek && highlightWeek != null) {
      var td = table.getElementsByTagName('td');
      td[highlightWeek].parentNode.classList.add('highlightweek');
    }

    return container;
  }
}
