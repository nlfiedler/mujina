# Mujina

This was an attempt at an [Electron](https://www.electronjs.org)-based front-end to the [tanuki](https://github.com/nlfiedler/tanuki) backend. It was started in 2017 and abandoned in 2020 when the [Flutter](https://flutter.dev) web interface as added to tanuki. This project likely will not build properly any more, nor function correctly with the latest versions of tanuki.

## Prerequisites

* [Node.js](https://nodejs.org/) LTS
* Tanuki backend must be running somewhere

## Getting Started

```shell
$ npm install -g gulp-cli
$ npm install
$ npm test
$ npm start
```

## Packaging

### Static ffmpeg and ffprobe

These binaries are quite large, so the `package.json` excludes the files for platforms other than the one being built. That is, the NPM module contains all of the binaries for each platform and architecture. While electron-builder is pretty clever, and keeps those files unpacked, it does not exclude all of the other platforms automatically.
