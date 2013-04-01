'use strict';

module.exports = function (grunt) {
  // project configuration
  var foursquareHack = grunt.file.readJSON('foursquare-hack.json');

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Grunt.js configuration
  grunt.initConfig({

    foursquareHack: foursquareHack,

    // Clean folders
    clean: {
      build: {
        src: ['<%= foursquareHack.dist.path %>']
      }
    },

    // Copy files and folders
    copy: {
      styles: {
        files: [
          {
            expand: true,
            cwd: '<%= foursquareHack.app.assets.styles %>',
            src: ['*.css'],
            dest: '<%= foursquareHack.dist.assets.styles %>'
          }
        ]
      },
      html: {
        files: [
          {
            expand: true,
            cwd: '<%= foursquareHack.app.path %>',
            src: ['*.html'],
            dest: '<%= foursquareHack.dist.path %>',
            filter: 'isFile'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            cwd: '<%= foursquareHack.app.assets.images %>',
            src: ['**'],
            dest: '<%= foursquareHack.dist.assets.images %>'
          }
        ]
      }
    },

    // Compass
    compass: {
      dev: {
        options: {
          sassDir: '<%= foursquareHack.app.assets.styles %>',
          cssDir: '<%= foursquareHack.app.assets.styles %>',
          imagesDir: '<%= foursquareHack.app.assets.images %>',
          javascriptsDir: '<%= foursquareHack.app.assets.scripts %>',
          outputStyle: 'expanded',
          noLineComments: false,
          debugInfo: true
        }
      },
      build: {
        options: {
          sassDir: '<%= foursquareHack.app.assets.styles %>',
          cssDir: '<%= foursquareHack.app.assets.styles %>',
          imagesDir: '<%= foursquareHack.app.assets.images %>',
          javascriptsDir: '<%= foursquareHack.app.assets.scripts %>',
          outputStyle: 'compressed',
          noLineComments: true,
          debugInfo: false
        }
      }
    },

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
        files: ['<%= foursquareHack.app.path %>**/*.{html,md,txt,xml}'],
        tasks: []
      },
      js: {
        files: ['<%= foursquareHack.app.assets.scripts %>**/*'],
        tasks: []
      },
      scss: {
        files: ['<%= foursquareHack.app.assets.styles %>**/*.scss'],
        tasks: ['compass:dev']
      },
      images: {
        files: ['<%= foursquareHack.app.assets.images %>**/*'],
        tasks: []
      }
    },

    requirejs: {
      build: {
        options: {
          baseUrl:                    '<%= foursquareHack.app.assets.path %>',
          mainConfigFile:             '<%= foursquareHack.app.assets.scripts %>config.js',
          out:                        '<%= foursquareHack.dist.assets.scripts %>app.js',
          name:                       'components/almond/almond',
          insertRequire:              ['scripts/main'],
          wrap:                       true,
          findNestedDependencies:     true,
          optimizeAllPluginResources: false,
          preserveLicenseComments:    true,
          optimize:                   'none'
        }
      }
    }

  });

  // Default
  grunt.registerTask('default', ['compass:dev', 'livereload-start', 'server', 'regarde']);

  // Build
  grunt.registerTask('build', ['clean:build', 'compass:build', 'copyBuild', 'requirejs:build']);

  // copyBuild
  grunt.registerTask('copyBuild', ['copy:html', 'copy:styles', 'copy:images']);

  // Server
  grunt.registerTask('server', 'connect:server');
};