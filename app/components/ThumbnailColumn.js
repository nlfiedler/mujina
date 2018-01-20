//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const config = require('../config')

const ThumbnailImage = ({checksum, filename, onClick}) => {
  const thumbnailUrl = config.serverUrl({pathname: '/thumbnail/' + checksum})
  // TODO: show placeholder icons for thumbnails that fail to load (use 'onerror' handler)
  return (
    <img alt={filename} src={thumbnailUrl} onClick={() => onClick(checksum)} />
  )
}

const ThumbnailColumn = ({assets, onClick}) => {
  const items = assets.map(asset => (
    <li key={asset.checksum}><ThumbnailImage onClick={onClick} {...asset} /></li>
  ))
  return (
    <ul style={{'listStyleType': 'none', 'margin': 0, 'padding': 0}}>
      {items}
    </ul>
  )
}

ThumbnailColumn.propTypes = {
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

module.exports = {
  ThumbnailColumn
}
