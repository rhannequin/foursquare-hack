require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    bootstrap: 'vendor/bootstrap',
    backbone: '../components/backbone/backbone',
    underscore: '../components/underscore/underscore'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: '$'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore'],
      exports: 'Backbone'
    }
  }
});

require(['app', 'jquery', 'bootstrap'], function (MainView, $) {
  'use strict';

  var mainView = new MainView();
});