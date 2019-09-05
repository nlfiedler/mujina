//
// Copyright (c) 2019 Nathan Fiedler
//
const { connect } = require('react-redux')
const { UploadProgress } = require('../components/UploadProgress')

const mapStateToProps = state => {
  const total = state.uploads.outgoing ? state.uploads.outgoing.length : 0
  const progress = state.uploads.progress || {count: -1, filename: ''}
  return {
    progress,
    total
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const UploadingFiles = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadProgress)

module.exports = {
  UploadingFiles
}
