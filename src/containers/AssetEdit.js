//
// Copyright (c) 2017 Nathan Fiedler
//
const {connect} = require('react-redux')
const {actions} = require('react-redux-form')
const {updateAssetDetails} = require('../actions')
const {AssetEditor} = require('../components/AssetEditor')

const mapStateToProps = state => {
  return {
    details: state.details.single
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: details => {
      dispatch(updateAssetDetails(details))
    },
    // get the form populated with data via rrf action
    populateForm: details => {
      dispatch(actions.change('editor', details))
    }
  }
}

const AssetEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetEditor)

module.exports = {
  AssetEdit
}
