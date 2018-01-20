//
// Copyright (c) 2017 Nathan Fiedler
//
const _ = require('lodash')
const React = require('react')
const PropTypes = require('prop-types')
const {
  Card,
  CardContent,
  Content
} = require('bloomer')
const config = require('../config')

const ThumbnailCard = ({checksum, filename, date, location, onClick}) => {
  const thumbnailUrl = config.serverUrl({pathname: '/thumbnail/' + checksum})
  // TODO: format the date (if it is a Date object) appropriately
  // TODO: show video thumbnails using video HTML tag so they can play directly
  // TODO: show selected frames from videos on hover
  // TODO: show placeholder icons for thumbnails that fail to load (use 'onerror' handler)
  const shortName = _.truncate(filename, {length: 24})
  return (
    <Card>
      <CardContent>
        <img alt={filename} src={thumbnailUrl} onClick={() => onClick(checksum)} />
        <Content>
          <small>{shortName} - {date}</small>
        </Content>
      </CardContent>
    </Card>
  )
}

ThumbnailCard.propTypes = {
  checksum: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired
}

module.exports = {
  ThumbnailCard
}
