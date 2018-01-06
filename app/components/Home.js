//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Menu,
  MenuLabel,
  Tile
} = require('bloomer')
const {Thumbnails} = require('./Thumbnails')
const {LocationList} = require('../containers/LocationList')
const {TagList} = require('../containers/TagList')
const {YearList} = require('../containers/YearList')

const Home = () => (
  <Tile isAncestor style={{margin: 0}}>
    <Tile isSize={2} isVertical isParent>
      <Tile isChild>
        <Menu>
          <MenuLabel>Tags</MenuLabel>
          <TagList />
          <MenuLabel>Locations</MenuLabel>
          <LocationList />
          <MenuLabel>Years</MenuLabel>
          <YearList />
        </Menu>
      </Tile>
    </Tile>
    <Tile isSize={10} isParent>
      <Tile isChild>
        <Thumbnails />
      </Tile>
    </Tile>
  </Tile>
)

module.exports = {
  Home
}
