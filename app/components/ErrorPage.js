//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {Link} = require('react-router')
const {
  Tile
} = require('bloomer')
const {ErrorReporter} = require('../containers/ErrorReporter')

const ErrorPage = (props) => (
  <Tile isAncestor style={{margin: 0}}>
    <Tile isSize={12} isVertical isParent>
      <Tile isChild>
        <ErrorReporter />
        <Link to='/'>Home</Link>
      </Tile>
    </Tile>
  </Tile>
)

// alternatively, could use Button instead of Link
// const {browserHistory} = require('react-router')
// <Button isActive isColor='primary' onClick={() => browserHistory.push('/')}>Ok</Button>

module.exports = {
  ErrorPage
}
