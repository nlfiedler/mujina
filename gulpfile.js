//
// Copyright (c) 2018 Nathan Fiedler
//
const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')

const reactSrc = [
  'src/components/**/*.js'
]
const scriptSrc = [
  'src/**/*.js',
  '!src/components/**'
]
const assetSrc = [
  'assets/**/*.css',
  'assets/**/*.html',
  'assets/webfonts/**/*',
  'assets/images/**/*'
]

gulp.task('compile:react', () => {
  return gulp.src(reactSrc, { base: 'src' })
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('app'))
})

gulp.task('copy:scripts', () => {
  return gulp.src(scriptSrc, { base: 'src' })
    .pipe(gulp.dest('app'))
})

gulp.task('copy:assets', () => {
  return gulp.src(assetSrc, { base: 'assets' })
    .pipe(gulp.dest('app'))
})

gulp.task('clean', () => {
  return del(['app', 'build', 'dist'])
})

gulp.task('default', gulp.series('compile:react', 'copy:scripts', 'copy:assets'))
