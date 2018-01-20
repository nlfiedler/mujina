//
// Copyright (c) 2017 Nathan Fiedler
//
const url = require('url')
const Store = require('electron-store')

const configStore = new Store()
const hostname = configStore.get('backend.host', 'localhost')
const port = configStore.get('backend.port', 3000)

/**
 * Construct and return a URL-formatted string for making a request to
 * the server backend, based on the current configuration.
 *
 * @param {Object} options - options passed directly to url.format()
 * @param {String} options.pathname - URL path, defaults to ''
 * @param {String} options.search - URL search (sans ?), defaults to ''
 */
exports.serverUrl = ({pathname = '', search = ''} = {}) => {
  return url.format({
    protocol: 'http:',
    hostname,
    port,
    pathname,
    search
  })
}
