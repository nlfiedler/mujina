//
// Copyright (c) 2017 Nathan Fiedler
//
// using node's http instead of electron's net for sake of using nock
const http = require('http')
const Store = require('electron-store')
const configStore = new Store()

/**
 * Call the backend to get the given list of attributes.
 *
 * @return {Promise<Array>} of attributes.
 */
function fetchAttributes (key) {
  return new Promise((resolve, reject) => {
    const request = http.request({
      method: 'GET',
      hostname: configStore.get('backend.host', 'localhost'),
      port: configStore.get('backend.port', 3000),
      path: '/api/' + key
    })
    request.on('response', (response) => {
      let rawData = ''
      response.on('data', (chunk) => {
        rawData += chunk
      })
      response.on('end', () => {
        resolve(JSON.parse(rawData))
      })
    })
    request.on('error', reject)
    request.end()
  })
}

exports.fetchTags = () => {
  return fetchAttributes('tags')
}

exports.fetchYears = () => {
  return fetchAttributes('years')
}

exports.fetchLocations = () => {
  return fetchAttributes('locations')
}
