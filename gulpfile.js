var gulp         = require('gulp'),
    less         = require('gulp-less'),
    browserify   = require('gulp-browserify'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer')


var SRC_DIR = '.',
    DEST_DIR = './dest'
    
    
gulp.task('js', function() {
  gulp.src([
    'srcset.js'
  ])
  // .pipe(plumber(plumberErrorHandler))
  .pipe(browserify({
    debug: true
  }))
  .pipe(gulp.dest(DEST_DIR))
})


gulp.task('test', function() {
  gulp.src([
    'test/app.js'
  ])
  // .pipe(plumber(plumberErrorHandler))
  .pipe(browserify({
    debug: true
  }))
  .pipe(gulp.dest(DEST_DIR))
})


gulp.task('less', function() {
  gulp.src([
    'srcset.less',
  ])
  // .pipe(plumber(plumberErrorHandler))
  .pipe(less({
    strictMath: true,
  }))
  .pipe(postcss([
    autoprefixer()
  ]))
  .pipe(gulp.dest(DEST_DIR))
})


gulp.task('build', function() {
  gulp.start('less')
  gulp.start('js')
})


gulp.task('watch', function() {
  gulp.watch('srcset.less', ['less'])
  gulp.watch('srcset.js', ['js'])
  gulp.watch(['test/app.js', 'srcset.js'], ['test'])
})


// @TODO add clean task 

gulp.task('default', [], function() {
  gulp.start('build', 'watch')
})
