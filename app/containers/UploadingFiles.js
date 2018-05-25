//
// Copyright (c) 2018 Nathan Fiedler
//
const {connect} = require('react-redux')
const {UploadProgress} = require('../components/UploadProgress')

const mapStateToProps = state => {
  const total = state.uploads.files ? state.uploads.files.length : 0
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
