//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const { Asset } = require('../containers/Asset')
const { AssetSelector } = require('../containers/AssetSelector')
const { AssetDetails } = require('../containers/AssetDetails')

const AssetPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '25%' }}>
        <AssetSelector />
      </div>
      <div style={{
        width: '50%',
        paddingTop: '1em',
        paddingBottom: '1em'
      }}
      >
        <Asset />
      </div>
      <div style={{ width: '25%' }}>
        <AssetDetails />
      </div>
    </div>
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
