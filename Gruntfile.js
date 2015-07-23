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
            port: 8797,
            base: '127.0.0.1'
        }
    };

    var _src    = config.dirs.src;
    var _temp   = config.dirs.temp;
    var _local  = config.dirs.local;
    var _dist   = config.dirs.dist;
    var _port   = config.server.port;
    var _base   = config.server.base;

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
            // temp: {
            //     files: [{ 
            //       expand: true,
            //       cwd:  _src,
            //       src:  ['views/**','images/**','favicon.ico','vendor/**/*'], 
            //       dest: _temp
            //     }]
            // },
            // Copy built files into /local for viewing
            local: {
                files: [{ 
                    expand: true,
                    cwd: _src, 
                    src: [
                        '**/*',
                        '!**/*.less'
                    ],
                    dest: _local 
                }]
            },
            scripts: { files: [{ src: ['**/*.js'], expand: true, cwd: _src, dest: _local }]},
            views:   { files: [{ src: ['**/*.html'], expand: true, cwd: _src, dest: _local }]}
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
                files: ['Gruntfile.js'],
                tasks: ['build']
            },
            html: {
                files: [ _src + '/**/*.html'],
                tasks: [ 'copy:views', 'includes:html' ],
                options: { livereload: true }
            },
            js: {
                files: [ _src + '/scripts/**/*.js' ],
                tasks: [ 'copy:scripts' ],
                // options: { livereload: true }
            },
            less: {
                files: [ _src + '/styles/**/*.less'],
                tasks: [ 'less:dev' ]
            },
            // media: {
            //     files: [ _src + '/images/**/*', _src + '/**/*.js'],
            //     tasks: [ 'newer:copy:local' ],
            //     options: { livereload: true }
            // },
            local: {
                files: [ _local + '/**/*' ],
                options: { livereload: true }
            },
            localHTML: {
                files: [ _src + '/styles/**/*.less', _src + '/partials/**/*' ],
                tasks: [ 'less:dev' ,'includes:html' ],
                options: { livereload: true }
            },
            misc: {
                files: [ 
                    _src+'/fixtures/**/*',
                    _src+'/fonts/**/*',
                    _src+'/images/**/*',
                ],
                tasks: ['newer:copy:local']
            }
        },

        // Styles compile to: /styles/master.css
        less: {
            dev: {
                files: [
                    { 'local/styles/master.css': 'app/styles/master.less' },
                    { 'local/styles/_loader.css': 'app/styles/___loader.less' }
                ]
            }
        },
        
        includes: {
            html: {
                options: {
                    includeRegExp: /^\/\/\s*include\s+['"]?([^'"]+)['"]?\s*$/,
                    duplicates: false,
                    // debug: true,
                    silent: true
                },
                files: [{
                    expand: true,
                    cwd: _local,
                    src: '**/*.html',
                    dest: _local
                }]
            }
        },

        shell: {
            launchBrowser: { command: 'open http://'+ _base +':'+ _port }
        }
    });

    // Load required Grunt modules
    [
        'grunt-contrib-connect',
        'grunt-contrib-concat',
        'grunt-contrib-clean',
        'grunt-contrib-watch',
        'grunt-contrib-less',
        'grunt-contrib-copy',
        'grunt-includes',
        'grunt-shell',
        'grunt-newer'
        
    ].map( grunt.loadNpmTasks );

    // Define our tasks
    grunt.registerTask( 'build', [
        'clean:all',
        'copy:local',
        'less:dev',
        'includes:html'
        // 'concat:app',
        // 'copy:local',
        // 'clean:temp'
    ]);

    grunt.registerTask( 'server',  [
        'connect',
        'watch'
    ]);
    
    grunt.registerTask( 'default', [
        'build',
        // 'shell:launchBrowser',
        'server'
    ]);

};