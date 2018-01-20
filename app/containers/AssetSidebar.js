//
// Copyright (c) 2017 Nathan Fiedler
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
    onClick: checksum => {
      dispatch(fetchAssetDetails(checksum))
    }
  }
}

const AssetSidebar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThumbnailColumn)

module.exports = {
  AssetSidebar
}
