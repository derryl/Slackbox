'use strict';

var path = require('path');

module.exports = function(grunt) {

    var g = grunt;

    var config = {
        dirs: {
            src:   'app',   // source files
            temp:  'temp',  // temporary dir (deleted after each build)
            local: 'local', // local builds (quick processing, no minification)
            dist:  'dist'   // production-ready builds (more processing, takes longer)
        },
        server: {
            port: 8797
        }
    };

    var _src    = config.dirs.src;
    var _temp   = config.dirs.temp;
    var _local  = config.dirs.local;
    var _dist   = config.dirs.dist;
    var _port   = config.server.port;

    grunt.initConfig({

        _src  : _src,  
        _temp : _temp, 
        _local: _local,
        _dist : _dist, 
        _port : _port, 

        clean: {
            all:  ['local','temp','dist'],
            temp: ['temp'],
            dist: ['dist']
        },

        copy: {
            // Copy files into /temp for processing
            temp: {
                files: [{ 
                  expand: true,
                  cwd:  _src,
                  src:  ['views/**','images/**','favicon.ico','vendor/**/*'], 
                  dest: _temp
                }]
            },
            // Copy built files into /local for viewing
            local: {
                files: [
                    { expand: true, cwd: _src+'/views',   src: ['*'], dest: _local },
                    // { expand: true, cwd: _temp+'/scripts', src: ['**.coffee'], dest: _local+'/scripts' },
                    { expand: true, cwd: _src+'/scripts', src: ['**/*js'], dest: _local+'/scripts' },
                    { expand: true, cwd: _src+'/fonts',   src: ['*'], dest: _local+'/fonts' },
                    { expand: true, cwd: _src+'/images',   src: ['*'], dest: _local+'/images' },
                    // { expand: true, cwd: _temp+'/styles',  src: ['**/*'], dest: _local+'/styles' },
                    // { expand: true, cwd: _src+'/vendor',   src: ['*'], dest: _local+'/vendor' }
                ]
            },
            views: {
                files: [{ expand: true, cwd: _src + '/views', src: ['*.html'], dest: _local }]
            }
        },


        // Serve /local on specified default port
        connect: {
            server: {
                options: {
                    port: _port,
                    base: 'local',
                    hostname: '*'
                }
            }
        },

        concat: {
            bower: {
                files: { 'temp/vendor/bower_components.js': [
                    'bower_components/jquery/dist/jquery.js',
                    // 'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/underscore/underscore.js',
                    // 'bower_components/underscore/underscore-min.js',
                    'bower_components/backbone/backbone.js',
                    // 'bower_components/backbone/backbone-min.js',
                    // 'bower_components/rivets/dist/rivets.bundled.min.js'
                ]}
            },
            app: {
                files: { 'local/scripts/app.js': [
                    _temp + '/vendor/bower_components.js',
                    _temp + '/scripts/app.js',
                ]}
            }
        },

        // Whenever a source file changes,
        // kick off a dev build and trigger LiveReload
        watch: {
            grunt: { 
                files: ['Gruntfile.js']
            },
            html: {
                files: [ _src + '/**/*.html'],
                tasks: [ 'copy:views' ],
                options: { livereload: true }
            },
            coffee: {
                files: [ _src + '/scripts/*.coffee', _src + '/vendor/**/*' ],
                tasks: [ 'compileJS' ]
            },
            js: {
                files: [ _src + '/scripts/**/*.js' ],
                tasks: [ 'copy:local' ]
            },
            less: {
                files: [ _src + '/styles/**/*.less'],
                tasks: ['less:dev']
            },
            // media: {
            //     files: [ _src + '/images/**/*', _src + '/**/*.js'],
            //     tasks: [ 'newer:copy:local' ],
            //     options: { livereload: true }
            // },
            local: {
                files: [ _local + '/**/*' ],
                options: { livereload: true }
            }
        },

        // Styles compile to: /styles/master.css
        less: {
            dev: {
                files: [{ 'local/styles/master.css': 'app/styles/master.less' }]
            }
        },

        // Coffee compiles to: /scripts/*
        coffee: {
            dev: {
                options: { 
                    bare: true,
                    join: true
                },
                files: { 'temp/scripts/app.js': [ 
                    _src+'/scripts/helpers.coffee',
                    _src+'/scripts/routes.coffee',
                    _src+'/scripts/api.coffee',
                    _src+'/scripts/ui.coffee',
                    _src+'/scripts/app.coffee'
                ]}
            }
        },

        shell: {
            launchBrowser: {
                command: 'open http://0.0.0.0:' + _port
            }
        }
    });

    // Load required Grunt modules
    [
        'grunt-contrib-connect',
        'grunt-contrib-concat',
        'grunt-contrib-coffee',
        'grunt-contrib-clean',
        'grunt-contrib-watch',
        'grunt-contrib-less',
        'grunt-contrib-copy',
        'grunt-shell',
        'grunt-newer'
        
    ].map( grunt.loadNpmTasks );

    // Define our tasks
    grunt.registerTask('build', [
        'clean:all',
        'copy:temp',
        'less:dev',
        'concat:bower',
        'coffee:dev',
        'concat:app',
        'copy:local',
        // 'clean:temp'
    ]);

    grunt.registerTask( 'compileJS', [
        'copy:temp',
        'concat:bower',
        'coffee:dev',
        'concat:app',
        'copy:local'
    ]);

    grunt.registerTask( 'server',  [
        'connect',
        'watch'
    ]);
    
    grunt.registerTask( 'default', [
        'build',
        'shell:launchBrowser',
        'server'
    ]);

};