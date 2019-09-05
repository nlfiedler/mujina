//
// Copyright (c) 2019 Nathan Fiedler
//
const React = require('react')
const {
  Tile
} = require('bloomer')
const { DroppedFiles } = require('../containers/DroppedFiles')

// Simple page for now, Tile serves to add padding.
const UploadPage = () => (
  <Tile isAncestor isMarginless>
    <Tile isSize={12} isVertical isParent>
      <Tile isChild>
        <DroppedFiles />
      </Tile>
    </Tile>
  </Tile>
)

module.exports = {
  UploadPage
}
