//
// Copyright (c) 2019 Nathan Fiedler
//
const crypto = require('crypto')
const fs = require('fs')
const request = require('request')
const config = require('./config')
const query = require('./query')
const { createMemoryHistory } = require('history')

// Expose the history so it can be modified anywhere in the application.
exports.history = createMemoryHistory()

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
    const err = new Error(response.statusMessage || 'no status message')
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
      url: config.serverUrl({ pathname: '/graphql' }),
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
      url: config.serverUrl({ pathname: '/graphql' }),
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
      url: config.serverUrl({ pathname: '/graphql' }),
      json: {
        query: `query {
          asset(id: "${identifier}") {
            id
            caption
            datetime
            duration
            filename
            filepath
            filesize
            location
            mimetype
            tags
            userdate
            previewUrl
            assetUrl
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
      url: config.serverUrl({ pathname: '/graphql' }),
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

// Run the query against the GraphQL search field of the Query type.
function runQuery (params) {
  return new Promise((resolve, reject) => {
    request.post({
      url: config.serverUrl({ pathname: '/graphql' }),
      json: {
        variables: JSON.stringify({
          params
        }),
        operationName: 'Search',
        query: `query Search($params: SearchParams!) {
          search(params: $params, count: 10000) {
            results {
              id
              datetime
              filename
              location
              thumbWidth
              thumbHeight
              thumbnailUrl
              widethumbUrl
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
 * Search for assets matching the selected attributes.
 *
 * @param {Object} selections - as from query.getSelectedAttrs()
 * @return {Promise<Array>} a promise resolving to the list of results.
 */
exports.queryAssets = (selections) => {
  return runQuery(query.fromSelections(selections))
}

/**
 * Search for assets matching the query string.
 *
 * @param {String} input - query string for searching for assets.
 * @return {Promise<Array>} a promise resolving to the list of results.
 */
exports.searchAssets = (input) => {
  return runQuery(query.fromString(input))
}

/**
 * Compute the checksum for the given file. The value will have the algorithm
 * prefixed with a hyphen separator (e.g. sha256-xxx).
 *
 * @param {String} filepath - path of the file to be checksummed.
 * @return {String} Promise resolving to the hash digest.
 */
exports.checksumFile = (filepath) => {
  const algo = 'sha256'
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algo)
    const rs = fs.createReadStream(filepath)
    rs.on('error', reject)
    rs.on('data', chunk => hash.update(chunk))
    rs.on('end', () => resolve(`${algo}-${hash.digest('hex')}`))
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
    const formData = {
      // graphql-upload expects the multi-part request to look a certain way
      // c.f. https://github.com/jaydenseric/graphql-multipart-request-spec
      //
      // Because form-data orders the fields by name, use a prefix for
      // the file map, so that the files come _after_ the "operations"
      // and "map" fields, as expected by the server.
      //
      operations: JSON.stringify({
        variables: { file: null },
        operationName: 'Upload',
        query: `mutation Upload($file: Upload!) {
          upload(file: $file)
        }`
      }),
      map: JSON.stringify({ x1: ['variables.file'] }),
      x1: {
        value: fs.createReadStream(file.path),
        options: {
          filename: file.name,
          contentType: file.mimetype
        }
      }
    }
    // use multipart/form-data request form
    request.post({
      url: config.serverUrl({ pathname: '/graphql' }),
      formData
    }, (err, response, body) => {
      const error = maybeError(err, response)
      if (error) {
        reject(error)
      } else {
        const parsedBody = JSON.parse(body)
        resolve(Object.assign({}, file, {
          identifier: parsedBody.data.upload
        }))
      }
    })
  }).then((res) =>
    // Now that we have a identifier, update the asset attributes.
    exports.updateAsset(res)
  )
}
