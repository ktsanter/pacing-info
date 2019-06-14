"use strict";
//-----------------------------------------------------------------------------------
// pacing info class
//-----------------------------------------------------------------------------------
// TODO: URL to open pacing guide in full window
// TODO: look in to slides error messages
//-----------------------------------------------------------------------------------
class PacingInfo {
  constructor (params, pacingCalendarData, pacingGuideData) {
    this._coursekey = params.coursekey;
    this._term = params.term;
    this._shortTerm = params.shortTerm;
    this._urlAnnouncements = params.urlAnnouncements;
    this._weekNumber = params.weekNumber;
    this._baseURLForFullPacingGuide = params.baseURLForFullPacingGuide;

    this._pacingCalendarData = pacingCalendarData;
    this._pacingGuideData = pacingGuideData;
    
    this._navbar = this._createNavbar();
    
    PacingInfo._terms = {
      semester1: { termtype: "semester", displayname: "semester 1" },
      semester2: { termtype: "semester", displayname: "semester 2" },
      trimester1: { termtype: "trimester", displayname: "trimester 1" },
      trimester2: { termtype: "trimester", displayname: "trimester 2" },
      trimester3: { termtype: "trimester", displayname: "trimester 3" },
      summer: { termtype: "summer", displayname: "summer" }
    };
    
    PacingInfo._announcementsIframeWidth = 600;
    PacingInfo._announcementsIframeHeight = 450;
  
    PacingInfo._pacingIndexMenuLink = 'https://drive.google.com/open?id=172L_BNdFQ90jsBvfFTMaeiQ1jP3zGgsQ';
    PacingInfo._pacingIndexMenuLinkAP = 'https://drive.google.com/open?id=11qDWqfUHmJK_oZV0EXkuXAv14euIwjMd';
    PacingInfo._pacingIndexMenuImage = 'https://drive.google.com/uc?id=172L_BNdFQ90jsBvfFTMaeiQ1jP3zGgsQ';
    PacingInfo._pacingIndexMenuImageAP = 'https://drive.google.com/uc?id=11qDWqfUHmJK_oZV0EXkuXAv14euIwjMd';
    PacingInfo._pacingIndexFindingEndDateLink = 'https://drive.google.com/open?id=1HIl_0nFL3-9lOJ-cl3KMiOKaU0Lcsvpe';
    PacingInfo._pacingIndexFindingEndDateImage = 'https://drive.google.com/uc?id=1HIl_0nFL3-9lOJ-cl3KMiOKaU0Lcsvpe';
  }

  _refresh() {
    var containerParent = this._infocontainer.parentNode;
    containerParent.removeChild(this._infocontainer);
    this.render(containerParent);
  }
  
  render(attachTo) {
    this._infocontainer = CreateElement.createDiv(null, 'info-container');
    attachTo.appendChild(this._infocontainer);

    var navbarcontainer = CreateElement.createDiv('containerNavbar', null);    
    var homecontainer = CreateElement.createDiv('containerHome', null); 
    var announcecontainer = CreateElement.createDiv('containerAnnouncements', null);
    var calendarcontainer = CreateElement.createDiv('containerCalendar', null);
    var guidecontainer = CreateElement.createDiv('containerGuide', null);
    
    this._infocontainer.appendChild(navbarcontainer);
    this._infocontainer.appendChild(homecontainer);
    this._infocontainer.appendChild(announcecontainer);
    this._infocontainer.appendChild(calendarcontainer);
    this._infocontainer.appendChild(guidecontainer);
    
    this._navbar.render(navbarcontainer);

    var calendarHandler = e => this._handleCalendarSelection(e);
    calendarcontainer.appendChild(new PacingCalendar(this._pacingCalendarData, this._term, this._pacingGuideData.ap, true, calendarHandler).render());

    var elemTitle = CreateElement.createDiv('announcementsTitle', null, this._pacingGuideData.coursename + ' (week ' + this._weekNumber + ')');
    announcecontainer.appendChild(elemTitle);
    var handler = function (me, f) { return function(e) {me._handleOpenAnnouncementsInFullWindow(e);}} (this);
    elemTitle.appendChild(CreateElement.createIcon('announcementsOpenIcon', 'fas fa-external-link-alt', 'open pacing info in full window', handler));

    announcecontainer.appendChild(CreateElement.createIframe(
      'iframeAnnouncements', 
      null, 
      PacingInfo._makeLinkToAnnouncementsPage(this._urlAnnouncements, this._weekNumber), 
      PacingInfo._announcementsIframeWidth, 
      PacingInfo._announcementsIframeHeight, 
      true
    ));
    
    var guideHandler = e => this._handleOpenGuideInFullWindow(e);
    new PacingGuide(this._pacingGuideData, guideHandler).renderWeek(guidecontainer, this._weekNumber, false, true)
    this._renderHomePage(homecontainer, this._pacingGuideData.ap);

    PacingInfo._showMe(homecontainer, this._weekNumber == 0);
    PacingInfo._showMe(announcecontainer, this._weekNumber != 0);
    PacingInfo._showMe(calendarcontainer, this._weekNumber == 0);
    PacingInfo._showMe(guidecontainer, this._weekNumber != 0);    
  }

  _createNavbar() {
    var items = [];
    items.push('home');
    
    var weeks = this._getWeekSelections();
    
    for (var i = 0; i < weeks.length; i++) {
      items.push(weeks[i].currentWeek);
    }
    
    var numWeeks = this._pacingGuideData.numberofweeks;
    var subItems = [];
    for (var i = 0; i < numWeeks; i++) {
      subItems.push('week ' + (i + 1));
    }
    items.push({label: 'all', items: subItems});
        
    var navbarHandler = e => this._handleNavbarSelection(e);
    return new Navbar('nav', items, navbarHandler );    
  }
  
