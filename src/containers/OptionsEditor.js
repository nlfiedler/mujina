//
// Copyright (c) 2019 Nathan Fiedler
//
const { connect } = require('react-redux')
const { actions } = require('react-redux-form')
const { saveOptions } = require('../actions')
const { OptionsForm } = require('../components/OptionsForm')

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: options => {
      dispatch(saveOptions(options))
    },
    // get the form populated with data via rrf action
    populateForm: options => {
      dispatch(actions.change('options', options))
    }
  }
}

const OptionsEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionsForm)

module.exports = {
  OptionsEditor
}
