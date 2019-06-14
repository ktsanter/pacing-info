"use strict";
//-----------------------------------------------------------------------------------
// test driver for pacing guide
//-----------------------------------------------------------------------------------
// TODO:
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
  const appname = 'pacing guide';
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
      {key: 'coursekey', required: true},
      {key: 'term', required: true}];
        
    if (_initializeSettings(expectedQueryParams)) {
      _renderPage();
      _refreshPacingGuide();
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
    /*
    var title = CreateElement.createDiv(null, 'standard-title', appname);
    page.body.appendChild(title);
    */
    page.notice = new StandardNotice(page.body, page.body);
  }
  
  function _renderPage() {
    page.guidecontainer = CreateElement.createDiv('outerGuideContainer', null);
    page.body.appendChild(page.guidecontainer);
  }
  
  async function _refreshPacingGuide() {
    page.notice.hideError();
    while (page.guidecontainer.childNodes.length > 0) page.guidecontainer.removeChild(page.guidecontainer.childNodes[0]);
        
    settings.pacingguidedata = await _loadPacingGuideData(settings.coursekey, settings.term);

    if (settings.pacingguidedata != null) {
      new PacingGuide(settings.pacingguidedata).render(page.guidecontainer, true);
    }
  }
  
	//------------------------------------------------------------------
	// data retrieval
	//------------------------------------------------------------------       
  async function _loadPacingGuideData(coursekey, term) {
    var result = null;
    
    page.notice.setNotice('loading...', true);
    var requestParams = {coursekey: coursekey, term: term};
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
