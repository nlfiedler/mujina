//
// Copyright (c) 2019 Nathan Fiedler
//
const React = require('react')
const { Search } = require('../containers/Search')
const { Thumbnails } = require('../containers/Thumbnails')

const SearchPage = () => (
  <div>
    <Search />
    <Thumbnails />
  </div>
)

module.exports = {
  SearchPage
}
