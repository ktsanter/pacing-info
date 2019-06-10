"use strict";
//-----------------------------------------------------------------------------------
// test driver for pacing guide
//-----------------------------------------------------------------------------------
// TODO: 
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
  const appname = 'pacing guide (test driver)';
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
    
    //--- temp ---
    settings.coursekey = 'fpb';
    settings.term = 'semester1';
    
		if (_initializeSettings(expectedQueryParams)) {
      settings.courselist = await _loadPacingGuideCourseList();
      settings.pacingguidedata = await _loadPacingGuideData();
      _renderPage();
		}
  }
  
  async function _loadPacingGuideCourseList() {
    var result = null;
    
    page.notice.setNotice('loading...', true);
    var requestParams = {};
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'courselist', requestParams, page.notice);

    if (requestResult.success) {
      page.notice.setNotice('');
      var result = requestResult.data;
    } 
    
    if (!result) {
      page.notice.setNotice('load failed');
    }
    
    return result;
  }
  
  async function _loadPacingGuideData() {
    var result = null;
    
    page.notice.setNotice('loading...', true);
    var requestParams = {coursekey: settings.coursekey, term: settings.term};
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo, 'pacingguide', requestParams, page.notice);

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
    
    page.guidecontainer = CreateElement.createDiv('outerGuideContainer', null);
    page.body.appendChild(page.guidecontainer);
    _renderPacingGuide(page.guidecontainer);
  }
  
  function _renderControls() {
    var container = CreateElement.createDiv(null, 'section-controls');

    console.log(settings.courselist);
    container.appendChild(CreateElement.createDiv(null, null, 'put course selector here'));
    
    var terms = ['semester1', 'semester2', 'trimester1', 'trimester2', 'trimester3', 'summer'];
    for (var i = 0; i < terms.length; i++) {
      container.appendChild(CreateElement.createRadio(null, null, 'termRadio', terms[i], terms[i], i == 0, _handleRadio));
    }

    return container;
  }
  
  function _renderPacingGuide(attachTo) {
    page.guide = CreateElement.createDiv(null, null);
    attachTo.appendChild(page.guide);

    var guidedata = settings.pacingguidedata;

    page.guide.appendChild(CreateElement.createDiv(null, 'guide-label', guidedata.coursename + ' ' + guidedata.numberofweeks + ' week pacing guide'));
    
    var table = CreateElement.createTable('pacingGuide', 'guide-table');
    page.guide.appendChild(table);

    var headers = ['week', 'unit/module', 'lesson/assignment', 'complete?<br>yes/no'];
    if (guidedata.ap) headers[3] = 'due date<br>(11:59pm)';
  
    var row = CreateElement.createTableRow(null, null, table);
    for (var i = 0; i < headers.length; i++) {
      CreateElement.createTableCell(null, null, headers[i], true, row);
    }
    
    for (var i = 0; i < guidedata.pacingguide.length; i++) {
      var rowData = guidedata.pacingguide[i];
      var rowClassList = 'guide-oddweek';
      if (rowData.week % 2 == 0) rowClassList = 'guide-evenweek';
      if (rowData.progresscheck) rowClassList += 'guide-progresscheck';
      
      var taskClassList = null;
      if (rowData.graded) taskClassList = 'guide-graded';
      
      row = CreateElement.createTableRow(null, rowClassList, table);
      CreateElement.createTableCell(null, null, rowData.week, false, row);      
      CreateElement.createTableCell(null, null, rowData.unit, false, row);      
      CreateElement.createTableCell(null, taskClassList, rowData.task, false, row);      
      CreateElement.createTableCell(null, null, '', false, row);      
   }
  }

  async function _refreshPacingGuide() {
    page.notice.hideError();
    if (page.guide) {
      page.guide.parentNode.removeChild(page.guide);
      page.guide = null;
    }

    settings.pacingguidedata = await _loadPacingGuideData();

    if (settings.pacingguidedata != null) {
      _renderPacingGuide(page.guidecontainer);
    }
  }
  
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------    
  function _handleRadio(e) {
    settings.term = e.target.value;
    _refreshPacingGuide();
  }

	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
