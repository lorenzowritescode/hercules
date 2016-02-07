﻿var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var webpackDevConfig = require('./webpack.dev.config.js'),
    webpackDistConfig = require('./webpack.config.js');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // Read configuration from package.json
    var pkgConfig = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkgConfig,

        webpack: {
            options: webpackDistConfig,
            dist: {
                cache: false
            }
        },

        'webpack-dev-server': {
            options: {
                hot: true,
                port: 8000,
                webpack: webpackDevConfig,
                publicPath: '/assets/',
                contentBase: './<%= pkg.src %>/'
            },

            start: {
                keepAlive: true
            }
        },

        connect: {
            options: {
                port: 8000
            },

            dist: {
                options: {
                    keepalive: true,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, pkgConfig.dist)
                        ];
                    }
                }
            }
        },

        open: {
            options: {
                delay: 500
            },
            dev: {
                path: 'http://localhost:<%= connect.options.port %>/webpack-dev-server/'
            },
            dist: {
                path: 'http://localhost:<%= connect.options.port %>/'
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= pkg.src %>/*.html'],
                        dest: '<%= pkg.dist %>',
                        filter: 'isFile'
                    }
                ]
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= pkg.dist %>'
                    ]
                }]
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:dist', 'connect:dist']);
        }

        grunt.task.run([
            'webpack-dev-server'
        ]);
    });

    grunt.registerTask('test', ['karma']);

    grunt.registerTask('build', [ 'clean', 'copy', 'webpack']);

    grunt.registerTask('default', ['serve']);
};
