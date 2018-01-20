//
// Copyright (c) 2017 Nathan Fiedler
//
const _ = require('lodash')
const React = require('react')
const PropTypes = require('prop-types')
const {
  Table
} = require('bloomer')
const {ThumbnailCard} = require('./ThumbnailCard')

const ThumbnailGrid = ({assets, onClick}) => {
  const cells = assets.map(asset => (
    <td key={asset.checksum}><ThumbnailCard onClick={onClick} {...asset} /></td>
  ))
  // TODO: have the number of columns be sensitive to the window width
  const rowSize = 3
  // TODO: make the number of cached thumbnails depend on the available memory
  // TODO: show N most recent assets by default
  // TODO: if nothing matches, show a message "No matching assets..."
  const rows = _.chunk(cells, rowSize).map((row, idx) => {
    const key = rowKeyBuilder(assets, rowSize * idx, row.length)
    return (
      <tr key={key}>{row}</tr>
    )
  })
  return (
    <Table>
      <tbody>
        {rows}
      </tbody>
    </Table>
  )
}

ThumbnailGrid.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      checksum: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onClick: PropTypes.func.isRequired
}

/**
 * Use the 'checksum' property of the items in the collection to
 * produce a key that is unique to the particular subset of items.
 *
 * @param {Array<Object>} collection - items from which to produce a key.
 * @param {String} collection.checksum - value used to produce a key.
 * @param {Number} offset - starting index within the collection.
 * @param {Number} count - number of items to sample.
 */
function rowKeyBuilder (collection, offset, count) {
  const keys = collection.slice(offset, offset + count).map(item => (
    item.checksum.slice(0, 8)
  ))
  return keys.join('-')
}

module.exports = {
  ThumbnailGrid
}
