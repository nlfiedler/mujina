//
// Copyright (c) 2017 Nathan Fiedler
//
const {connect} = require('react-redux')
const {AssetDetails} = require('../components/AssetDetails')

const mapStateToProps = state => {
  return {
    details: state.details.single
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // TODO: clicking should open the raw asset in a browser?
    //       or another window, with controls for saving the file locally, etc
    // onClick: asset => {
    //   dispatch(push('/asset/' + asset.id))
    // }
  }
}

const Asset = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetDetails)

module.exports = {
  Asset
}
