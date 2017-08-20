module.exports = function(grunt) {

    var githubDirPath = 'components/github/';
    var htmlDirPath = 'components/html/';
    var scgDirPath = 'components/scg/';
    var scsDirPath = 'components/scs/';
    var webCoreCompPath = 'client/js/';
    var clientJsDirPath = 'client/static/components/js/';
    var clientCssDirPath = 'client/static/components/css/';
    var clientHtmlDirPath = 'client/static/components/html/';
    var clientImgDirPath = 'client/static/components/images/';
    var files = require('./modules/all-files.js').files;
    grunt.initConfig({
        concat: {
            webcore: {
                src: files.webcore,
                dest: './build/concat.js' //clientJsDirPath + 'sc-web-core.js'
            },
            github: {
                src: [githubDirPath + 'src/*.js'],
                dest: githubDirPath + 'static/components/js/github/github.js'
            },
            html: {
                src: [htmlDirPath + 'src/*.js'],
                dest: htmlDirPath + 'static/components/js/html/html.js'
            },
            scg: {
                src: files.scg,
                dest: scgDirPath + 'static/components/js/scg/scg.js'
            },
            scs: {
                src: files.scs,
                dest: scsDirPath + 'static/components/js/scs/scs.js'
            },
            bundle: {
                src: ["build/concat.js",
                    "build/eekbPanel.bundle.js"
                ],
                dest: clientJsDirPath + 'sc-web-core.js'
            }
        },
        copy: {
            githubJs: {
                cwd: githubDirPath + 'static/components/js/github/',
                src: 'github.js',
                dest: clientJsDirPath + 'github/',
                expand: true,
                flatten: true
            },
            htmlJs: {
                cwd: htmlDirPath + 'static/components/js/html/',
                src: 'html.js',
                dest: clientJsDirPath + 'html/',
                expand: true,
                flatten: true
            },
            scgJs: {
                cwd: scgDirPath + 'static/components/js/scg/',
                src: 'scg.js',
                dest: clientJsDirPath + 'scg/',
                expand: true,
                flatten: true
            },
            scsJs: {
                cwd: scsDirPath + 'static/components/js/scs/',
                src: 'scs.js',
                dest: clientJsDirPath + 'scs/',
                expand: true,
                flatten: true
            },
            githubCss: {
                cwd: githubDirPath + 'static/components/css/',
                src: 'github.css',
                dest: clientCssDirPath,
                expand: true,
                flatten: true
            },
            htmlCss: {
                cwd: htmlDirPath + 'static/components/css/',
                src: 'html.css',
                dest: clientCssDirPath,
                expand: true,
                flatten: true
            },
            scgCss: {
                cwd: scgDirPath + 'static/components/css/',
                src: 'scg.css',
                dest: clientCssDirPath,
                expand: true,
                flatten: true
            },
            scsCss: {
                cwd: scsDirPath + 'static/components/css/',
                src: 'scs.css',
                dest: clientCssDirPath,
                expand: true,
                flatten: true
            },
            scgHtml: {
                cwd: scgDirPath + 'static/components/html/',
                src: ['**/*.html'],
                dest: clientHtmlDirPath,
                expand: true,
                flatten: true
            },
            htmlImg: {
                cwd: htmlDirPath + 'static/components/images/html/',
                src: '**/*.png',
                dest: clientImgDirPath + 'html/',
                expand: true,
                flatten: true
            },
            scgImg: {
                cwd: scgDirPath + 'static/components/images/scg/',
                src: '*.png',
                dest: clientImgDirPath + 'scg/',
                expand: true,
                flatten: true
            },
            scgImgAlphabet: {
                cwd: scgDirPath + 'static/components/images/scg/alphabet/',
                src: '*.png',
                dest: clientImgDirPath + 'scg/alphabet',
                expand: true,
                flatten: true
            }
        },
        watch: {
            core: {
                files: webCoreCompPath + '**',
                tasks: ['concat:webcore'],
            },
            githubJs: {
                files: githubDirPath + 'src/**',
                tasks: ['concat:github', 'copy:githubJs'],
            },
            htmlJs: {
                files: htmlDirPath + 'src/**',
                tasks: ['concat:html', 'copy:htmlJs'],
            },
            scgJs: {
                files: scgDirPath + 'src/**',
                tasks: ['concat:scg', 'copy:scgJs'],
            },
            scsJs: {
                files: scsDirPath + 'src/**',
                tasks: ['concat:scs', 'copy:scsJs'],
            },
            githubCss: {
                files: githubDirPath + 'static/components/css/**',
                tasks: ['copy:githubCss'],
            },
            htmlCss: {
                files: htmlDirPath + 'static/components/css/**',
                tasks: ['copy:htmlCss'],
            },
            scgCss: {
                files: scgDirPath + 'static/components/css/**',
                tasks: ['copy:scgCss'],
            },
            scsCss: {
                files: scsDirPath + 'static/components/css/**',
                tasks: ['copy:scsCss'],
            },
            scgHtml: {
                files: [scgDirPath + 'static/components/html/**'],
                tasks: ['copy:scgHtml'],
            },
            htmlImg: {
                files: [htmlDirPath + 'static/components/images/html/**', ],
                tasks: ['copy:htmlImg'],
            },
            scgImg: {
                files: [scgDirPath + 'static/components/images/scg/**'],
                tasks: ['copy:scgImg', 'copy:scgImgAlphabet'],
            },
        },
        exec: {
            webpack: {
                command: "node ./node_modules/webpack/bin/webpack.js"
            },
            "dev-html": {
                command: "node modules/create-html.js dev client/templates/components.html"
            },
            "single-scg": {
                command: "node modules/create-single.js components/scg/scg.html"
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['concat', 'copy', 'concat:bundle', "exec:dev-html"]);

    grunt.registerTask('single-scg', ["exec:single-scg"]);
};