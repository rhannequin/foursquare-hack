(function () {
  'use strict';

  module.exports = function (grunt) {
    // project configuration
    var foursquareHack = grunt.file.readJSON('foursquare-hack.json');

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Grunt.js configuration
    grunt.initConfig({

      foursquareHack: foursquareHack,

      // JSHint
      jshint: {
        dev: {
          files: foursquareHack.grunt.jshint.files,
          options: { force: true }
        },
        build: {
          files: foursquareHack.grunt.jshint.files,
          options: { force: false }
        }
      },

      // Clean folders
      clean: {
        build: {
          src: ['<%= foursquareHack.dist.path %>']
        }
      },

      // Copy files and folders
      copy: {
        statics: {
          files: [
            {
              expand: true,
              dot:    true,
              cwd:    '<%= foursquareHack.app.path %>/',
              dest:   '<%= foursquareHack.dist.path %>',
              src:    ['*.{ico,txt}', '.htaccess']
            }
          ]
        }
      },

      // Compass
      compass: {
        dev: {
          options: {
            sassDir:        '<%= foursquareHack.app.styles %>',
            cssDir:         '<%= foursquareHack.app.styles %>',
            imagesDir:      '<%= foursquareHack.app.images %>',
            javascriptsDir: '<%= foursquareHack.app.scripts %>',
            outputStyle:    'expanded',
            noLineComments: false,
            debugInfo:      true
          }
        },
        build: {
          options: {
            sassDir:        '<%= foursquareHack.app.styles %>',
            cssDir:         '<%= foursquareHack.app.styles %>',
            imagesDir:      '<%= foursquareHack.app.images %>',
            javascriptsDir: '<%= foursquareHack.app.scripts %>',
            outputStyle:    'compressed',
            noLineComments: true,
            debugInfo:      false
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
          files: ['<%= foursquareHack.app.path %>/**/*.{html,md,txt,xml}'],
          tasks: []
        },
        js: {
          files: ['<%= foursquareHack.app.scripts %>/**/*'],
          tasks: ['jshint']
        },
        scss: {
          files: ['<%= foursquareHack.app.styles %>/**/*.scss'],
          tasks: ['compass:dev']
        },
        images: {
          files: ['<%= foursquareHack.app.images %>/**/*'],
          tasks: []
        }
      },

      // RequireJS Optimizer
      requirejs: {
        dist: {
          options: {
            baseUrl:                    '<%= foursquareHack.app.scripts %>',
            mainConfigFile:             'config.js',
            out:                        '<%= foursquareHack.dist.scripts %>/app.js',
            wrap:                       true,
            findNestedDependencies:     true,
            optimizeAllPluginResources: false,
            preserveLicenseComments:    true,
            optimize:                   'none'
          }
        }
      },

      // usemin prepare task
      useminPrepare: {
        html: '<%= foursquareHack.app.path %>/index.html',
        options: {
          dest: '<%= foursquareHack.dist.path %>'
        }
      },

      // Replace assets calls
      usemin: {
        html: ['<%= foursquareHack.dist.path %>/*.html'],
        css: ['<%= foursquareHack.dist.styles %>/*.css'],
        options: {
          dirs: ['<%= foursquareHack.dist.path %>']
        }
      },

      // Copy and minify images
      imagemin: {
        dist: {
          files: [{
            expand: true,
            cwd:    '<%= foursquareHack.app.images %>/',
            src:    '*.{png,jpg,jpeg}',
            dest:   '<%= foursquareHack.dist.images %>'
          }]
        }
      },

      // Copy and minify stylesheets
      cssmin: {
        dist: {
          files: {
            '<%= foursquareHack.dist.styles %>/main.css': [
              '.tmp/styles/*.css',
              '<%= foursquareHack.app.styles %>/*.css'
            ]
          }
        }
      },

      // Copy and minify html files
      htmlmin: {
        dist: {
          files: [
            {
              expand: true,
              cwd:    '<%= foursquareHack.app.path %>/',
              src:    '*.html',
              dest:   '<%= foursquareHack.dist.path %>'
            }
          ]
        }
      }

    });

    // Default
    grunt.registerTask('default', [
      'jshint:dev',
      'compass:dev',
      'livereload-start',
      'server',
      'regarde'
    ]);

    // Build
    grunt.registerTask('build', [
      'clean:build',
      'jshint:build',
      'compass:build',
      'useminPrepare',
      'requirejs',
      'imagemin',
      'cssmin',
      'htmlmin',
      'concat',
      'uglify',
      'copy',
      'usemin'
    ]);

    // Server
    grunt.registerTask('server', 'connect:server');
  };
}());