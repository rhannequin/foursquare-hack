'use strict';

module.exports = function (grunt) {
  // project configuration
  var foursquareHack = grunt.file.readJSON('foursquare-hack.json');

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({});

  grunt.registerTask('default', []);
};