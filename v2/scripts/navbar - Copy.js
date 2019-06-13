//-----------------------------------------------------------
// Bootstrap navigation bar class
//-----------------------------------------------------------
// TODO:
//-----------------------------------------------------------
class Navbar {
  constructor() {
    this._numweeks = 18;
    this._apCourse = false;
    this._dates = [
      {startDate: 'xx/xx', endDate: 'xx/xx', currentWeekNum: 6},
      {startDate: 'xx/xx', endDate: 'xx/xx', currentWeekNum: 5},
      {startDate: 'xx/xx', endDate: 'xx/xx', currentWeekNum: 4}
    ]
  }
  
  render(attachTo) {
    var navbar = CreateElement._createElement('nav', null, 'navbar navbar-expand-sm navbar-light bg-light');
    attachTo.appendChild(navbar);
    
    //navbar.appendChild(CreateElement.createLink(null, 'navbar-brand', null, null, '#')); 
    var btn = CreateElement.createButton(null, 'navbar-toggler');
    navbar.appendChild(btn);
    btn.setAttribute('data-toggle', 'collapse');
    btn.setAttribute('data-target', '#navbarSupportedContent');
    btn.setAttribute('aria-controls', 'navbarSupportedContent');
    btn.setAttribute('aria-expanded', false);
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.appendChild(CreateElement.createSpan(null, 'navbar-toggler-icon'));
    
    var navbarcontent = CreateElement.createDiv('navbarSupportedContent', 'collapse navbar-collapse');
    navbar.appendChild(navbarcontent);
    var navbarlist = CreateElement._createElement('ul', 'navbarlist', 'navbar-nav mr-auto');
    navbarcontent.appendChild(navbarlist);
    
    navbarlist.appendChild(this._makeNavbarItem('home00', null, 'overview of this week-by-week pacing tool', 'home <span class="sr-only">(current)</span>'));
    for (var i = 0; i < this._dates.length; i++) {
      var info = this._dates[i];
      var id = this._navItemId(info.currentWeekNum);
      var title = info.startDate + '-' + info.endDate;
      navbarlist.appendChild(this._makeNavbarItem(id, '', title, 'week ' + info.currentWeekNum));
    }
    navbarlist.appendChild(this._makeNavbarDropdown());
    /*
   
    //-- make navbar item for "home" page
    page.navbarlist.appendChild(_makeNavbarItem('home00', '', 'overview of this week-by-week pacing tool', 'home <span class="sr-only">(current)</span>'));
    
    //-- make navbar item for current week corresponding to each start
    var title = '';
    if (!apCourse) {
      title = 'start1: ' + _formatPacingDate(start1Info.startDate) + '-' + _formatPacingDate(start1Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start1Info.currentWeekNum), '', title, 'week ' + start1Info.currentWeekNum));
    }
    if (apCourse) {
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(startAPInfo.currentWeekNum), '', 'current week', 'week ' + startAPInfo.currentWeekNum));
    } else {
      title = 'start2: ' + _formatPacingDate(start2Info.startDate) + '-' + _formatPacingDate(start2Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start2Info.currentWeekNum), '', title, 'week ' + start2Info.currentWeekNum));
    }
    if (!apCourse) {
      title = 'start3: ' + _formatPacingDate(start3Info.startDate) + '-' + _formatPacingDate(start3Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start3Info.currentWeekNum), '', title, 'week ' + start3Info.currentWeekNum));
    }
    
    //-- make navbar drop down item for all weeks  
     page.navbarlist.appendChild(_makeNavbarDropdown());
     
    //-- add event handlers
    $(".nav-link").each( function() {
      if (this.id != 'navbarDropdown') {
        this.addEventListener('click', _makeNavlinkHandler(this)); 
      }
    });

    $(".dropdown-item").each( function() {
      this.addEventListener('click', _makeNavlinkHandler(this)); 
    });
*/
    /*
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
      <a class="navbar-brand" href="#"></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" 
      data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul id="navbarlist" class="navbar-nav mr-auto"> </ul>        
      </div>
    </nav>
    */
  }
  
  _makeNavbarItem(id, classList, title, content) {
    var elem = CreateElement._createElement('li', null, 'navitem');

    var fullClassList = 'nav-link';
    //if (classList != null) fullClassList = classList + ' ' + 'nav-link';
    var elemlink = CreateElement.createLink(id, fullClassList, content, title, '#');
    elem.appendChild(elemlink);
    
    return elem;
  }
  
