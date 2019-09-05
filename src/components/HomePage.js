//
// Copyright (c) 2019 Nathan Fiedler
//
const React = require('react')
const { AssetFilters } = require('../containers/AssetFilters')
const { Thumbnails } = require('../containers/Thumbnails')

// Not using Tile here as that seems to interact poorly with the scrollable
// content contained within the descendants.
const HomePage = () => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '20%' }}>
      <AssetFilters />
    </div>
    <div style={{ width: '80%' }}>
      <Thumbnails />
    </div>
  </div>
)

module.exports = {
  HomePage
}
