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
    request.post({
      url: config.serverUrl({pathname: '/graphql'}),
      json: {
        query: `query {
          ${key} {
            value
            count
          }
        }`
      }
    }, (err, response, body) => {
      const error = maybeError(err, response)
      if (error) {
        reject(error)
      } else {
        resolve(body.data[key])
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
 * @param {String} checksum - identifier of asset to be retrieved.
 * @return {Promise<Object>} - resolves to the asset details.
 */
exports.fetchAsset = (checksum) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: config.serverUrl({pathname: '/graphql'}),
      json: {
        query: `query {
          asset(id: "${checksum}") {
            id
            caption
            datetime
            duration
            filename
            filesize
            location
            mimetype
            tags
            userdate
          }
        }`
      }
    }, (err, response, body) => {
      const error = maybeError(err, response)
      if (error) {
        reject(error)
      } else {
        resolve(body.data.asset)
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
 * @param {Date} details.userdate - custom date/time, or null to clear.
 * @return {Promise<Object>} - resolves to an updated details object.
 */
exports.updateAsset = (details) => {
  const datetime = details.userdate ? details.userdate.getTime() : null
  return new Promise((resolve, reject) => {
    request.post({
      url: config.serverUrl({pathname: '/graphql'}),
      json: {
        variables: JSON.stringify({
          input: {
            caption: details.caption,
            location: details.location,
            tags: details.tags,
            datetime
          }
        }),
        operationName: 'Update',
        // retrieve the tags in case the server modified the input
        // retrieve the datetime in case the user set/reset the userdate
        query: `mutation Update($input: AssetInput!) {
          update(id: "${details.checksum}", asset: $input) {
            datetime
            tags
          }
        }`
      }
    }, (err, response, body) => {
      const error = maybeError(err, response)
      if (error) {
        reject(error)
      } else {
        // return the original input merged with the updated values
        // as the caller may be depending on having a merged result
        resolve(Object.assign({}, details, body.data.update))
      }
    })
  })
}

/**
 * Search for assets matching the given criteria.
 *
 * @param {Array} selections.locations - location obects with label property.
 * @param {Array} selections.tags - tag obects with label property.
 * @param {Array} selections.years - year obects with label property.
 */
exports.queryAssets = (selections) => {
  const locations = JSON.stringify(selections.locations.map(item => item.label))
  const tags = JSON.stringify(selections.tags.map(item => item.label))
  const years = JSON.stringify(selections.years.map(item => Number.parseInt(item.label)))
  return new Promise((resolve, reject) => {
    request.post({
      url: config.serverUrl({pathname: '/graphql'}),
      json: {
        query: `query {
          search(tags: ${tags}, locations: ${locations}, years: ${years}, count: 10000) {
            results {
              id
              datetime
              filename
              location
            }
            count
          }
        }`
      }
    }, (err, response, body) => {
      const error = maybeError(err, response)
      if (error) {
        reject(error)
      } else {
        resolve(body.data.search)
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
      // use multipart/form-data request form
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
      // Now that we have a checksum, update the asset attributes.
      exports.updateAsset(res)
    )
  ))
}
