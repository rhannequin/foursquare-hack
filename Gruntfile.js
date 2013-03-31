'use strict';

module.exports = function (grunt) {
  // project configuration
  var foursquareHack = grunt.file.readJSON('foursquare-hack.json');

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Grunt.js configuration
  grunt.initConfig({

    foursquareHack: foursquareHack,

    // server
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'app'
        }
      }
    },

    // Livereload
    livereload: {
      port: 35728
    },

    // Watch
    regarde: {
      html: {
        files: ['<%= foursquareHack.app.path %>/**/*.{html,md,txt,xml}'],
        tasks: []
      },
      js: {
        files: ['<%= foursquareHack.app.assets.scripts %>/**/*'],
        tasks: []
      },
      css: {
        files: ['<%= foursquareHack.app.assets.styles %>/**/*'],
        tasks: []
      },
      images: {
        files: ['<%= foursquareHack.app.assets.images %>/**/*'],
        tasks: []
      },
      livereload: {
        files: ['<%= foursquareHack.app.path %>/**/*'],
        tasks: ['livereload']
      }
    }

  });

  // Default
  grunt.registerTask('default', ['livereload-start', 'server', 'regarde']);

  // Server
  grunt.registerTask('server', 'connect:server');
};