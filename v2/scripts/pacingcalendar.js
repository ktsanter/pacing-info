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
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'Pacing calendar (' + this._term + ')'));
      
      var startMsg1 = DateTime.formatDateShortWithWeekday(termData.ap.startdate);
      var endMsg1 = DateTime.formatDateShortWithWeekday(termData.ap.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
            
      headers = ['', msg1];
      
      var cells = [];
      for (var i = 0; i < termData.ap.weeks.length - 1; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDateShortWithWeekday(weekDate), 
          termData.ap.weeks[i].weekname
        ]);
      }
      
    } else if (this._term == 'summer') {
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'Pacing calendar (' + this._term + ')'));
      
      var startMsg1 = DateTime.formatDateShortWithWeekday(termData.start1.startdate);
      var endMsg1 = DateTime.formatDateShortWithWeekday(termData.start1.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
            
      headers = ['', msg1];
      
      var cells = [];
      for (var i = 0; i < termData.start1.weeks.length - 1; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDateShortWithWeekday(weekDate), 
          termData.start1.weeks[i].weekname
        ]);
      }
      
    } else {
      container.appendChild(CreateElement.createDiv(null, 'calendar-label', 'Pacing calendar (' + this._term + ')'));
      
      var startMsg1 = DateTime.formatDateShortWithWeekday(termData.start1.startdate);
      var endMsg1 = DateTime.formatDateShortWithWeekday(termData.start1.enddate);
      var msg1 = startMsg1 + '<br>' + endMsg1;
      
      var startMsg2 = DateTime.formatDateShortWithWeekday(termData.start2.startdate);
      var endMsg2 =  DateTime.formatDateShortWithWeekday(termData.start2.enddate);
      var msg2 = startMsg2 + '<br>' + endMsg2;
      
      headers = ['', msg1, msg2];
      
      var cells = [];
      for (var i = 0; i < termData.start1.weeks.length; i++) {
        var weekDate = termData.start1.weeks[i].weekdate;
        if (DateTime.isNowInWeek(weekDate)) highlightWeek = i;

        cells.push([ 
          DateTime.formatDateShortWithWeekday(weekDate), 
          termData.start1.weeks[i].weekname,
          termData.start2.weeks[i].weekname
        ]);
      }
    }

    var table = CreateElement.createTable('pacingCalendar', 'table table-hover table-condensed', headers, cells);
    container.appendChild(table);
    if (this._highlightweek && highlightWeek != null) {
      console.log('highlightWeek= ' + highlightWeek);
      var trNode = table.getElementsByTagName('tbody')[0].childNodes[highlightWeek];
      trNode.classList.add('highlightweek');
    }

    return container;
  }
}
