define(function (require) {
  require('main_pacingguide');
  require('pacingguide');
  require('standard_notice');
  require('google_webapp_interface');
  require('pacingcalendar');
  require('create_element');
  require('date_time');

  document.addEventListener('DOMContentLoaded', app.init());
});