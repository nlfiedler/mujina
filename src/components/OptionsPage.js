//
// Copyright (c) 2019 Nathan Fiedler
//
const React = require('react')
const {
  Tile,
  Title
} = require('bloomer')
const { OptionsEditor } = require('../containers/OptionsEditor')

const OptionsPage = () => (
  <Tile isAncestor isMarginless>
    <Tile isSize={12} isVertical isParent>
      <Tile isChild>
        <Title>Options</Title>
        <OptionsEditor />
      </Tile>
    </Tile>
  </Tile>
)

module.exports = {
  OptionsPage
}
