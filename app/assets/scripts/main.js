require.config({
  deps: ['app'], // First script called
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