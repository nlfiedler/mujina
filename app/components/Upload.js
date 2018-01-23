//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Tile
} = require('bloomer')
const {DroppedFiles} = require('../containers/DroppedFiles')

const Upload = () => (
  <Tile isAncestor style={{margin: 0}}>
    <Tile isSize={12} isVertical isParent>
      <Tile isChild>
        <DroppedFiles />
      </Tile>
    </Tile>
  </Tile>
)

module.exports = {
  Upload
}