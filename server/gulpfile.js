var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    gutil = require('gulp-util');

gulp.task('script', function() {
    gutil.log(gutil.colors.green('开始压缩 JS'));
    gulp.src('views/normal/js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('views/js'))
})

gulp.task('css', function () {
    gutil.log(gutil.colors.green('开始压缩 CSS'));
    gulp.src('views/normal/css/*.css')
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('views/css'))
})


gulp.task('clean', function(cb) {
    del(['views/css', 'views/js'], cb)
});
gulp.task('default', function () {
    gutil.log(gutil.colors.green('Watch JS & CSS ') + 'Success');
    gulp.watch('views/normal/css/*.css', ['css']);
    gulp.watch('views/normal/js/*.js', ['script']);
})

gulp.task('build', ['clean', 'script', 'css']);