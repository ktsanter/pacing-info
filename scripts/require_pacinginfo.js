define(function (require) {
  require('main_pacinginfo');
  require('pacinginfo');
  require('pacingguide');
  require('pacingcalendar');
  require('standard_notice');
  require('google_webapp_interface');
  require('create_element');
  require('date_time');
  require('navbar');

  document.addEventListener('DOMContentLoaded', app.init());
});