//
// Copyright (c) 2017 Nathan Fiedler
//
const _ = require('lodash')
const React = require('react')
const PropTypes = require('prop-types')
const {
  Card,
  CardContent,
  Image,
  Level,
  LevelItem,
  LevelLeft,
  LevelRight
} = require('bloomer')
const config = require('../config')

const ThumbnailCard = ({checksum, filename, date, location, onClick}) => {
  const thumbnailUrl = config.serverUrl({pathname: '/thumbnail/' + checksum})
  // TODO: prevent the images from stretching
  //       - maybe try setting `flex-basis`, although then the image is tiny
  // TODO: format the date (if it is a Date object) appropriately
  // TODO: there is apparently a 'time' HTML tag
  // TODO: is there a way to prevent the filename and datetime from overlapping?
  // TODO: show video thumbnails using video HTML tag so they can play directly
  // TODO: show selected frames from videos on hover
  // TODO: show placeholder icons for thumbnails that fail to load (use 'onerror' handler)
  const shortName = _.truncate(filename, {length: 24})
  return (
    <Card style={{'boxShadow': 'none'}}>
      <CardContent>
        <Image alt={filename} src={thumbnailUrl} onClick={() => onClick(checksum)} />
        <Level>
          <LevelLeft>
            <LevelItem><small>{shortName}</small></LevelItem>
          </LevelLeft>
          <LevelRight>
            <LevelItem><small>{date}</small></LevelItem>
          </LevelRight>
        </Level>
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
