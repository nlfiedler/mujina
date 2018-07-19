//
// Copyright (c) 2018 Nathan Fiedler
//
const {connect} = require('react-redux')
const {fetchAssetDetails} = require('../actions')
const {ThumbnailColumn} = require('../components/ThumbnailColumn')

const mapStateToProps = state => {
  return {
    assets: state.assets.items
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClick: identifier => {
      dispatch(fetchAssetDetails(identifier))
    }
  }
}

const AssetSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThumbnailColumn)

module.exports = {
  AssetSelector
}