  _makeNavbarDropdown() {
    var elem = CreateElement._createElement('li', null, 'nav-item dropdown');
    
    var elemlink = CreateElement.createLink('navbarDropdown', 'nav-link dropdown-toggle', null, 'all weeks', '#');
    elem.appendChild(elemlink);
    elemlink.setAttribute('role', 'button');
    elemlink.setAttribute('data-toggle', 'dropdown');
    elemlink.setAttribute('aria-haspopup', 'true');
    elemlink.setAttribute('aria-expanded', 'false');
    
    var elemdiv = CreateElement.createDiv(null, 'dropdown-menu');
    elem.appendChild(elemdiv);
    elemdiv.setAttribute('aria-labelledby', 'navbarDropdown');
    for (var i = 0; i < this._numweeks; i++) {
     elemdiv.appendChild(this._makeNavbarDropdownItem(this._navItemId(i+1), '', 'week ' + (i+1) ));
    }
    
    return elem;    
  }
  
  _makeNavbarDropdownItem(id, classtext, label) {
    var elem = CreateElement.createLink(id, (classtext + ' dropdown-item').trim(), label, null, '#');
    
    return elem;
  }
  
  _navItemId(weeknum) {
    return 'navweek' + ('00' + weeknum).slice(-2);
  }
}

/*
  function _renderNavigation() {
    var apCourse = fullPacingInfo.pacinginfo.apcourse;
    var start1Info = settings.calendarSummary.start1;
    var start2Info = settings.calendarSummary.start2;
    var start3Info = settings.calendarSummary.start3;
    var startAPInfo = settings.calendarSummary.startAP;
    
    //-- make navbar item for "home" page
    page.navbarlist.appendChild(_makeNavbarItem('home00', '', 'overview of this week-by-week pacing tool', 'home <span class="sr-only">(current)</span>'));
    
    //-- make navbar item for current week corresponding to each start
    var title = '';
    if (!apCourse) {
      title = 'start1: ' + _formatPacingDate(start1Info.startDate) + '-' + _formatPacingDate(start1Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start1Info.currentWeekNum), '', title, 'week ' + start1Info.currentWeekNum));
    }
    if (apCourse) {
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(startAPInfo.currentWeekNum), '', 'current week', 'week ' + startAPInfo.currentWeekNum));
    } else {
      title = 'start2: ' + _formatPacingDate(start2Info.startDate) + '-' + _formatPacingDate(start2Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start2Info.currentWeekNum), '', title, 'week ' + start2Info.currentWeekNum));
    }
    if (!apCourse) {
      title = 'start3: ' + _formatPacingDate(start3Info.startDate) + '-' + _formatPacingDate(start3Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start3Info.currentWeekNum), '', title, 'week ' + start3Info.currentWeekNum));
    }
    
    //-- make navbar drop down item for all weeks  
     page.navbarlist.appendChild(_makeNavbarDropdown());
     
    //-- add event handlers
    $(".nav-link").each( function() {
      if (this.id != 'navbarDropdown') {
        this.addEventListener('click', _makeNavlinkHandler(this)); 
      }
    });

    $(".dropdown-item").each( function() {
      this.addEventListener('click', _makeNavlinkHandler(this)); 
    });
  }
  */
/*
  function _makeNavbarDropdownItem(id, classtext, innerHTML) {
    var elemAnchor = document.createElement('a')
    elemAnchor.id = id;
    elemAnchor.classList.add('dropdown-item');
    if (classtext != '') elemAnchor.classList.add(classtext);
    elemAnchor.innerHTML = innerHTML;
    elemAnchor.href = '#';
    
    return elemAnchor;
  }
  
  function _navItemId(weeknum) {
    return 'navweek' + ('00' + weeknum).slice(-2);
  }
*/
/*
  function _makeNavbarDropdown() {
     var elemDropdown = document.createElement('li');
     elemDropdown.classList.add('nav-item');
     elemDropdown.classList.add('dropdown');
     
     var elemAnchor = document.createElement('a');
     elemAnchor.id = 'navbarDropdown'
     elemAnchor.classList.add('nav-link');
     elemAnchor.classList.add('dropdown-toggle');
     elemAnchor.title = 'all weeks';
     elemAnchor.href = '#';
     elemAnchor.setAttribute('role', 'button');
     elemAnchor.setAttribute('data-toggle', 'dropdown');
     elemAnchor.setAttribute('aria-haspopup', 'true');
     elemAnchor.setAttribute('aria-expanded', 'false');
     
     var elemDiv = document.createElement('div');
     elemDiv.classList.add('dropdown-menu');
     elemDiv.setAttribute('aria-labelledby', 'navbarDropdown');
     for (var i = 0; i < settings.numweeks; i++) {
       elemDiv.appendChild(_makeNavbarDropdownItem(_navItemId(i+1), '', 'week ' + (i+1) ));
     }
     
     elemDropdown.appendChild(elemAnchor);
     elemDropdown.appendChild(elemDiv);

     return elemDropdown;
  }
*/

