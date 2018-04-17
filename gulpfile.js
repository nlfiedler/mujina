//
// Copyright (c) 2017 Nathan Fiedler
//
const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')

const reactSrc = [
  'app/components/**/*.js'
]
const scriptSrc = [
  'app/**/*.js',
  'app/package.json',
  '!app/components/**'
]
const assetSrc = [
  'assets/**/*.css',
  'assets/**/*.html',
  'assets/webfonts/**/*',
  'assets/images/**/*'
]

gulp.task('compile:react', () => {
  return gulp.src(reactSrc, {base: 'app'})
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('build'))
})

gulp.task('copy:scripts', () => {
  return gulp.src(scriptSrc, {base: 'app'})
    .pipe(gulp.dest('build'))
})

gulp.task('copy:assets', () => {
  return gulp.src(assetSrc, {base: 'assets'})
    .pipe(gulp.dest('build'))
})

gulp.task('clean', () => {
  return del(['build'])
})

gulp.task('build', [
  'compile:react',
  'copy:scripts',
  'copy:assets'
])

gulp.task('default', ['build'])
