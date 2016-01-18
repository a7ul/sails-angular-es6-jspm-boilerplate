'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var htmlreplace = require('gulp-html-replace');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var watch = require('gulp-watch');

var options = {
  src: './',
  dest: '../assets/public/'
};

gulp.task('live-reload', ['inject-css'], browserSync.reload);

gulp.task('inject-css', function() {
  var target = gulp.src(options.src + 'index.html');
  var sources = gulp.src([options.src + 'styles/**/*.css'], {
    read: false
  });
  return target.pipe(inject(sources))
    .pipe(gulp.dest(options.src));
});

gulp.task('serve', ['inject-css'], function() {
  browserSync.init({
    server: {
      baseDir: options.src
    }
  });

  var filesToWatch = [
    options.src + 'assets/**/*',
    options.src + 'views/**/*',
    options.src + 'scripts/**/*',
    options.src + 'styles/**/*',
    'config.js'
  ];

  watch(filesToWatch, function(data) {
    console.log('Files changed : ', data.toString().slice(0,20));
    gulp.start('live-reload');
    console.log('Done ! ');
  });

});


//===================== BUILD GULP TASKS =======================

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
    .pipe(clean({
      force:true
    }));
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
