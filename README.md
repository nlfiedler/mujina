# Mujina

The Electron-based desktop interface to the tanuki backend.

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

These binaries are quite large, so the `package.json` excludes the files for
platforms other than the one being built. That is, the NPM module contains all
of the binaries for each platform and architecture. While electron-builder is
pretty clever, and keeps those files unpacked, it does not exclude all of the
other platforms automatically.
