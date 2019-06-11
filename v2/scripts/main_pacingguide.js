"use strict";
//-----------------------------------------------------------------------------------
// test driver for pacing guide
//-----------------------------------------------------------------------------------
// TODO: add single week selection
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
        
    settings.courselist = await _loadPacingGuideCourseList();
    if (settings.courselist) {
      _renderPage();
		}
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
  }
  
  function _renderControls() {
    var terms = ['semester', 'trimester', 'summer'];
    var weekChoices = ['all weeks', 'single week'];
    var titleChoices = ['display title', 'display week number'];
    
    settings.displaytitle = true;
    settings.displayweeknumber = false;

    var outerContainer = CreateElement.createDiv('outerControlsContainer', null);
    var container = CreateElement.createDiv(null, 'section-controls');
    outerContainer.appendChild(container);

    page.courseselect = CreateElement.createDiv(null, 'guide-control', 'dummy');
    container.appendChild(page.courseselect);
    _renderCourseSelect(terms[0]);
    
    container.appendChild(CreateElement.createBR('putSelectBeforeMe'));
    
    for (var i = 0; i < terms.length; i++) {
      container.appendChild(CreateElement.createRadio(null, 'guide-control', 'termRadio', terms[i], terms[i], i == 0, _handleTermRadio));
    }
    
    container.appendChild(CreateElement.createBR());
    for (var i = 0; i < weekChoices.length; i++) {
      container.appendChild(CreateElement.createRadio(null, 'guide-control', 'weekchoiceRadio', weekChoices[i], weekChoices[i], i == 0));
    }
    
    container.appendChild(CreateElement.createSpinner('spinnerWeek', 'guide-control', 1, 1, 18, 1));

    container.appendChild(CreateElement.createBR());
    for (var i = 0; i < titleChoices.length; i++) {
      container.appendChild(CreateElement.createCheckbox(null, 'guide-control', 'titleCheckbox', titleChoices[i], titleChoices[i], i == 0));
    }
    
    container.appendChild(CreateElement.createBR());
    container.appendChild(CreateElement.createButton(null, 'guide-control', 'render', 'render', _handleRenderButton));

    return outerContainer;
  }
  
  function _renderCourseSelect(term) {
    var coursesForTerm = settings.courselist[term].sort();
    var courseOptions = [];
    for (var i = 0; i < coursesForTerm.length; i++) {
      courseOptions.push({value: coursesForTerm[i], textval: coursesForTerm[i]});
    }
    
    var newSelect = CreateElement.createSelect('selectCourse', 'guide-control', null, courseOptions);
    
    var elemParent = page.courseselect.parentNode;
    elemParent.removeChild(page.courseselect);
    page.courseselect = newSelect;
    elemParent.insertBefore(page.courseselect, document.getElementById('putSelectBeforeMe'));
  }
  
  async function _refreshPacingGuide() {
    page.notice.hideError();
    while (page.guidecontainer.childNodes.length > 0) page.guidecontainer.removeChild(page.guidecontainer.childNodes[0]);
    
    var coursekey = _getCoursekey();
    var term = _getTerm();
    var weekChoice = _getWeekChoice();
    var displayChoices = _getLabelDisplayChoices();
    
    settings.pacingguidedata = await _loadPacingGuideData(coursekey, term);

    if (settings.pacingguidedata != null) {
      if (weekChoice == 'all weeks') {
        new PacingGuide(settings.pacingguidedata).render(page.guidecontainer, displayChoices.title);
      } else {
        new PacingGuide(settings.pacingguidedata).renderWeek(page.guidecontainer, weekChoice, displayChoices.title, displayChoices.weeknumber);
      }
    }
  }
  
	//------------------------------------------------------------------
	// get configuration parameters from UI
	//------------------------------------------------------------------    
  function _getTerm() {
    var elems = document.getElementsByName('termRadio');
    var term = null;
    for (var i = 0; i < elems.length && !term; i++) {
      if (elems[i].checked) term = elems[i].value;
    }

    return term;    
  }
  
  function _getCoursekey() {
    var coursekey = document.getElementById('selectCourse').value;

    return coursekey;
  }
  
  function _getWeekChoice() {
    var elems = document.getElementsByName('weekchoiceRadio');
    var weekChoice = null;
    for (var i = 0; i < elems.length && !weekChoice; i++) {
      if (elems[i].checked) {
        if (elems[i].value == 'all weeks') {
          weekChoice = elems[i].value;
        } else {
          weekChoice = document.getElementById('spinnerWeek').value;
        }
      }
    }

    return weekChoice;
  }
  
  function _getLabelDisplayChoices() {
    var elems = document.getElementsByName('titleCheckbox');
    var displayTitle = false;
    var displayWeekNumber = false;
    
    for (var i = 0; i < elems.length; i++) {
      if (elems[i].checked) {
        if (elems[i].value == 'display title') displayTitle = true;
        else displayWeekNumber = true;
      }
    }
    
    return {title: displayTitle, weeknumber: displayWeekNumber};
  }
  
	//------------------------------------------------------------------
	// data retrieval
	//------------------------------------------------------------------      
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
  function _handleTermRadio(e) {
    _renderCourseSelect(e.target.value);    
  }
  
  function _handleRenderButton(e) {
    _refreshPacingGuide();
  }

	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
