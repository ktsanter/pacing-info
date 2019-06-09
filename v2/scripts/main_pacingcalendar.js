"use strict";
//-----------------------------------------------------------------------------------
// test driver for pacing calendar
//-----------------------------------------------------------------------------------
// TODO: 
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
  const appname = 'pacing calendar (test driver)';
	const page = {};
  const settings = {};
  
  const apiInfo = {
    apibase: 'https://script.google.com/macros/s/AKfycbzp-DIszFmZMUasJwHnzwcQ9VE3NmI2QmbUvawRMq8fnDfuBCQ/exec',
    apikey: 'MVpacinginfov2'
  };
  
	//---------------------------------------
	// get things going
	//----------------------------------------
  async function init() {
		page.body = document.getElementsByTagName('body')[0];

    _renderStandardElements();
		
    var expectedQueryParams = [
      {key: 'term', required: true}, 
      {key: 'ap', required: false},
      {key: 'highlightweek', required: false}
    ];
    
		if (_initializeSettings(expectedQueryParams)) {
      console.log('|' + settings.ap + '|');
      settings.ap = (settings.ap != null) ? 'true' : 'false';
      if (settings.highlightweek) settings.highlightweek = new Date(settings.highlightweek);

      var data = await _loadPacingCalendarData();
      if (data) {
        page.body.appendChild(_renderPage(data));
      }
		}
  }
  
  async function _loadPacingCalendarData() {
    var result = null;
    
    page.notice.setNotice('loading...', true);
    var requestParams = {term: settings.term, ap: settings.ap};
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'pacingcalendar', requestParams, page.notice);

    if (requestResult.success) {
      page.notice.setNotice('');
      var result = requestResult.data;
    } 
    
    if (!result) {
      page.notice.setNotice('load failed');
    }
    
    return result;
  }
  
	//-------------------------------------------------------------------------------------
	// process query params
	//-------------------------------------------------------------------------------------
	function _initializeSettings(expectedParams) {
    var result = false;

    var urlParams = new URLSearchParams(window.location.search);
    for (var i = 0; i < expectedParams.length; i++) {
      var key = expectedParams[i].key;
      settings[key] = urlParams.has(key) ? urlParams.get(key) : null;
    }

    var receivedRequiredParams = true;
    for (var i = 0; i < expectedParams.length && receivedRequiredParams; i++) {
      var key = expectedParams[i].key;
      if (expectedParams[i].required) receivedRequiredParams = (settings[key] != null);
    }
    
    if (receivedRequiredParams) {
			result = true;

    } else {   
      page.notice.setNotice('failed to initialize: invalid parameters');
    }
    
    return result;
  }
	
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  function _renderStandardElements() {
    var title = CreateElement.createDiv(null, 'standard-title', appname);
    page.body.appendChild(title);
    
    page.notice = new StandardNotice(page.body, title);
  }

  function _renderPage(calendarData) {
    var container = CreateElement.createDiv(null, null);
    var termData = getTermCalendarData(settings.term, calendarData);
    console.log(JSON.stringify(termData));
    
    var headers;
    var cells;
    if (settings.ap == 'true') {
      container.innerHTML = 'show AP dates';
    } else {
      container.innerHTML = 'show regular dates';
      var startMsg1 = 'Start: ' + termData['1'].startdate;
      var endMsg1 = 'End: ' + termData['1'].enddate;
      var startMsg2 = 'Start: ' + termData['2'].startdate;
      var endMsg2 = 'End: ' + termData['2'].enddate;
      headers = ['Date (Monday)', startMsg1 + endMsg1, startMsg2 + endMsg2];
      var cells = [];
    }

    container.appendChild(CreateElement.createTable(null, null, headers, cells));
    /// is formatDate in a library
    
    return container;
  }
       
	//------------------------------------------------------------------
	// data processing
	//------------------------------------------------------------------    
  function getTermCalendarData(term, calendarData) {
    var termData = {};
    for (var i = 0; i < calendarData.length; i++) {
      if (calendarData[i].term.toLowerCase() == term) {
        termData[calendarData[i].starttype] = calendarData[i];
      }
    }
    
    return termData;
  }
  
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  
	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
