//
// Copyright (c) 2018 Nathan Fiedler
//
const {connect} = require('react-redux')
const {searchAssets} = require('../actions')
const {SearchBar} = require('../components/SearchBar')

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: query => {
      dispatch(searchAssets(query))
    }
  }
}

const Search = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar)

module.exports = {
  Search
}
