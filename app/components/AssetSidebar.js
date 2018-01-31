//
// Copyright (c) 2017 Nathan Fiedler
//
const _ = require('lodash')
const React = require('react')
const PropTypes = require('prop-types')
const {
  Box
} = require('bloomer')

const boxStyle = {
  'margin': '1rem',
  'padding': '1rem'
}
const termStyle = {
  'fontSize': '0.75em',
  'textTransform': 'uppercase'
}
const dataStyle = {
  'margin': '0'
}
const numberFormatter = new Intl.NumberFormat()

const AssetSidebar = ({details}) => {
  const term = (content) => (
    <dt style={termStyle}>{content}</dt>
  )
  const data = (content) => (
    <dd style={dataStyle}>{content}</dd>
  )

  // TODO: once date/time is a Date object, format appropriately
  // TODO: more details to include someday
  //       EXIF date
  //       File date
  //       File owner
  //       Import date
  // TODO: add a tooltip to the checksum to show the entire value
  return (
    <Box style={boxStyle}>
      <dl>
        {term('File size')}
        {data(numberFormatter.format(details.filesize) + ' bytes')}
        {term('MIME type')}
        {data(details.mimetype)}
        {term('SHA256')}
        {data(_.truncate(details.checksum, {length: 24}))}
        {term('Duration')}
        {data(details.duration || '(none)')}
      </dl>
    </Box>
  )
}

AssetSidebar.propTypes = {
  details: PropTypes.shape({
    checksum: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    filesize: PropTypes.number.isRequired,
    datetime: PropTypes.string.isRequired,
    mimetype: PropTypes.string.isRequired,
    location: PropTypes.string,
    userdate: PropTypes.string,
    caption: PropTypes.string,
    duration: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
}

module.exports = {
  AssetSidebar
}
