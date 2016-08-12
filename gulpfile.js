'use strict';

var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

// Shortcut paths to locate js and sass files
var paths = {
  sass: ['./src/scss/**/*.scss'],
  js: ['./src/js/**/*.js']
};

// Default Task
// Running the default task will create the dist js and css files, which are referenced in index.html
gulp.task('default', ['sass', 'scripts', 'watch']);

// Sass compiler
gulp.task('sass', function(done) {
  gulp.src('./src/scss/main.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./dist/css/'))
    .on('end', done);
});

// The scripts task bundles www/js/app.js with all variables - and their respective dependancies - declared at the top of it's page.
// The resulting app.js file is piped to dist/js, along with a minified version (app.min.js), which is referenced in index.html.
gulp.task('scripts', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js/'))
});

// The Watch task looks for any changes to the js and css files in www, then recompiles the .min scripts in dist.
gulp.task('watch', function() {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['scripts']);
});