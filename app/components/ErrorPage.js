//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Button,
  Icon,
  Tile
} = require('bloomer')
const {ErrorReporter} = require('../containers/ErrorReporter')
const {history} = require('../store')

const ErrorPage = () => (
  <Tile isAncestor style={{margin: 0}}>
    <Tile isSize={12} isVertical isParent>
      <Tile isChild>
        <ErrorReporter />
        <Button isLink isOutlined onClick={() => history.push('/')}>
          <Icon isSize='medium' className='fa fa-home' />
        </Button>
      </Tile>
    </Tile>
  </Tile>
)

module.exports = {
  ErrorPage
}
