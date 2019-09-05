//
// Copyright (c) 2019 Nathan Fiedler
//
const { connect } = require('react-redux')
const { searchAssets } = require('../actions')
const { SearchBar } = require('../components/SearchBar')

const mapStateToProps = state => {
  return {
    search: state.search
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
