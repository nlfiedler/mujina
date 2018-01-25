//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Card,
  CardContent,
  CardHeader,
  CardHeaderTitle,
  CardImage,
  Content,
  Icon
} = require('bloomer')
const config = require('../config')

// TODO: use a Delete element to return to the '/' (home) route
// TODO: once date/time is a Date object, format appropriately
// TODO: show videos using the video tag
const AssetDetails = ({details}) => {
  const previewUrl = config.serverUrl({pathname: '/preview/' + details.checksum})
  // TODO: add more details to the display
  // TODO: center the image/card? maybe use div className='container'
  return (
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          {details.filename}
        </CardHeaderTitle>
      </CardHeader>
      <CardImage>
        <img alt={details.filename} src={previewUrl} />
      </CardImage>
      <CardContent>
        <Content>
          <Icon isSize='small' className='fa fa-tag' />
          <strong>{details.tags.join(', ')}</strong>
          <br />
          {details.caption}
          <br />
          <small>{details.datetime}</small>
        </Content>
      </CardContent>
    </Card>
  )
}

// if String.startsWith "video/" asset.mimetype then
//     video [ style [ ("width", "100%"), ("height", "100%") ]
//           , controls True, preload "auto" ]
//         [ source [ src ("/asset/" ++ asset.checksum)
//                  , type_ (assetMimeType asset.mimetype) ] [ ]
//         , text "Bummer, your browser does not support the HTML5"
//         , code [ ] [ text "video" ]
//         , text "tag."
//         ]
// else
//     a [ href ("/asset/" ++ asset.checksum) ]
//         [ img [ class "asset"
//               , src ("/preview/" ++ asset.checksum)
//               , alt asset.file_name ] [ ]
//         ]

AssetDetails.propTypes = {
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
  AssetDetails
}
