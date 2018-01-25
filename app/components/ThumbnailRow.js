//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Container
} = require('bloomer')
const config = require('../config')

// TODO: thumbnail images are kind big, maybe make them smaller somehow
// TODO: add some padding around the thumbnails
// TODO: show placeholder icons for thumbnails that fail to load (use 'onerror' handler)
const ThumbnailImage = ({checksum, filename, onClick}) => {
  const thumbnailUrl = config.serverUrl({pathname: '/thumbnail/' + checksum})
  return (
    <img alt={filename} src={thumbnailUrl} onClick={() => onClick(checksum)} />
  )
}

const ThumbnailRow = ({assets, onClick}) => {
  const items = assets.map(asset => (
    <ThumbnailImage key={asset.checksum} onClick={onClick} {...asset} />
  ))
  return (
    <Container isFluid isMarginless style={{'overflow': 'auto', 'width': '100vw'}}>
      {items}
    </Container>
  )
}

ThumbnailRow.propTypes = {
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
  ThumbnailRow
}
