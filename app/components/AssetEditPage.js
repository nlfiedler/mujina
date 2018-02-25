//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Tile
} = require('bloomer')
const {AssetDetails} = require('../containers/AssetDetails')
const {AssetEdit} = require('../containers/AssetEdit')

// TODO: controls for various image editing operations
//       (rotate, flip)
const AssetEditPage = () => {
  return (
    <Tile isAncestor isMarginLess>
      <Tile isSize={3} isVertical isParent isPaddingless>
        <Tile isChild>
          <AssetDetails />
        </Tile>
      </Tile>
      <Tile isSize={9} isParent>
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
