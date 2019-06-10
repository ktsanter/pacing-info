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
		
    var expectedQueryParams = [];
    
		if (_initializeSettings(expectedQueryParams)) {
      settings.calendardata = await _loadPacingCalendarData();
      _renderPage();
		}
  }
  
  async function _loadPacingCalendarData() {
    var result = null;
    
    page.notice.setNotice('loading...', true);
    var requestParams = {};
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
  
  function _renderPage() {
    page.body.appendChild(_renderControls());
    
    page.calendarcontainer = CreateElement.createDiv('calendar', null);
    page.body.appendChild(page.calendarcontainer);
    _refreshCalendar();
  }
  
  function _renderControls() {
    var container = CreateElement.createDiv(null, 'standard-section');

    var terms = ['semester1', 'semester2', 'trimester1', 'trimester2', 'trimester3', 'summer'];
    for (var i = 0; i < terms.length; i++) {
      container.appendChild(CreateElement.createRadio(null, null, 'termRadio', terms[i], terms[i], i == 0, _handleRadio));
    }

    container.appendChild(CreateElement.createBR());
    container.appendChild(CreateElement.createCheckbox('apCheckbox', null, '', 'ap', 'AP', false, _handleCheckbox));
    
    container.appendChild(CreateElement.createBR());
    container.appendChild(CreateElement.createCheckbox('highlightCheckbox', null, '', 'highlightWeek', 'highlight current week', true, _handleCheckbox));

    return container;
  }
  
  function _refreshCalendar() {
    settings.term = null
    var termbuttons = document.getElementsByName('termRadio');
    for (var i = 0; i < termbuttons.length; i++) {
      if (termbuttons[i].checked) settings.term = termbuttons[i].value;
    }
    
    settings.ap = document.getElementById('apCheckbox').checked;
    settings.highlightweek = document.getElementById('highlightCheckbox').checked;
    
    if (page.pacingcalendar) {
      page.pacingcalendar.parentNode.removeChild(page.pacingcalendar);
      page.pacingcalendar = null;
    }
    
    var validCombo = true;
    if (settings.ap && settings.term != 'semester1' && settings.term != 'semester2') validCombo = false;

    if (validCombo) {
      page.pacingcalendar = _renderCalendar();
      page.calendarcontainer.appendChild(page.pacingcalendar);
    } else {
      page.notice.setNotice('invalid settings');
    }
  }
  
  function _renderCalendar() {
    settings.pacingcalendar = new PacingCalendar(settings.calendardata, settings.term, settings.ap, settings.highlightweek);
    
    return settings.pacingcalendar.render();
  }

	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  function _handleRadio(e) {
    _refreshCalendar();
  }

  function _handleCheckbox(e) {
    _refreshCalendar();
  }
  
	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
