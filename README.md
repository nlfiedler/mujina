# Mujina

The Electron-based desktop interface to the tanuki backend.

## Prerequisites

* Tanuki backend must be running somewhere

## Getting Started

```shell
$ npm install -g gulp-cli
$ npm install
$ ./node_modules/.bin/electron-rebuild
$ npm test
$ npm start
```

## Building Native Modules

For modules such as [sharp](https://github.com/lovell/sharp) that have native
code, use the `electron-rebuild` module to rebuild the modules for the version
of Node included with Electron.
