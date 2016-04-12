var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var Server = require('karma').Server;

gulp.task('connect', function () {
    connect.server({
        root: '',
        port: 4000
    })
})

gulp.task('build', function() {
    // Grabs the app.js file
    return browserify('./js/app.js')
        // bundles it and creates a file called build.js
        .bundle()
        .pipe(source('build.js'))
        // saves it the js/ directory
        .pipe(gulp.dest('./js/'));
})

gulp.task('watch', function() {
    gulp.watch(['js/**/*.js', '!js/**/build.js'], { interval: 500 }, ['build'])
})

gulp.task('test', function() {
    //Creates local server, runs mocha tests, then exits process (therefore killing server)
    connect.server({
        root: '',
        port: 4000
    });
    return gulp.src('./test/serverTests.js').pipe(mocha())
    .once('end', function () {
        return new Server({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }).start()
    });
})

gulp.task('default', ['connect', 'watch'])