//
// Copyright (c) 2019 Nathan Fiedler
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

function compileReact () {
  return gulp.src(reactSrc, { base: 'src' })
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('app'))
}

function copyScripts () {
  return gulp.src(scriptSrc, { base: 'src' })
    .pipe(gulp.dest('app'))
}

function copyAssets () {
  return gulp.src(assetSrc, { base: 'assets' })
    .pipe(gulp.dest('app'))
}

function clean () {
  return del(['app', 'build', 'dist'])
}

exports.clean = clean
exports.default = gulp.series(compileReact, copyScripts, copyAssets)
