define(function (require) {
  require('main_pacingguide');
  require('standard_notice');
  require('google_webapp_interface');
  require('pacingcalendar');
  require('create_element');;

  document.addEventListener('DOMContentLoaded', app.init());
});