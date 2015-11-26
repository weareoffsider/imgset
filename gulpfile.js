var gulp         = require('gulp'),
    less         = require('gulp-less'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer')

var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");


var SRC_DIR = './test/src',
    DEST_DIR = './test/www'
    
    
gulp.task('js', function() {
  browserify(SRC_DIR + '/app.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(fs.createWriteStream(DEST_DIR + "/app.js"));
})


gulp.task('move', function() {
  gulp.src([
    SRC_DIR + '/index.html',
    SRC_DIR + '/*.jpg'
  ])
    .pipe(gulp.dest(DEST_DIR))
})


gulp.task('less', function() {
  gulp.src(SRC_DIR + '/app.less')
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
  gulp.start('move')
})


gulp.task('watch', function() {
  gulp.watch(['./imgset.less', SRC_DIR + '/app.less'], ['less'])
  gulp.watch(['./imgset.js', SRC_DIR + '/app.ls'], ['js'])
  gulp.watch([SRC_DIR + '/index.html'], ['move'])
})


// @TODO add clean task 

gulp.task('default', [], function() {
  gulp.start('build', 'watch')
})
