//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Button,
  Card,
  CardHeader,
  CardImage,
  Delete,
  Icon,
  Image,
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
        <Image alt={details.identifier} src={previewUrl} />
      </CardImage>
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
    duration: PropTypes.number,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
}

module.exports = {
  AssetPreview
}
