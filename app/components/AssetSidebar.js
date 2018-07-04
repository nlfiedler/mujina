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
const durationFormatter = new Intl.NumberFormat({maximumFractionDigits: 1})

function formatDuration (value) {
  if (!value) {
    return '(none)'
  }
  if (value > 60) {
    return durationFormatter.format(Math.round(value / 60)) + ' minutes'
  }
  return durationFormatter.format(Math.round(value)) + ' seconds'
}

const AssetSidebar = ({details}) => {
  const term = (content) => (
    <dt style={termStyle}>{content}</dt>
  )
  const data = (content) => (
    <dd style={dataStyle}>{content}</dd>
  )

  return (
    <Box style={boxStyle}>
      <dl>
        {term('Tags')}
        {data(details.tags.join(', '))}
        {term('Location')}
        {data(details.location || '(none)')}
        {term('Caption')}
        {data(details.caption || '(none)')}
        {term('Date/Time')}
        {data(details.datetime.toLocaleString())}
        {term('File size')}
        {data(numberFormatter.format(details.filesize) + ' bytes')}
        {term('MIME type')}
        {data(details.mimetype)}
        {term('ID')}
        {data(_.truncate(details.identifier, {length: 24}))}
        {term('Duration')}
        {data(formatDuration(details.duration))}
      </dl>
    </Box>
  )
}

AssetSidebar.propTypes = {
  details: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    filesize: PropTypes.number.isRequired,
    datetime: PropTypes.instanceOf(Date).isRequired,
    mimetype: PropTypes.string.isRequired,
    location: PropTypes.string,
    userdate: PropTypes.instanceOf(Date),
    caption: PropTypes.string,
    duration: PropTypes.number,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
}

module.exports = {
  AssetSidebar
}
