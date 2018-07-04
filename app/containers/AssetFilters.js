//
// Copyright (c) 2018 Nathan Fiedler
//
const {connect} = require('react-redux')
const {requestAssets} = require('../actions')
const {FiltersPanel} = require('../components/FiltersPanel')

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(requestAssets())
    }
  }
}

const AssetFilters = connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersPanel)

module.exports = {
  AssetFilters
}
