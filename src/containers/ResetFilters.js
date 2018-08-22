//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const {
  Button
} = require('bloomer')
const {connect} = require('react-redux')
const {resetFilters} = require('../actions')

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClick: () => {
      dispatch(resetFilters())
    }
  }
}

const ResetButton = ({onClick}) => {
  return React.createElement(Button, {
    isLink: true,
    isOutlined: true,
    isFullWidth: true,
    isSize: 'small',
    onClick: onClick
  }, 'reset all filters')
}

const ResetFilters = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetButton)

module.exports = {
  ResetFilters
}
