//
// Copyright (c) 2017 Nathan Fiedler
//
const crypto = require('crypto')
const fs = require('fs')
const request = require('request')
const config = require('./config')

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
      url: config.serverUrl({pathname: '/api/' + key})
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
 * Fetch the details for the asset with the given checksum.
 *
 * Return value shape:
 *
 * [
 *   {
 *     checksum: string
 *     file_name: string
 *     file_size: number
 *     mimetype: string
 *     datetime: string
 *     user_date: (nullable string)
 *     caption: (nullable string)
 *     location: (nullable string)
 *     duration: (nullable number)
 *     tags: (array string)
 *   },
 *   ...
 * ]
 *
 * @param {String} checksum - identifier of asset to be retrieved.
 * @return {Promise<Object>} - resolves to the asset details.
 */
exports.fetchAsset = (checksum) => {
  return new Promise((resolve, reject) => {
    request.get({
      url: config.serverUrl({pathname: '/api/assets/' + checksum})
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

/**
 * Update the asset details on the backend.
 *
 * @param {Object} details - the asset details, with location, caption, etc.
 * @param {String} details.checksum - the asset checksum.
 * @param {String} details.location - the asset location value.
 * @param {String} details.caption - the asset caption value.
 * @param {String} details.tags - the asset tags value (list of strings).
 * @return {Promise<Object>} - resolves to the server response.
 */
exports.updateAsset = (details) => {
  return new Promise((resolve, reject) => {
    request.put({
      url: config.serverUrl({pathname: '/api/assets/' + details.checksum}),
      json: {
        location: details.location,
        caption: details.caption,
        tags: details.tags
      }
    }, (err, response, body) => {
      const error = maybeError(err, response)
      if (error) {
        reject(error)
      } else {
        resolve(body)
      }
    })
  })
}

/**
 * Shape of the selections argument:
 *
 * {
 *   locations: [{label},...],
 *   tags:  [{label},...],
 *   years: [{label},...]
 * }
 *
 * Return value shape:
 *
 * {
 *   assets: [
 *     {checksum, file_name, date, location},
 *     ...
 *   ]
 *   count: n
 * }
 */
exports.queryAssets = (selections) => {
  const locations = selections.locations.map(item => 'locations[]=' + item.label)
  const tags = selections.tags.map(item => 'tags[]=' + item.label)
  const years = selections.years.map(item => 'years[]=' + item.label)
  const paging = ['page_size=100']
  // TODO: will need a param to disable paging on the backend
  const params = locations.concat(tags).concat(years).concat(paging).join('&')
  return new Promise((resolve, reject) => {
    // TODO: consider if using a form body instead of URL would be better
    request.get({
      url: config.serverUrl({pathname: '/api/assets', search: params})
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
            contentType: file.mimetype
          }
        }
      }
      request.post({
        url: config.serverUrl({pathname: '/api/assets'}),
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
          url: config.serverUrl({pathname: '/api/assets/' + res.checksum}),
          json: {
            location: res.location,
            caption: res.caption,
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
