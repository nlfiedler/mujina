//
// Copyright (c) 2019 Nathan Fiedler
//
const { connect } = require('react-redux')
const { ErrorMessage } = require('../components/ErrorMessage')

const mapStateToProps = state => {
  return {
    error: state.errors
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

const ErrorReporter = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorMessage)

module.exports = {
  ErrorReporter
}
