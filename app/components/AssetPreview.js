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

function makeImage (details) {
  // just serve up the full asset, no need for a "preview" that looks grainy
  // when the window is larger in size
  const srcUrl = config.serverUrl({pathname: '/asset/' + details.identifier})
  return (
    <Image alt={details.identifier} src={srcUrl} />
  )
}

function makeVideo (details) {
  const srcUrl = config.serverUrl({pathname: '/asset/' + details.identifier})
  // Treat quicktime videos as MP4 so that Chromium will display it without
  // the need for plugins.
  const mimetype = details.mimetype === 'video/quicktime' ? 'video/mp4' : details.mimetype
  return (
    <video controls preload='auto' style={{'width': '100%', 'height': '100%'}}>
      <source src={srcUrl} type={mimetype} />
      'Bummer, your browser does not support the HTML5'
      <code>video</code>
      'tag.'
    </video>
  )
}

const AssetPreview = ({details}) => {
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
        {details.mimetype.startsWith('video/') ? makeVideo(details) : makeImage(details)}
      </CardImage>
    </Card>
  )
}

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