/*
  function _makeNavbarItem(id, classtext, title, innerHTML) {
    var elemListItem = document.createElement('li');
    elemListItem.classList.add('navitem');
    
    var elemAnchor = document.createElement('a');
    elemAnchor.classList.add('nav-link');
    if (classtext != '') elemAnchor.classList.add(classtext);
    elemAnchor.id = id;
    elemAnchor.title = title;
    elemAnchor.innerHTML = innerHTML;
    elemAnchor.href = '#';
    elemListItem.appendChild(elemAnchor);
    
    return elemListItem;
  }
  */
/*
  
  function _renderNavigation() {
    var apCourse = fullPacingInfo.pacinginfo.apcourse;
    var start1Info = settings.calendarSummary.start1;
    var start2Info = settings.calendarSummary.start2;
    var start3Info = settings.calendarSummary.start3;
    var startAPInfo = settings.calendarSummary.startAP;
    
    //-- make navbar item for "home" page
    page.navbarlist.appendChild(_makeNavbarItem('home00', '', 'overview of this week-by-week pacing tool', 'home <span class="sr-only">(current)</span>'));
    
    //-- make navbar item for current week corresponding to each start
    var title = '';
    if (!apCourse) {
      title = 'start1: ' + _formatPacingDate(start1Info.startDate) + '-' + _formatPacingDate(start1Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start1Info.currentWeekNum), '', title, 'week ' + start1Info.currentWeekNum));
    }
    if (apCourse) {
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(startAPInfo.currentWeekNum), '', 'current week', 'week ' + startAPInfo.currentWeekNum));
    } else {
      title = 'start2: ' + _formatPacingDate(start2Info.startDate) + '-' + _formatPacingDate(start2Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start2Info.currentWeekNum), '', title, 'week ' + start2Info.currentWeekNum));
    }
    if (!apCourse) {
      title = 'start3: ' + _formatPacingDate(start3Info.startDate) + '-' + _formatPacingDate(start3Info.endDate);
      page.navbarlist.appendChild(_makeNavbarItem(_navItemId(start3Info.currentWeekNum), '', title, 'week ' + start3Info.currentWeekNum));
    }
    
    //-- make navbar drop down item for all weeks  
     page.navbarlist.appendChild(_makeNavbarDropdown());
     
    //-- add event handlers
    $(".nav-link").each( function() {
      if (this.id != 'navbarDropdown') {
        this.addEventListener('click', _makeNavlinkHandler(this)); 
      }
    });

    $(".dropdown-item").each( function() {
      this.addEventListener('click', _makeNavlinkHandler(this)); 
    });
  }
  
  function _makeNavbarItem(id, classtext, title, innerHTML) {
    var elemListItem = document.createElement('li');
    elemListItem.classList.add('navitem');
    
    var elemAnchor = document.createElement('a');
    elemAnchor.classList.add('nav-link');
    if (classtext != '') elemAnchor.classList.add(classtext);
    elemAnchor.id = id;
    elemAnchor.title = title;
    elemAnchor.innerHTML = innerHTML;
    elemAnchor.href = '#';
    elemListItem.appendChild(elemAnchor);
    
    return elemListItem;
  }
    
  function _makeNavbarDropdownItem(id, classtext, innerHTML) {
    var elemAnchor = document.createElement('a')
    elemAnchor.id = id;
    elemAnchor.classList.add('dropdown-item');
    if (classtext != '') elemAnchor.classList.add(classtext);
    elemAnchor.innerHTML = innerHTML;
    elemAnchor.href = '#';
    
    return elemAnchor;
  }
  
  function _navItemId(weeknum) {
    return 'navweek' + ('00' + weeknum).slice(-2);
  }
*/
