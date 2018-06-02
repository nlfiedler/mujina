//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardImage,
  Content,
  Delete,
  Icon,
  Navbar,
  NavbarBrand,
  NavbarEnd,
  NavbarItem,
  NavbarMenu,
  NavbarStart
} = require('bloomer')
const config = require('../config')
const {history} = require('../store')

const AssetPreview = ({details}) => {
  const previewUrl = config.serverUrl({pathname: '/preview/' + details.identifier})
  return (
    <Card>
      <CardHeader>
        <Navbar isTransparent style={{'width': '100%'}}>
          <NavbarBrand>
            <NavbarItem>
              {details.filename}
            </NavbarItem>
          </NavbarBrand>
          <NavbarMenu>
            <NavbarStart>
              <NavbarItem>
                <Button onClick={() => history.push('/edit/' + details.identifier)}>
                  <Icon isSize='medium' className='fa fa-edit' />
                </Button>
              </NavbarItem>
            </NavbarStart>
            <NavbarEnd>
              <NavbarItem>
                <Delete onClick={() => history.push('/')} />
              </NavbarItem>
            </NavbarEnd>
          </NavbarMenu>
        </Navbar>
      </CardHeader>
      <CardImage hasTextAlign='centered'>
        <figure className='image'>
          <img
            alt={details.identifier}
            style={{
              'display': 'inline',
              'width': 'auto'
            }}
            src={previewUrl}
          />
        </figure>
      </CardImage>
      <CardContent>
        <Content>
          <Icon isSize='small' className='fa fa-tag' />
          <strong>{details.tags.join(', ')}</strong>
          <br />
          <Icon isSize='small'><span className='fa fa-quote-left' /></Icon>
          {details.caption}
          <br />
          <Icon isSize='small'><span className='fa fa-map-marker' /></Icon>
          {details.location || ''}
          <br />
          <Icon isSize='small'><span className='fa fa-calendar' /></Icon>
          <small>{details.datetime.toLocaleString()}</small>
        </Content>
      </CardContent>
    </Card>
  )
}

// if String.startsWith "video/" asset.mimetype then
//     video [ style [ ("width", "100%"), ("height", "100%") ]
//           , controls True, preload "auto" ]
//         [ source [ src ("/asset/" ++ asset.identifier)
//                  , type_ (assetMimeType asset.mimetype) ] [ ]
//         , text "Bummer, your browser does not support the HTML5"
//         , code [ ] [ text "video" ]
//         , text "tag."
//         ]
// else
//     a [ href ("/asset/" ++ asset.identifier) ]
//         [ img [ class "asset"
//               , src ("/preview/" ++ asset.identifier)
//               , alt asset.file_name ] [ ]
//         ]

AssetPreview.propTypes = {
  details: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    filesize: PropTypes.number.isRequired,
    datetime: PropTypes.instanceOf(Date).isRequired,
    mimetype: PropTypes.string.isRequired,
    location: PropTypes.string,
    userdate: PropTypes.instanceOf(Date),
    caption: PropTypes.string,
    duration: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
}

module.exports = {
  AssetPreview
}
