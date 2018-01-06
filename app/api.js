//
// Copyright (c) 2017 Nathan Fiedler
//
const crypto = require('crypto')
const Store = require('electron-store')
const configStore = new Store()
const url = require('url')
const fs = require('fs')
const request = require('request')

/**
 * Check for an error condition, whether from a failed request or
 * an HTTP response that indicates an error (e.g. 404).
 *
 * @param {Object} error - an error object of some sort; maybe null
 * @param {Object} response - HTTP response object
 * @param {Number} response.statusCode - HTTP response code
 * @param {String} response.statusMessage - status message; maybe null
 * @return {Object} an Error object, or null if no error.
 */
function maybeError (error, response) {
  if (error) {
    return error
  }
  if (response.statusCode >= 400) {
    let err = new Error(response.statusMessage || 'no status message')
    err.code = response.statusCode
    return err
  }
  return null
}

/**
 * Call the backend to get the given list of attributes.
 *
 * @return {Promise<Array>} of attributes.
 */
function fetchAttributes (key) {
  return new Promise((resolve, reject) => {
    request.get({
      url: url.format({
        protocol: 'http:',
        hostname: configStore.get('backend.host', 'localhost'),
        port: configStore.get('backend.port', 3000),
        pathname: '/api/' + key
      })
    }, (err, response, body) => {
      const error = maybeError(err, response)
      if (error) {
        reject(error)
      } else {
        resolve(JSON.parse(body || '[]'))
      }
    })
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

/**
 * Compute alpha-numeric keys for each of the given file paths.
 *
 * @param {Array<object>} files list of file objects, with 'path' property
 * @return {Array<object>} of files with added 'kagi' property.
 */
exports.checksumFiles = (files) => {
  return files.map((file) => {
    const hash = crypto.createHash('sha1')
    hash.update(file.path)
    return Object.assign({}, file, {
      kagi: hash.digest('hex')
    })
  })
}

/**
 * Perform the upload of the assets and their metadata.
 *
 * @param {Array<object>} files list of files objects and metadata
 * @return {Promise} resolving to list of file paths or errors
 */
exports.uploadFiles = (files) => {
  return Promise.all(files.map((file) =>
    new Promise((resolve, reject) => {
      // First upload the asset itself and get the checksum.
      let formData = {
        asset: {
          value: fs.createReadStream(file.path),
          options: {
            filename: file.name,
            contentType: file.type
          }
        }
      }
      request.post({
        url: url.format({
          protocol: 'http:',
          hostname: configStore.get('backend.host', 'localhost'),
          port: configStore.get('backend.port', 3000),
          pathname: '/api/assets'
        }),
        formData
      }, (err, response, body) => {
        const error = maybeError(err, response)
        if (error) {
          reject(error)
        } else {
          const parsedBody = JSON.parse(body)
          resolve(Object.assign({}, file, {
            checksum: parsedBody.id
          }))
        }
      })
    }).then((res) =>
      new Promise((resolve, reject) => {
        // Now that we have a checksum, update the asset attributes.
        request.put({
          url: url.format({
            protocol: 'http:',
            hostname: configStore.get('backend.host', 'localhost'),
            port: configStore.get('backend.port', 3000),
            pathname: '/api/assets/' + res.checksum
          }),
          json: {
            location: res.location,
            // caption: res.caption,
            tags: res.tags
          }
        }, (err, response, body) => {
          const error = maybeError(err, response)
          if (error) {
            reject(error)
          } else {
            resolve(res)
          }
        })
      })
    )
  ))
}
