/* global require, module */

'use strict';

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      dest: 'dist'
    },

    meta: {
      banner: '/**\n' +
      ' * <%= pkg.description %>\n' +
      ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n'
    },

    //
    // Configuring grunt helpers
    //

    clean: ['<%= dirs.dest %>'],

    concat: {  // grunt-contrib-concat
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['src/*.js'],
        dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
      }
    },

    connect: {  // grunt-contrib-connect
      dev: {
        options: {
          port: 9999,
          hostname: '0.0.0.0',
          base: '.',
          keepalive: true
        }
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          flatten: true,
          src: ['src/*.html'],
          dest: '<%= dirs.dest %>/',
          filter: 'isFile'
        }]
      }
    },

    cssmin: {  // grunt-contrib-cssmin
      combine: {
        files: {
          '<%= dirs.dest %>/<%= pkg.name %>.min.css': ['src/*.css']
        }
      }
    },

    jshint: {  // grunt-contrib-jshint
      all: ['Gruntfile.js', 'src/*.js', 'test/unit/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    karma: {  // grunt-karma
      single: {
        configFile: 'test/karma-unit.conf.js',
        singleRun: true
      }
    },

    ngmin: {  // grunt-ngmin
      dist: {
        files: [{
          expand: true,
          cwd: '<%= dirs.dest %>',
          src: '*.js',
          dest: '<%= dirs.dest %>'
        }]
      }
    },

    open: {  // grunt-open
      demo: {
        path: 'http://localhost:9999/demo'
      }
    },

    uglify: {  // grunt-contrib-uglify
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= dirs.dest %>/<%= pkg.name %>.js'],
        dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
      }
    },

    watch: {  // grunt-contrib-watch
      src: {
        files: ['src/*.js', 'src/*.css'],
        tasks: ['test'],
      }
    }
  });


  //
  // Grunt tasks.
  //

  // Default task.
  grunt.registerTask('default', [
    'clean',
    'build',
    'run'
  ]);

  // Test task.
  grunt.registerTask('test', [
    'jshint:all',
    'karma:single'
  ]);

  // Build task.
  grunt.registerTask('build', [
    'test',
    'concat',
    'ngmin',
    'uglify',
    'cssmin',
    'copy'
  ]);

  // Run dev server.
  grunt.registerTask('run', [
    'open:demo',
    'connect:dev'
  ]);
};
