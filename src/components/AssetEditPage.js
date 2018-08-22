//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {AssetDetails} = require('../containers/AssetDetails')
const {AssetEdit} = require('../containers/AssetEdit')

const AssetEditPage = () => {
  return (
    <div style={{'display': 'flex'}}>
      <div style={{'width': '25%'}}>
        <AssetDetails />
      </div>
      <div style={{'width': '75%'}}>
        <AssetEdit />
      </div>
    </div>
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
