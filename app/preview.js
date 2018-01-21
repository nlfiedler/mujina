//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const fs = require('fs')
const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')
const {
  Icon,
  Image
} = require('bloomer')

// Pixel size of the generated thumbnails for the dropped file screen.
const imageSize = 96

/**
 * Generate thumbnails for each of the given files, as returned from
 * api.checksumFiles(). Returns new objects with 'image' property.
 *
 * @param {Array<Object>} files - each has name, path, size, mimetype properties
 * @return {Promise<Array>} resolves to files with added image property.
 */
function generateNewThumbnails (files) {
  return Promise.all(files.map(async function (file) {
    const result = await generateThumbnail(file.mimetype, file.path, imageSize)
    let data = null
    if (result) {
      const base64 = result.binary.toString('base64')
      data = `data:${result.mimetype};base64,${base64}`
    }
    return Object.assign({}, file, {image: data})
  }))
}

/**
 * Generate and Image or an Icon, as appropriate.
 *
 * @param {String} image - if null, uses mimetype to return an Icon.
 * @param {String} mimetype - used to create an Icon, if image is null.
 */
function createThumbnailElement (image, mimetype) {
  if (image) {
    return React.createElement(Image, {
      isSize: `${imageSize}x${imageSize}`,
      src: image
    })
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
    // fit the image into a box of the given size, convert to jpeg
    let bits = await sharp(filepath)
      .resize(pixels, pixels)
      .max()
      .withoutEnlargement()
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
  generateNewThumbnails,
  createThumbnailElement
}
