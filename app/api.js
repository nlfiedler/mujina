//
// Copyright (c) 2018 Nathan Fiedler
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
 * Check if an asset with the given checksum already exists.
 *
 * @param {String} checksum - checksum of asset to look up.
 * @return {Promise<Object>} - resolves to the asset details, or null if none.
 */
exports.lookupAsset = (checksum) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: config.serverUrl({pathname: '/graphql'}),
      json: {
        query: `query {
          lookup(checksum: "${checksum}") {
            id
            caption
            location
            tags
          }
        }`
      }
    }, (err, response, body) => {
      const error = maybeError(err, response)
      if (error) {
        reject(error)
      } else {
        if (body.data && body.data.lookup) {
          resolve(body.data.lookup)
        } else {
          resolve(null)
        }
      }
    })
  })
}

/**
 * Fetch the details for the asset with the given identifier.
 *
 * @param {String} identifier - identifier of asset to be retrieved.
 * @return {Promise<Object>} - resolves to the asset details.
 */
exports.fetchAsset = (identifier) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: config.serverUrl({pathname: '/graphql'}),
      json: {
        query: `query {
          asset(id: "${identifier}") {
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
 * @param {String} details.identifier - the asset identifier.
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
          update(id: "${details.identifier}", asset: $input) {
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
  const locations = selections.locations.map(item => item.label)
  const tags = selections.tags.map(item => item.label)
  const years = selections.years.map(item => Number.parseInt(item.label))
  let afterTime = null
  let beforeTime = null
  if (years.length > 0) {
    afterTime = new Date(years[0], 0).getTime()
    beforeTime = new Date(years[0] + 1, 0).getTime()
  }
  return new Promise((resolve, reject) => {
    request.post({
      url: config.serverUrl({pathname: '/graphql'}),
      json: {
        variables: JSON.stringify({
          params: {
            locations: locations,
            tags: tags,
            after: afterTime,
            before: beforeTime
          }
        }),
        operationName: 'Search',
        query: `query Search($params: SearchParams!) {
          search(params: $params, count: 10000) {
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
 * Compute the SHA256 for the given file.
 *
 * @param {String} filepath - path of the file to be checksummed.
 * @return {String} Promise resolving to the sha256 digest.
 */
exports.checksumFile = (filepath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const rs = fs.createReadStream(filepath)
    rs.on('error', reject)
    rs.on('data', chunk => hash.update(chunk))
    rs.on('end', () => resolve(hash.digest('hex')))
  })
}

/**
 * Perform the upload of the assets and their metadata.
 *
 * @param {Object} file files object and metadata
 * @param {String} file.path path to the asset to be uploaded.
 * @param {String} file.name name of the file.
 * @param {String} file.mimetype the mimetype as detected by the browser.
 * @return {Promise} resolving to updated asset details
 */
exports.uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    // First upload the asset itself and get the identifier.
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
          identifier: parsedBody.id
        }))
      }
    })
  }).then((res) =>
    // Now that we have a identifier, update the asset attributes.
    exports.updateAsset(res)
  )
}
