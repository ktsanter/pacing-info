"use strict";
//-----------------------------------------------------------------------------------
// test driver for pacing info
//-----------------------------------------------------------------------------------
// TODO: determine base URL for full pacing guide
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
  const appname = 'pacing info (test driver)';
	const page = {};
  const settings = {};
  
  const apiInfo = {
    apibase: 'https://script.google.com/macros/s/AKfycbzp-DIszFmZMUasJwHnzwcQ9VE3NmI2QmbUvawRMq8fnDfuBCQ/exec',
    apikey: 'MVpacinginfov2'
  };
  
  const baseURLForFullPacingGuide = '[figure me out]';
  
  const courses = {
    game_design: "Advanced Programming: Game Design & Animation",
    javascript: "Advanced Web Design: JavaScript",
    apcsp1: "AP Computer Science Principles (S1)",
    apcsp2: "AP Computer Science Principles (S2)",
    html_css: "Basic Web Design: HTML & CSS",
    digital_literacy: "Digital Literacy & Programming",
    fpb: "Foundations of Programming B"    
  };
  
  const terms = {
    semester1: { termtype: "semester", displayname: "semester 1" },
    semester2: { termtype: "semester", displayname: "semester 2" },
    trimester1: { termtype: "trimester", displayname: "trimester 1" },
    trimester2: { termtype: "trimester", displayname: "trimester 2" },
    trimester3: { termtype: "trimester", displayname: "trimester 3" },
    summer: { termtype: "summer", displayname: "summer" }
  };

  const defaultAnnouncements = 'https://docs.google.com/presentation/d/e/2PACX-1vSrO9MidzGYwh7hBtswB24aWRdG-xbbq3EolP_pO-J_yNk1nzFutJSJs3JZXd0NPASLFa4GIPSq7R86/embed?start=false&loop=false&delayms=3000';

	//---------------------------------------
	// get things going
	//----------------------------------------
  async function init() {
    
		page.body = document.getElementsByTagName('body')[0];

    _renderStandardElements();
    settings.pacingcalendardata = await _loadPacingCalendarData();
    if (settings.pacingcalendardata == null) return;

    page.notice.setNotice('');
    _renderPage();
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
    page.infocontainer = CreateElement.createDiv('contentContainer', null);
    page.body.appendChild(page.infocontainer);
    _refreshPacingInfo();
  }
  
  function _renderControls() {
    var container = CreateElement.createDiv('controlContainer', null);
    
    var coursecontainer = CreateElement.createDiv(null, null);
    container.appendChild(coursecontainer);
    var courseOptions = [];    
    for (var key in courses) {
      courseOptions.push({
        id: null,
        value: key,
        textval: courses[key]
      });
    }
    coursecontainer.appendChild(CreateElement.createSelect('selectCourse', null, null, courseOptions));
    
    var termcontainer = CreateElement.createDiv(null, null);
    container.appendChild(termcontainer);
    var i = 0;
    for (var key in terms) {
      termcontainer.appendChild(CreateElement.createRadio(null, 'info-control', 'termRadio', key, terms[key].displayname, i==0));
      i++;
    }

    var linkcontainer = CreateElement.createDiv(null, 'info-control', 'link to published announcements');
    container.appendChild(linkcontainer);
    linkcontainer.appendChild(CreateElement.createTextInput('inputAnnouncements', 'info-control', defaultAnnouncements));

    container.appendChild(CreateElement.createButton('buttonRender', null, 'render', 'render', _handleRenderButton));    
    
    return container;
  }
  
  async function _refreshPacingInfo() {
    page.notice.hideError();
    while (page.infocontainer.childNodes.length > 0) page.infocontainer.removeChild(page.infocontainer.childNodes[0]);    
    
    var pacingguideData = await _loadPacingGuideData(_getCourseKey(), _getShortTerm());
    if (pacingguideData == null) return;

    var params = {
      coursekey: _getCourseKey(),
      term: _getTerm(),
      shortTerm: _getShortTerm(),
      urlAnnouncements: _getAnnouncementsURL(),
      weekNumber: 0,
      baseURLForFullPacingGuide: baseURLForFullPacingGuide
    };
    var info = new PacingInfo(params, settings.pacingcalendardata, pacingguideData);
    info.render(page.infocontainer);
  }

	//------------------------------------------------------------------
	// get configuration parameters from UI
	//------------------------------------------------------------------    
  function _getCourseKey() {
    var coursekey = document.getElementById('selectCourse').value;

    return coursekey;    
  }
  
  function _getCourseName() {
    var coursekey = document.getElementById('selectCourse').value;

    return courses[coursekey];    
  }
  
  function _getTerm() {
    var elems = document.getElementsByName('termRadio');
    var term = null;
    for (var i = 0; i < elems.length && !term; i++) {
      if (elems[i].checked) term = elems[i].value;
    }

    return term;    
  }
  
  function _getShortTerm() {
    return terms[_getTerm()].termtype;
  }
  
  function _getAnnouncementsURL() {
    var url = document.getElementById('inputAnnouncements').value;
    
    return url;
  }
  
	//------------------------------------------------------------------
	// data retrieval
	//------------------------------------------------------------------      
  async function _loadPacingCalendarData() {
    var result = null;
    
    page.notice.setNotice('loading pacing calendar...', true);
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

  async function _loadPacingGuideData(coursekey, term) {
    var result = null;
    
    page.notice.setNotice('loading pacing guide...', true);
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
  async function _handleRenderButton(e) {
    e.target.disabled = true;
    await _refreshPacingInfo();
    e.target.disabled = false;
  }
  
	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
