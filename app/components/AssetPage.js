//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Tile
} = require('bloomer')
const {Asset} = require('../containers/Asset')
const {AssetSelector} = require('../containers/AssetSelector')
const {AssetDetails} = require('../containers/AssetDetails')

const AssetPage = () => {
  return (
    <Tile isAncestor isMarginless>
      <Tile isSize={3} isVertical isParent isPaddingless>
        <Tile isChild>
          <AssetDetails />
        </Tile>
      </Tile>
      <Tile isSize={9} isVertical isParent>
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
