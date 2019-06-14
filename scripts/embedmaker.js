"use strict";
//-----------------------------------------------------------------------------------
// embed and link maker for pacing info
//-----------------------------------------------------------------------------------
// TODO:
//-----------------------------------------------------------------------------------

const app = function () {
  const appversion = '0.01';
  const appname = 'PacingInfo embed maker';
	const page = {};
  const settings = {};

  const apiInfo = {
    apibase: 'https://script.google.com/macros/s/AKfycbzp-DIszFmZMUasJwHnzwcQ9VE3NmI2QmbUvawRMq8fnDfuBCQ/exec',
    apikey: 'MVpacinginfov2'
  };
  
  const baseURLforPacingInfo = 'https://ktsanter.github.io/pacing-info/landing_pacinginfo.html';  

	//---------------------------------------
	// get things going
	//----------------------------------------
  async function init() {
    
		page.body = document.getElementsByTagName('body')[0];

    _renderStandardElements();

    settings.terms = [
      {value: 'semester1', displayvalue: 'semester 1', termtype: 'semester'}, 
      {value: 'semester2', displayvalue: 'semester 2', termtype: 'semester'}, 
      {value: 'trimester1', displayvalue: 'trimester 1', termtype: 'trimester'}, 
      {value: 'trimester2', displayvalue: 'trimester 2', termtype: 'trimester'}, 
      {value: 'trimester3', displayvalue: 'trimester 3', termtype: 'summer'}, 
      {value: 'summer', displayvalue: 'summer'}
    ];
    
    settings.coursenames = {
      game_design: 'Advanced Programming: Game Design & Animation',
      javascript: 'Advanced Web Design: JavaScript',
      apcsp1: 'AP Computer Science Principles (S1)',
      apcsp2: 'AP Computer Science Principles (S2)',
      html_css: 'Basic Web Design: HTML & CSS',
      digital_literacy: 'Digital Literacy & Programming',
      fpa: 'Foundations of Programming A',
      fpb: 'Foundations of Programming B',
      american_litB: 'American Literature B'
    };
    
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
    var container = CreateElement.createDiv('mainContainer', null);
    page.body.appendChild(container);
    
    container.appendChild(_renderControls());
  }
  
  function _renderControls() {
    var container = CreateElement.createDiv(null, 'standard-section');
    
    var contents = CreateElement.createDiv(null, 'standard-section-contents');
    container.appendChild(contents);
    
    contents.appendChild(_createCourseSelect());
    contents.appendChild(_createTermSelect());
    contents.appendChild(_createSlidesLinkSpecify());
    contents.appendChild(_createInstanceSelect());
    contents.appendChild(_createConfigButtons());
    
    return container;
  }
  
  function _createCourseSelect() {
    var container = CreateElement.createDiv(null, 'control-container');
    
    var coursekeys = settings.courselist[settings.terms[0].termtype];
    var values = [];
    for (var i = 0; i < coursekeys.length; i++) {
      var coursekey = coursekeys[i];
      values.push({value: coursekey, textval: settings.coursenames[coursekey]});
    }
    values = values.sort( function (a, b) {
      return a.textval.localeCompare(b.textval);
    });
    
    container.appendChild(CreateElement.createDiv(null, 'control-label', 'course'));
    var courseselect = CreateElement.createSelect('selectCourse', null, null, values);
    container.appendChild(courseselect);
    courseselect.addEventListener('change', _handleGeneric, false);
    
    return container;
  }
  
  function _createTermSelect() {
    var container = CreateElement.createDiv(null, 'control-container');
    
    var values = [];
    for (var i = 0; i < settings.terms.length; i++) {
      var term = settings.terms[i];
      values.push({value: term.value, textval: term.displayvalue});
    }
    
    container.appendChild(CreateElement.createDiv(null, 'control-label', 'term'));
    var termselect = CreateElement.createSelect('selectTerm', null, null, values);
    container.appendChild(termselect);
    termselect.addEventListener('change', _handleGeneric, false);
    
    return container;
  }
  
  function _createSlidesLinkSpecify() {
    var container = CreateElement.createDiv(null, 'control-container');
    
    container.appendChild(CreateElement.createDiv(null, 'control-label', 'slides link'));
    var textinput = CreateElement.createTextInput('inputAnnouncements', null);
    container.appendChild(textinput);
    textinput.size = 120;
    textinput.addEventListener('click', _handleGeneric, false);
    
    return container;
  }
  
  function _createInstanceSelect() {
    var container = CreateElement.createDiv(null, 'control-container');
    
    container.appendChild(CreateElement.createDiv(null, 'control-label', 'instance'));
    var spininput = CreateElement.createSpinner('inputInstance', null, 1, 1, 20, 1)
    container.appendChild(spininput);
    spininput.addEventListener('click', _handleGeneric, false);
    
    return container;
  }

  function _createConfigButtons() {
    var container = CreateElement.createDiv(null, null);
    
    container.appendChild(CreateElement.createButton(null, 'control-button', 'link', null, _handleLinkButton));
    container.appendChild(CreateElement.createButton(null, 'control-button', 'embed', null, _handleEmbedButton));

    return container;
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
              
	//------------------------------------------------------------------
	// data processing
	//------------------------------------------------------------------      
  function _makeAndCopyLink() {
    _copyToClipboard(_makeURL());
    page.notice.setNotice('copied link');
  }
  
  function _makeAndCopyEmbed() {
    console.log('make and copy embed');
    _copyToClipboard('make and copy embed');
    page.notice.setNotice('copied embed code');
  }
  
  function _makeURL() {
    var coursekey = document.getElementById('selectCourse').value;
    var term = document.getElementById('selectTerm').value;
    var announcements = document.getElementById('inputAnnouncements').value;
    var instance = document.getElementById('inputInstance').value;
    
    var url = baseURLforPacingInfo;
    url += '?coursekey=' + coursekey;
    url += '&term=' + term;
    url += '&instance=' + instance;
    url += '&announcements=' + announcements;
    
    return url;
  }
  
  //---------------------------------------
  // clipboard functions
  //----------------------------------------
  function _copyToClipboard(txt) {
    if (!page._clipboard) page._clipboard = new ClipboardCopy(page.body, 'plain');

    page._clipboard.copyToClipboard(txt);
	}	
  
	//---------------------------------------
	// handlers
	//----------------------------------------
  function _handleGeneric() {
    page.notice.setNotice('');
  }
  
  function _handleLinkButton() {
    _makeAndCopyLink();
  }
  
  function _handleEmbedButton() {
    _makeAndCopyEmbed();
  }
  
	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
