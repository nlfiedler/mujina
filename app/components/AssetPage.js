//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Tile
} = require('bloomer')
const {Asset} = require('../containers/Asset')
const {AssetSelector} = require('../containers/AssetSelector')
const {AssetFilters} = require('./AssetFilters')

// TODO: see if there's a way to keep the selector tile a certain size
//       (when preview image is smaller, Asset component shifts down)
// TODO: ensure the right tile remains at the top of the window (does not scroll away)
//       (need lots more assets to test with)
const AssetPage = () => {
  return (
    <Tile isAncestor style={{margin: 0}}>
      <Tile isSize={2} isVertical isParent isPaddingless>
        <Tile isChild>
          <AssetFilters />
        </Tile>
      </Tile>
      <Tile isSize={10} isVertical isParent>
        <Tile isChild>
          <AssetSelector />
        </Tile>
        <Tile isChild>
          <Asset />
        </Tile>
      </Tile>
    </Tile>
  )
}

AssetPage.propTypes = {
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
  AssetPage
}
