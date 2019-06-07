//
// Copyright (c) 2019 Nathan Fiedler
//
const React = require('react')
const {
  Button,
  Icon,
  Tile
} = require('bloomer')
const { ErrorReporter } = require('../containers/ErrorReporter')
const { history } = require('../api')

const ErrorPage = () => (
  <Tile isAncestor isMarginless>
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
