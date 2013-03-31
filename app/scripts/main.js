require.config({
  paths: {
    jquery: 'jquery',
    backbone: 'backbone',
    lodash: 'lodash'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: '$'
    },
    lodash: {
      exports: '_'
    },
    backbone: {
      deps: ['lodash'],
      exports: 'Backbone'
    }
  }
});

require(['app', 'jquery'], function (MainView, $) {
  'use strict';

  var mainView = new MainView();
});