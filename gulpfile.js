var gulp = require('gulp')
var connect = require('gulp-connect')
var browserify = require('browserify')
var source = require('vinyl-source-stream')

gulp.task('connect', function () {
    connect.server({
        root: '',
        port: 4000
    })
})

gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('./js/app.js')
        // bundles it and creates a file called build.js
        .bundle()
        .pipe(source('build.js'))
        // saves it the js/ directory
        .pipe(gulp.dest('./js/'));
})