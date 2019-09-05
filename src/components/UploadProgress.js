//
// Copyright (c) 2019 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Column,
  Columns,
  Progress
} = require('bloomer')

const UploadProgress = ({ progress, total }) => (
  <Columns isCentered>
    {progress.filename && (
      <Column isSize='1/4'>
        Uploading {progress.filename}...
      </Column>
    )}
    {progress.count >= 0 && (
      <Column isSize='1/2'>
        <Progress isColor='info' value={progress.count} max={total} />
      </Column>
    )}
  </Columns>
)

UploadProgress.propTypes = {
  progress: PropTypes.shape({
    count: PropTypes.number.isRequired,
    filename: PropTypes.string.isRequired
  }).isRequired,
  total: PropTypes.number.isRequired
}

module.exports = {
  UploadProgress
}
