"use strict";
//-----------------------------------------------------------------------------------
// test driver for pacing info
//-----------------------------------------------------------------------------------
// TODO: determine base URL for full pacing guide
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
  const appname = 'pacing info';
	const page = {};
  const settings = {};
  
  const apiInfo = {
    apibase: 'https://script.google.com/macros/s/AKfycbzp-DIszFmZMUasJwHnzwcQ9VE3NmI2QmbUvawRMq8fnDfuBCQ/exec',
    apikey: 'MVpacinginfov2'
  };
  
  const baseURLForFullPacingGuide = '[figure me out]';

  const terms = {
    semester1: { termtype: "semester", displayname: "semester 1" },
    semester2: { termtype: "semester", displayname: "semester 2" },
    trimester1: { termtype: "trimester", displayname: "trimester 1" },
    trimester2: { termtype: "trimester", displayname: "trimester 2" },
    trimester3: { termtype: "trimester", displayname: "trimester 3" },
    summer: { termtype: "summer", displayname: "summer" }
  };

	//---------------------------------------
	// get things going
	//----------------------------------------
  async function init() {
    
		page.body = document.getElementsByTagName('body')[0];

    _renderStandardElements();

    var expectedQueryParams = [
      {key: 'coursekey', required: true},
      {key: 'term', required: true},
      {key: 'announcements', required: true},
      {key: 'instance', require: false}
    ];
        
    if (_initializeSettings(expectedQueryParams)) {
      settings.shortTerm = terms[settings.term].termtype;
      _renderPage();
    }
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
    page.notice = new StandardNotice(page.body, page.body);
  }
  
  function _renderPage() {
    page.infocontainer = CreateElement.createDiv('contentContainer', null);
    page.body.appendChild(page.infocontainer);
    _refreshPacingInfo();
  }
    
  async function _refreshPacingInfo() {
    page.notice.hideError();
    while (page.infocontainer.childNodes.length > 0) page.infocontainer.removeChild(page.infocontainer.childNodes[0]);    
    
    var pacingguideData = await _loadPacingCalendarAndGuideData(settings.coursekey, settings.shortTerm);
    if (pacingguideData == null) return;
    
    var params = {
      coursekey: settings.courekey,
      term: settings.term,
      shortTerm: settings.shortTerm,
      urlAnnouncements: settings.announcements,
      weekNumber: 0,
      baseURLForFullPacingGuide: baseURLForFullPacingGuide
    };

    new PacingInfo(params, pacingguideData.calendar, pacingguideData.guide).render(page.infocontainer);
    _postHeightChangeMessage();
  }
  
	//------------------------------------------------------------------
	// data retrieval
	//------------------------------------------------------------------      
  async function _loadPacingCalendarAndGuideData(coursekey, term) {
    var result = null;
    
    page.notice.setNotice('loading pacing info...', true);
    var requestParams = {coursekey: coursekey, term: term};
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'calendarandguide', requestParams, page.notice);

    if (requestResult.success) {
      page.notice.setNotice('');
      var result = requestResult.data;
    } 
    
    if (!result) {
      page.notice.setNotice('load failed');
    }
    
    return result;
  }
  
	//-----------------------------------------------------------------------------------
	// iframe responsive height - post message to parent (if in an iframe) to resizeBy
	//-----------------------------------------------------------------------------------
	function _postHeightChangeMessage() {
		var msg = document.body.scrollHeight + '-' + 'PacingIndex' + '-' + settings.instance;
		console.log('posting to parent: ' + msg);
		window.parent.postMessage(msg, "*");
	}
    
	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
