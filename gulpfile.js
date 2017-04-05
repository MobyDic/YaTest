var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var server = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');


gulp.task('less', function () {
  return gulp.src('./less/style.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(server.stream());
});



gulp.task('serve', ['less'], function() {
  server.init({
    server: '.',
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch('less/**/*.less', ['less']);
  gulp.watch('*.html').on('change', server.reload);
});
