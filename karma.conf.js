// Karma configuration
// Generated on Wed Apr 06 2016 15:02:16 GMT+0100 (GMT Summer Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/quick_check/dist/quick-check.js',
      //'js/build.js',
      {pattern: 'js/directives/*.html', included: true},
      //{pattern: 'js/external/*.js', included: true},
      //{pattern: 'json/*', included: true},
      //{pattern: 'images/*', included: true},
      {pattern: 'css/*', included: true},
      'index.html',
      'js/directives/*.html',
      
      //UNCOMMENT FOR HTML CODE COVERAGE
      //'js/app.js',
      'js/build.js',


      'test/defaultsService.js',
      'test/mainController.js',
      'test/simulationDirective.js',
      'test/integrationTests.js',
      'test/propertyTests.js'
    ],


    // list of files to exclude
    exclude: [
      'js/external/physijs_worker.js'   //Not excluding this causes a test failure, do I need it for the tests?
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'index.html': ['ng-html2js'],
      'js/directives/*.html': ['ng-html2js'],

      //UNCOMMENT FOR HTML CODE COVERAGE
      //'js/app.js' : ['coverage', 'browserify'],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    
    //UNCOMMENT FOR HTML CODE COVERAGE
    //reporters: ['spec', 'coverage'],
    reporters: ['spec'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'Firefox'],

    browserify: {
      debug: true,
      transform: ['browserify-istanbul']
    },

    //UNCOMMENT FOR HTML CODE COVERAGE
    /*coverageReporter: {
      type : 'html',
      dir : 'test/coverage/'
    },*/

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
