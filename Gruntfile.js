module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
        
            dist: {
                src: [
                    'src/js/JiNGle.js',
                    'src/js/interceptors/HttpInterceptor.js',
                    'src/js/directives/BreadcrumbsDirective.js',
                    'src/js/directives/FieldDirective.js',
                    'src/js/directives/FormDirective.js',
                    'src/js/directives/ServerTable.js',
                    'src/js/directives/TableDirective.js',
                    'src/js/filters/checkmarks.js',
                    'src/js/filters/i18n.js',
                    'src/js/filters/inline.js',
                    'src/js/filters/range.js'
                ],
          
                dest: 'dist/js/JiNGle.js'
            }
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            },

            js: {
                src: [
                    'dist/js/JiNGle.js'
                ],
                dest: 'dist/js/JiNGle.min.js'
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/views/BreadcrumbsDirective.html': 'src/views/BreadcrumbsDirective.html',
                    'dist/views/FieldDirective.html': 'src/views/FieldDirective.html',
                    'dist/views/FormDirective.html': 'src/views/FormDirective.html',
                    'dist/views/ServerTableDirective.html': 'src/views/ServerTableDirective.html',
                    'dist/views/TableDirective.html': 'src/views/TableDirective.html'
                }
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/css',
                        src: [ '*.css' ],
                        dest: 'dist/css',
                        ext: '.min.css'
                    }
                ]
            }
        },

        jsonmin: {
            dev: {
                options: {
                    stripWhitespace: true,
                    stripComments: true
                },

                files: {
                    "dist/data/i18n-en.json" : "src/data/i18n-en.json"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-jsonmin');

    grunt.registerTask('default', ['concat', 'uglify', 'htmlmin', 'cssmin', 'jsonmin']);
};
