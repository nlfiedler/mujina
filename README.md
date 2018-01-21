# Mujina

The Electron-based desktop interface to the tanuki backend.

## Prerequisites

* [Electron](https://electron.atom.io/)
* Tanuki backend must be running at `localhost:3000` (for now)

## Getting Started

```shell
$ npm install
$ ./node_modules/.bin/electron-rebuild
$ npm test
$ npm start
```

## Building Native Modules

For modules such as [sharp](https://github.com/lovell/sharp) that have native
code, use the `electron-rebuild` module to rebuild the modules for the version
of Node included with Electron.
