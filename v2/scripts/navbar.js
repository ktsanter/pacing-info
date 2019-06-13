//-----------------------------------------------------------
// Bootstrap navigation bar class
//-----------------------------------------------------------
// TODO:
//-----------------------------------------------------------
class Navbar {
  constructor(id, items, handler) {
    this._id = id;
    this._items = items;
    this._handler = handler;
    
    this._activeLinkId = this._makeLinkId(0);
  }
  
  render(attachTo) {
    var navbar = CreateElement.createDiv(this._id, 'navbar2 navbar2-colorscheme');
    attachTo.appendChild(navbar);
    
    var navbarlist = CreateElement._createElement('ul', null, 'navbar2-list');
    navbar.appendChild(navbarlist);
    
    var linkhandler = function (me) { return function(e) {me._handleSelection(e);}} (this);

    for (var i = 0; i < this._items.length; i++) {
      var item = this._items[i];
      var listitem = CreateElement._createElement('li', 'navbar2-listitem', null);
      navbarlist.appendChild(listitem);

      var linkid = this._makeLinkId(i);
      var listitemlink;
      if (typeof item == 'string') {
        listitemlink = CreateElement.createLink(linkid, null, item, null, '#', linkhandler)

      } else {
        listitemlink = this._renderSubmenuLink(item, linkid, linkhandler);
      }
      listitem.appendChild(listitemlink);
      if (linkid == this._activeLinkId) this._setActiveElement(this._activeLinkId);
    }
  }
  
  _renderSubmenuLink(item, linkid, linkhandler) {
    var submenuhandler = function (me) { return function(e) {me._handleSubmenu(e);}} (this);

    var dropdown = CreateElement.createDiv(null, 'navbar2-dropdown');
    dropdown.appendChild(CreateElement.createButton(linkid, 'navbar2-dropdown-button', item.label, null, submenuhandler));
    
    var submenuContent = CreateElement.createDiv(null, 'navbar2-dropdown-content');
    dropdown.appendChild(submenuContent);
    
    for (var i = 0; i < item.items.length; i++) {
      var subitem = item.items[i];
      var sublinkid = linkid + '_sub' + ('000' + i).slice(-3);
      var subItemLink = CreateElement.createLink(sublinkid, 'navbar2 navbar2-dropdown-item', subitem, null, '#', linkhandler);
      submenuContent.appendChild(subItemLink);
    }
        
    return dropdown;
  }
  
  _makeLinkId(linkNumber) {
    return this._id + ('000' + linkNumber).slice(-3);
  }
  
  static _getLinkNumber(linkid) {
    return linkid.slice(-3) * 1;
  }
  
  _setActiveElement(newActiveId) {
    if (this._activeLinkId != null) {
      var elemActive = document.getElementById(this._activeLinkId);
      if (elemActive.hasOwnProperty('active')) elemActive.classList.remove('active');
    }
    this._activeLinkId = newActiveId
    document.getElementById(newActiveId).classList.add('active');
  }
  
  _handleSelection(e) {
    var newActiveId = e.target.id;
    var subId = null;

    if (newActiveId.search(/_sub[0-9]{3}/) >= 0) {
      newActiveId = newActiveId.slice(0, -7);
      subId = e.target.id.slice(newActiveId.length);
    }
    
    this._setActiveElement(newActiveId);
    
    var selection = {
      label: e.target.innerHTML,
      mainIndex: Navbar._getLinkNumber(this._activeLinkId),
      subIndex: subId == null ? -1 : Navbar._getLinkNumber(subId)
    };

    this._handler(selection);
    
    return false;
  }
  
  _handleSubmenu() {
    this._setActiveElement(e.target.id.slice(0, -7));
  }
  
  setMenuItemActive(menuItemNumber) {
    this._setActiveElement(this._makeLinkId(menuItemNumber));
  }
}