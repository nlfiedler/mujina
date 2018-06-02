//
// Copyright (c) 2017 Nathan Fiedler
//
const {connect} = require('react-redux')
const {fetchAssetDetails} = require('../actions')
const {ThumbnailGrid} = require('../components/ThumbnailGrid')

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

const Thumbnails = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThumbnailGrid)

module.exports = {
  Thumbnails
}
