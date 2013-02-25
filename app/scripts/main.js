require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    bootstrap: 'vendor/bootstrap'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: '$'
    }
  }
});

require(['app', 'jquery', 'bootstrap'], function (app, $) {
  'use strict';
});