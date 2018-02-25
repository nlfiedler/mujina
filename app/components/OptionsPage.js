//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Tile,
  Title
} = require('bloomer')
const {OptionsEditor} = require('../containers/OptionsEditor')

const OptionsPage = () => (
  <Tile isAncestor isMarginLess>
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
