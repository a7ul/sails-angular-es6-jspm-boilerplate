'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var htmlreplace = require('gulp-html-replace');

var options = {
  src: './',
  dest: 'dist/'
};

gulp.task('css', ['clean'], function() {
  gulp.src(options.src + 'styles/**/*.css')
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(options.dest + 'styles'));
});

gulp.task('jspmBundle', ['clean'], shell.task('node_modules/.bin/jspm bundle-sfx ' + options.src + 'scripts/app.js ' + options.dest + '/scripts/script.min.js --minify --skip-source-maps'));

gulp.task('clean', function() {
  return gulp.src(options.dest, {
      read: false
    })
    .pipe(clean());
});

gulp.task('copy', ['clean'], function() {
  var filesToMove = [
    options.src + 'assets/**/*',
    options.src + 'views/**/*',
  ];
  gulp.src(filesToMove, {
      base: options.src
    })
    .pipe(gulp.dest(options.dest));
});

gulp.task('replace-scripts-and-styles', ['clean'], function() {
  gulp.src('index.html')
    .pipe(htmlreplace({
      'css': 'styles/style.min.css',
      'js': 'scripts/script.min.js'
    }))
    .pipe(gulp.dest(options.dest));
});

gulp.task('build', [
  'clean',
  'css',
  'jspmBundle',
  'copy',
  'replace-scripts-and-styles'
]);
