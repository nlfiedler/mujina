//
// Copyright (c) 2017 Nathan Fiedler
//
const {connect} = require('react-redux')
const {AssetPreview} = require('../components/AssetPreview')

const mapStateToProps = state => {
  return {
    details: state.details.single
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // onClick: asset => {
    //   dispatch(push('/asset/' + asset.id))
    // }
  }
}

const Asset = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetPreview)

module.exports = {
  Asset
}
