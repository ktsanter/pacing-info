"use strict";
//-----------------------------------------------------------------------------------
// Student infoDeck Chrome extension
//-----------------------------------------------------------------------------------
// TODO: 
//-----------------------------------------------------------------------------------
class CreateElement {
  constructor () {
    this._version = '0.01';
  }
      
  static _createElement(elemType, id, classList) {
    var elem = document.createElement(elemType);
    if (id && id != '') elem.id = id;
    CreateElement.addClassList(elem, classList);
    return elem;
  }
  
  static addClassList(elem, classList) {
    if (classList && classList != '') {
      var splitClass = classList.split(' ');
      for (var i = 0; i < splitClass.length; i++) {
        elem.classList.add(splitClass[i]);
      }
    }
  }
  
  static createDiv(id, classList, html, handler) {
    var elem = CreateElement._createElement('div', id, classList);
    if (html != null) elem.innerHTML = html;
    
    return elem;
  }
  
  static createSpan(id, classList, html) {
    var elem = CreateElement._createElement('span', id, classList);
    if (html != null) elem.innerHTML = html;
    
    return elem;
  }
  
  static createImage(id, classList, src, title, handler, dblclickhandler) {
    var elem = CreateElement._createElement('img', id, classList);
    if (src != null) elem.src = src;
    if (title) elem.title = title;
    if (handler) elem.addEventListener('click', handler, false);
    if (dblclickhandler) elem.addEventListener('dblclick', dblclickhandler, false);
    
    return elem;
  }
    
  static createIcon(id, classList, title, handler, dblclickhandler) {
    var elem = CreateElement._createElement('i', id, classList);
    if (title) elem.title = title;
    if (handler) elem.addEventListener('click', handler, false);
    if (dblclickhandler) elem.addEventListener('dblclick', dblclickhandler, false);
    
    return elem;
  }

  static createButton(id, classList, label, title, handler) {
    var elem = CreateElement._createElement('button', id, classList);
    elem.innerHTML = label;
    elem.title = title;
    if (handler) elem.addEventListener('click', e => handler(e), false);
    
    return elem;
  }
  
  static createLink(id, classList, title, href, handler) {
    var elem = CreateElement._createElement('a', id, classList);
    elem.innerHTML = title;
    elem.href = href;
    if (handler) elem.addEventListener('click', handler, false);
    
    return elem;
  }

  static createTextArea(id, classList) {
    var elem = CreateElement._createElement('textarea', id, classList);
    
    return elem;
  }
  
  static createHR(id, classList) {
    var elem = CreateElement._createElement('hr', id, classList);
    
    return elem;
  }

  static createBR(id, classList) {
    var elem = CreateElement._createElement('br', id, classList);
    
    return elem;
  }

  static createSelect(id, classList, changehandler, values) {
    var elem = CreateElement._createElement('select', id, classList);
    if (changehandler) elem.addEventListener('change', changehandler, false);
    
    if (values) {
      for (var i = 0; i < values.length; i++) {
        var opt = CreateElement._createElement('option', null, null);
        if (values[i].hasOwnProperty('id')) opt.id = values[i].id;
        if (values[i].hasOwnProperty('value')) opt.value = values[i].value;
        opt.text = values[i].textval;
        elem.appendChild(opt);
      }
    }      
    
    return elem;
  }
  
   static createOption(id, classList, value, label) {
    var elem = CreateElement._createElement('option', id, classList);
    elem.value = value;
    elem.innerHTML = label;
    
    return elem;
  }
  
  static createTextInput(id, classList, initialContents) {
    var elem = CreateElement._createElement('input', id, classList);
    elem.type = 'text';
    if (initialContents) elem.value = initialContents;
    
    return elem;
  }
   
  static createCheckbox(id, classList, groupName, buttonValue, displayValue, checked, handler) {
    var container = CreateElement.createSpan(null, null);
    
    var elem = CreateElement._createElement('input', id, classList);
    elem.type = 'checkbox';
    elem.name = groupName;
    elem.value = buttonValue;
    elem.checked = checked;
    elem.addEventListener('click', e => handler(e), false);
    container.appendChild(elem);
    
    var label = CreateElement._createElement('label', id, classList);
    label.innerHTML = displayValue;
    container.appendChild(label);

    return container;
  }
  
  static createRadio(id, classList, groupName, buttonValue, displayValue, checked, handler) {
    var container = CreateElement.createSpan(null, null);
    
    var elem = CreateElement._createElement('input', id, classList);
    elem.type = 'radio';
    elem.name = groupName;
    elem.value = buttonValue;
    elem.checked = checked;
    elem.addEventListener('click', e => handler(e), false);
    container.appendChild(elem);
    
    var label = CreateElement._createElement('label', id, classList);
    label.htmlFor = id;
    label.innerHTML = displayValue;
    container.appendChild(label);

    return container;
  }
  
   static createTable(id, classList, headers, contents, captionLabel) {
    var table = CreateElement._createElement('table', id, classList);
    
    if (captionLabel) {
      var caption = table.createCaption();
      caption.innerHTML = captionLabel;
    }
    
    if (headers) {
      var tr = CreateElement._createElement('tr', null, null);
      table.appendChild(tr);
      for (var i = 0; i < headers.length; i++) {
        var th = CreateElement._createElement('th', null, null);
        th.innerHTML = headers[i];
        tr.appendChild(th);
      }
    }
    
    if (contents) {
      for (var i = 0; i < contents.length; i++) {
        var tr = CreateElement._createElement('tr', null, null);
        table.appendChild(tr);
        for (var j = 0; j < contents[i].length; j++) {
          var td = CreateElement._createElement('td', null, null);
          td.innerHTML = contents[i][j];
          tr.appendChild(td);
        }
      }
    }
    
    return table;
  }
}