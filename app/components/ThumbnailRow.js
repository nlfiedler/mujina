//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Container
} = require('bloomer')
const VisibilitySensor = require('react-visibility-sensor')
const config = require('../config')

const imagePlaceholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// TODO: maybe add a ":hover" style to the thumbnails, like with buttons
// TODO: show placeholders for images that fail to load (use 'onerror' handler)
// TODO: if no assets, show a message "No matching assets..."
class ThumbnailImage extends React.Component {
  constructor (props) {
    super(props)
    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.state = {visible: false}
  }

  onVisibilityChange (isVisible) {
    // Switch visibility via state change to trigger a render.
    this.setState({
      visible: isVisible
    })
  }

  getImageComponent () {
    const {checksum, onClick} = this.props
    return this.state.visible ? (
      <img
        style={{'objectFit': 'cover', 'height': '96px', 'width': '96px'}}
        src={config.serverUrl({pathname: '/thumbnail/' + checksum})}
        onClick={() => onClick(checksum)}
      />
    ) : (
      <img
        style={{'objectFit': 'cover', 'height': '96px', 'width': '96px'}}
        src={imagePlaceholder}
      />
    )
  }

  render () {
    // Would like to use Image, but really need the combination of figure and
    // img with the styles applied on the appropriate element, and Image does
    // not offer that level of control.
    const figure = (
      <figure className='image is-96x96' style={{
        'flex': 'initial',
        'flexShrink': 0,
        'margin': 'auto 10px'
      }}>
        {this.getImageComponent()}
      </figure>
    )
    // For some strange reason, VisibilitySensor was getting multiple children
    // from somewhere and raising an exception because it only wants one
    // (React.Children.only, invalid prop 'children').
    return React.createElement(VisibilitySensor, {
      onChange: this.onVisibilityChange,
      partialVisibility: true
    }, figure)
  }
}

const ThumbnailRow = ({assets, onClick}) => {
  const items = assets.map(asset => (
    <ThumbnailImage key={asset.checksum} onClick={onClick} {...asset} />
  ))
  return (
    <Container isFluid isMarginless style={{
      'display': 'flex',
      'flexFlow': 'row nowrap',
      'justifyContent': 'center',
      'overflowX': 'auto',
      'paddingTop': '1em'
    }}>
      {items}
    </Container>
  )
}

ThumbnailRow.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      checksum: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onClick: PropTypes.func.isRequired
}

module.exports = {
  ThumbnailRow
}
