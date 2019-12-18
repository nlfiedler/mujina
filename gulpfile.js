//
// Copyright (c) 2019 Nathan Fiedler
//
const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')

function compileReact () {
  return gulp.src([
    'src/components/**/*.js'
  ], { base: 'src' })
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('app'))
}

function copyScripts () {
  return gulp.src([
    'src/**/*.js',
    '!src/components/**'
  ], { base: 'src' })
    .pipe(gulp.dest('app'))
}

function copyAssets () {
  return gulp.src([
    'assets/**/*.css',
    'assets/**/*.html',
    'assets/webfonts/**/*',
    'assets/images/**/*'
  ], { base: 'assets' })
    .pipe(gulp.dest('app'))
}

function clean () {
  return del(['app', 'build', 'dist'])
}

exports.clean = clean
exports.build = gulp.series(compileReact, copyScripts, copyAssets)
exports.default = exports.build
