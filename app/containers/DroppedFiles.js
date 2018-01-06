//
// Copyright (c) 2017 Nathan Fiedler
//
const {connect} = require('react-redux')
const {uploadFiles} = require('../actions')
const {NewFileList} = require('../components/NewFileList')

const mapStateToProps = state => {
  return {
    files: state.uploads.files
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: files => {
      dispatch(uploadFiles(files))
    }
  }
}

const DroppedFiles = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewFileList)

module.exports = {
  DroppedFiles
}
