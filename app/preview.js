//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const fs = require('fs')
const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')
const {
  Icon
} = require('bloomer')

// Pixel size of the generated thumbnails for the dropped file screen.
const imageSize = 96

/**
 * Generate a data URL of the thumbnail image for the given file.
 *
 * Returns the image data (i.e. `data:...;base64,...`).
 *
 * @param {String} filepath - path of file to process.
 * @param {String} mimetype - media type of the file.
 * @return {Promise} resolves to (image) data URL.
 */
async function generateThumbnailData (filepath, mimetype) {
  const result = await generateThumbnail(mimetype, filepath, imageSize)
  let data = null
  if (result) {
    const base64 = result.binary.toString('base64')
    data = `data:${result.mimetype};base64,${base64}`
  }
  return data
}

/**
 * Generate and Image or an Icon, as appropriate.
 *
 * @param {String} image - if null, uses mimetype to return an Icon.
 * @param {String} mimetype - used to create an Icon, if image is null.
 */
function createThumbnailElement (image, mimetype) {
  if (image) {
    const dimension = `${imageSize}px`
    const imgElement = React.createElement('img', {
      style: {
        'objectFit': 'cover',
        'height': dimension,
        'width': dimension
      },
      src: image
    })
    return React.createElement('figure', {
      className: 'image is-96x96'
    }, imgElement)
  }
  const icon = mimetypeToIcon(mimetype)
  return React.createElement(Icon, {
    isSize: 'large',
    className: 'fa fa-' + icon
  })
}

/**
 * Generate a thumbnail for the given file (image or video). Returns null
 * if the file is neither an image nor video.
 */
async function generateThumbnail (mimetype, filepath, pixels) {
  if (mimetype.startsWith('video/')) {
    return generateVideoThumbnail(filepath, pixels)
  } else if (mimetype.startsWith('image/')) {
    // fit the image into a box of the given size, convert to jpeg,
    // and auto-rotate as needed (server makes the final correction)
    let bits = await sharp(filepath)
      .resize(pixels, pixels)
      .crop(sharp.strategy.entropy)
      .rotate()
      .toFormat('jpeg')
      .toBuffer()
    return {
      binary: bits,
      mimetype: 'image/jpg'
    }
  } else {
    return null
  }
}

/**
 * Generate a thumbnail for the video asset.
 *
 * @param {string} filepath - path of the video asset.
 * @param {number} pixels - size of the desired image.
 * @returns {Promise<Number>} promise resolving to an object holding
 *          the nodejs Buffer ('binary') and mime type ('mimetype').
 */
function generateVideoThumbnail (filepath, pixels) {
  return new Promise((resolve, reject) => {
    const filename = `${filepath}.jpg`
    ffmpeg(filepath)
      .on('end', function () {
        let binary = fs.readFileSync(filename)
        fs.unlinkSync(filename)
        resolve({
          binary,
          mimetype: 'image/jpg'
        })
      })
      .on('error', function (err) {
        reject(err)
      })
      // There is the tempting screenshots() function, but unfortunately it does
      // not offer a means of maintaining the aspect ratio, and it insists on
      // writing the output as huge PNG files.
      .outputOptions([
        '-vframes',
        '1',
        '-an',
        '-filter:v',
        `scale=w=${pixels}:h=${pixels}:force_original_aspect_ratio=decrease`
      ])
      .save(filename)
  })
}

// Return a font-awesome icon name for the given mimetype.
function mimetypeToIcon (mimetype) {
  if (mimetype.startsWith('video/')) {
    return 'file-video-o'
  } else if (mimetype.startsWith('image/')) {
    return 'file-image-o'
  } else if (mimetype.startsWith('audio/')) {
    return 'file-audio-o'
  } else if (mimetype.startsWith('text/')) {
    return 'file-text-o'
  } else if (mimetype === 'application/pdf') {
    return 'file-pdf-o'
  }
  return 'file-o'
}

module.exports = {
  generateThumbnailData,
  createThumbnailElement
}
