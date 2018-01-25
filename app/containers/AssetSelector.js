//
// Copyright (c) 2017 Nathan Fiedler
//
const {connect} = require('react-redux')
const {fetchAssetDetails} = require('../actions')
const {ThumbnailRow} = require('../components/ThumbnailRow')

const mapStateToProps = state => {
  return {
    assets: state.assets.items
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClick: checksum => {
      dispatch(fetchAssetDetails(checksum))
    }
  }
}

const AssetSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThumbnailRow)

module.exports = {
  AssetSelector
}
