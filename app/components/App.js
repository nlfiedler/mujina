//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Menu,
  MenuLabel,
  Tile
} = require('bloomer')
const {TagList} = require('../containers/TagList')

const App = () => (
  <Tile isAncestor>
    <Tile isSize={4} isVertical isParent>
      <Tile isChild>
        <Menu>
          <MenuLabel>Tags</MenuLabel>
          <TagList />
        </Menu>
      </Tile>
    </Tile>
  </Tile>
)

module.exports = {
  App
}
