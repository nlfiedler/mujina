//
// Copyright (c) 2019 Nathan Fiedler
//
const { connect } = require('react-redux')
const { AssetSidebar } = require('../components/AssetSidebar')

const mapStateToProps = state => {
  return {
    details: state.details.single
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

const AssetDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetSidebar)

module.exports = {
  AssetDetails
}
