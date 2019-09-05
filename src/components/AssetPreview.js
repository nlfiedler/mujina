//
// Copyright (c) 2019 Nathan Fiedler
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
  Navbar,
  NavbarBrand,
  NavbarEnd,
  NavbarItem,
  NavbarMenu,
  NavbarStart
} = require('bloomer')
const config = require('../config')
const { history } = require('../api')

class AssetPreview extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.state = AssetPreview.pristineState(props)
    this.onError = this.handleError.bind(this)
  }

  handleError () {
    this.setState({
      imageUrl: 'images/picture-1.svg',
      imageStyle: {
        width: '240px',
        height: '240px'
      }
    })
  }

  static pristineState (props) {
    return {
      // used to update the state when necessary
      assetId: props.identifier,
      // use the full asset, 'preview' looks grainy
      imageUrl: config.serverUrl({ pathname: props.assetUrl }),
      imageStyle: {
        width: '100%',
        height: 'auto'
      }
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.identifier !== state.assetId) {
      return AssetPreview.pristineState(props)
    }
    return null
  }

  getVideoComponent () {
    // Treat quicktime videos as MP4 so that Chromium will display it without
    // the need for plugins.
    const mimetype = this.props.mimetype === 'video/quicktime' ? 'video/mp4' : this.props.mimetype
    return (
      <video controls preload='auto' style={{ width: '100%', height: '100%' }}>
        <source src={this.state.imageUrl} type={mimetype} />
        'Bummer, your browser does not support the HTML5'
        <code>video</code>
        'tag.'
      </video>
    )
  }

  render () {
    const component = this.props.mimetype.startsWith('video/') ? (
      this.getVideoComponent()
    ) : (
      <img
        alt={this.props.identifier}
        style={this.state.imageStyle}
        src={this.state.imageUrl}
        onError={this.handleError}
      />
    )
    return (
      <Card>
        <CardHeader>
          <Navbar isTransparent style={{ width: '100%' }}>
            <NavbarBrand>
              <NavbarItem>
                {this.props.filename}
              </NavbarItem>
            </NavbarBrand>
            <NavbarMenu>
              <NavbarStart>
                <NavbarItem>
                  <Button onClick={() => history.push('/edit/' + this.props.identifier)}>
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
          {component}
        </CardImage>
      </Card>
    )
  }
}

AssetPreview.propTypes = {
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
  ).isRequired,
  assetUrl: PropTypes.string.isRequired
}

module.exports = {
  AssetPreview
}
