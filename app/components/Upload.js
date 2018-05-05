//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Tile
} = require('bloomer')
const {DroppedFiles} = require('../containers/DroppedFiles')
const {UploadingFiles} = require('../containers/UploadingFiles')

const Upload = () => (
  <Tile isAncestor isMarginless>
    <Tile isSize={12} isVertical isParent>
      <Tile isChild>
        <DroppedFiles />
      </Tile>
      <Tile isChild>
        <UploadingFiles />
      </Tile>
    </Tile>
  </Tile>
)

module.exports = {
  Upload
}
