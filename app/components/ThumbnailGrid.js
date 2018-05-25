//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Tile
} = require('bloomer')
const {ThumbnailCard} = require('./ThumbnailCard')

const ThumbnailGrid = ({assets, onClick}) => {
  const items = assets.map(asset => (
    <ThumbnailCard key={asset.checksum} onClick={onClick} {...asset} />
  ))
  // TODO: if no items, show a message "No matching assets..."
  return (
    <Tile isChild style={{
      'display': 'flex',
      'flexFlow': 'row wrap',
      'justifyContent': 'space-around',
      'alignItems': 'center'
    }}>
      {items}
    </Tile>
  )
}

ThumbnailGrid.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      checksum: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      datetime: PropTypes.instanceOf(Date).isRequired,
      location: PropTypes.string
    }).isRequired
  ).isRequired,
  onClick: PropTypes.func.isRequired
}

module.exports = {
  ThumbnailGrid
}
