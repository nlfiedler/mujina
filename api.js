//
// Copyright (c) 2017 Nathan Fiedler
//
// using node's http instead of electron's net for sake of using nock
const http = require('http')
// const Store = require('electron-store')
// const configStore = new Store()

/**
 * Call the backend to get the available tags.
 *
 * @return {Promise<Array>} of tags.
 */
function fetchTags () {
  return new Promise((resolve, reject) => {
    const request = http.request({
      method: 'GET',
      // hostname: configStore.get('backend.host', 'localhost'),
      // port: configStore.get('backend.port', 3000),
      hostname: 'localhost',
      port: 3000,
      path: '/api/tags'
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

module.exports = {
  fetchTags
}
