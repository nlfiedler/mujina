//
// Copyright (c) 2018 Nathan Fiedler
//
const url = require('url')
const Store = require('electron-store')

// Set the defaults in one place. This is used to know what options are
// available, and other options will be ignored if not defined here.
const defaults = {
  backend_host: 'localhost',
  backend_port: 3000
}

const store = new Store({ defaults })

/**
 * Construct and return a URL-formatted string for making a request to
 * the server backend, based on the current configuration.
 *
 * @param {Object} options - options passed directly to url.format()
 * @param {String} options.pathname - URL path, defaults to ''
 * @param {String} options.search - URL search (sans ?), defaults to ''
 */
function serverUrl ({ pathname = '', search = '' } = {}) {
  const hostname = store.get('backend_host')
  const port = store.get('backend_port')
  return url.format({
    protocol: 'http:',
    hostname,
    port,
    pathname,
    search
  })
}

/**
 * Return an object that represents the various settings, with their current
 * values. Useful for the configuration page.
 *
 * @return {Object} copy of the config settings in a relatively flat object.
 */
function getOptions () {
  const result = {}
  for (let prop in defaults) {
    result[prop] = store.get(prop)
  }
  return result
}

/**
 * Set the options according to the given object. Only those options defined
 * internally will be persisted.
 *
 * @param {Object} options new option values.
 */
function setOptions (options) {
  for (let prop in defaults) {
    store.set(prop, options[prop])
  }
}

module.exports = {
  getOptions,
  setOptions,
  serverUrl
}
