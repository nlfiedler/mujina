//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Box,
  Tile
} = require('bloomer')
const {AssetEdit} = require('../containers/AssetEdit')

// TODO: show non-editable details in a sidebar
//       Checksum
//       MIME type
//       EXIF date
//       File name
//       File size
//       File date
//       File owner
//       Import date
//       Duration
// TODO: once date/time is a Date object, format appropriately
const AssetEditPage = () => {
  return (
    <Tile isAncestor style={{margin: 0}}>
      <Tile isSize={2} isVertical isParent isPaddingless>
        <Tile isChild>
          <Box>
            TODO: put the read-only asset details here
          </Box>
        </Tile>
      </Tile>
      <Tile isSize={10} isParent>
        <Tile isChild>
          <AssetEdit />
        </Tile>
      </Tile>
    </Tile>
  )
}

AssetEditPage.propTypes = {
  // match is provided by react-router
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
}

module.exports = {
  AssetEditPage
}
