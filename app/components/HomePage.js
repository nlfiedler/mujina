//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const {
  Tile
} = require('bloomer')
const {AssetFilters} = require('../containers/AssetFilters')
const {Thumbnails} = require('../containers/Thumbnails')

// The default padding on the parent tile causes the asset filters to be too
// large by that same amount, so remove all padding from the left tile.
const HomePage = () => (
  <Tile isAncestor>
    <Tile isSize={2} isParent isPaddingless>
      <Tile isChild>
        <AssetFilters />
      </Tile>
    </Tile>
    <Tile isSize={10} isParent>
      <Thumbnails />
    </Tile>
  </Tile>
)

module.exports = {
  HomePage
}