  _renderHomePage(container, ap) {
    container.style.width = this._announcementsIframeWidth + 'px';
    container.style.height = this._announcementsIframeHeight + 'px';
    container.style.minWidth = this._announcementsIframeWidth + 'px';
    container.style.minHeight = this._announcementsIframeHeight + 'px';

    var elemTitle = CreateElement.createDiv('homepageTitle', null, this._pacingGuideData.coursename);
    container.appendChild(elemTitle);
    var handler = function (me, f) { return function(e) {me._handleOpenAnnouncementsInFullWindow(e);}} (this);
    elemTitle.appendChild(CreateElement.createIcon('announcementsOpenIcon', 'fas fa-external-link-alt', 'open pacing info in full window', handler));
    
    var contents = CreateElement.createDiv('homepageContents', null);
    container.appendChild(contents);
    
    contents.appendChild(CreateElement.createDiv(null, null, 'This tool provides week-by-week pacing information for the course<br><br>' + 'According to the pacing guide: '));
    
    contents.appendChild(this._renderHomePageWeekList());
    
    contents.appendChild(CreateElement.createBR());

    contents.appendChild(CreateElement.createDiv(null, null, 'You can use the menu to access info for your current pacing week or any other.'));
    var img = PacingInfo._pacingIndexMenuImage;
    if (ap) img = PacingInfo._pacingIndexMenuImageAP;
    contents.appendChild(CreateElement.createImage('helpImage1', null, img, 'click to see larger image'));
    
    contents.appendChild(CreateElement.createBR());
    contents.appendChild(CreateElement.createBR());
    
    contents.appendChild(CreateElement.createDiv(null, null, 'You can find your start and end dates in the SLP.'));
    contents.appendChild(CreateElement.createImage('helpImage2', null, PacingInfo._pacingIndexFindingEndDateImage, 'click to see larger image'));
  }

  _renderHomePageWeekList() {
    var ap = this._pacingGuideData.ap;
    var weeks = this._getWeekSelections();
    
    var items = [];
    for (var i = 0; i < weeks.length; i++) {
      var msg = '';
      if (!ap && this._term != 'summer') {
        msg += 'if the dates of your term are ' + DateTime.formatDate(weeks[i].calendar.startdate);
        msg += ' - ' + DateTime.formatDate(weeks[i].calendar.enddate) + ' then ';
      }
      msg += 'you should be on <strong>' + weeks[i].currentWeek + '<strong>';
      items.push(msg);
    }
    
    return CreateElement.createUL(null, null, items);
  }
  
  _getWeekSelections() {
    var termCalendar = this._pacingCalendarData[this._term];
    var ap = this._pacingGuideData.ap;

    var weeks = [];    
    if (ap) {
      weeks.push({calendar: termCalendar.ap, currentWeek: this._findCurrentWeek(termCalendar.ap)});
    } else {
      weeks.push({calendar: termCalendar.start1, currentWeek: this._findCurrentWeek(termCalendar.start1)});
      if (termCalendar.hasOwnProperty('start2')) weeks.push({calendar: termCalendar.start2, currentWeek: this._findCurrentWeek(termCalendar.start2)});
    }
    
    return weeks;
  }
  
  static _makeLinkToAnnouncementsPage(baseAnnouncementsLink, pageNumber) {
    var url = baseAnnouncementsLink + '&rm=minimal';  // eliminate control bar from slides
    if (pageNumber && pageNumber > 0) {
      url += '#' + pageNumber;
    }
    
    return url;
  }
  
  _findCurrentWeek(termCalendar) {
    var currentWeek = null;
    var weeksInShortTerm = {semester: 18, trimester: 12, summer: 10}
    
    for (var i = 0; i < termCalendar.weeks.length; i++) {
      var week = termCalendar.weeks[i];
      if (week.weekname != '-') {
        if (DateTime.compareDateToNow(week.weekdate, 0) <= 0) currentWeek = week.weekname;
      }
    }
    
    if (currentWeek == null) currentWeek = 'week 1';
    
    return currentWeek;
  }

  static _showMe(elem, show) {
    if (show) {
      elem.style.display = 'inline-block';
    } else {
      elem.style.display = 'none';
    }
  }
  
  _handleNavbarSelection(selection) {
    var newWeekNumber = this._weekNumber;

    if (selection.subIndex >= 0) {
      newWeekNumber = selection.subIndex + 1;
      
    } else if (selection.mainIndex == 0) {
      newWeekNumber = 0;

    } else {
      var strCurrentWeek = this._getWeekSelections()[selection.mainIndex - 1].currentWeek;
      var parsed = strCurrentWeek.match(/[0-9]+/);
      newWeekNumber = parsed[0] * 1;
    }

    this._weekNumber = newWeekNumber;
    this._refresh();
  }
  
  _handleCalendarSelection(selection) {
    var parsed = selection.match(/[0-9]+/);
    this._weekNumber = parsed[0] * 1;
    
    
    this._navbar.setMenuItemActive(this._getWeekSelections().length + 1);
    this._refresh();
  }

  _handleOpenAnnouncementsInFullWindow() {
    window.open(this._urlAnnouncements, '_blank');
  }
  
  _handleOpenGuideInFullWindow() {
    var url = this._baseURLForFullPacingGuide;
    url += '?coursekey=' + this._coursekey;
    url += '&term=' + this._shortTerm;
    window.open(url, '_blank');
  }
}
