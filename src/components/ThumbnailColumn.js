//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Box
} = require('bloomer')
const VisibilitySensor = require('react-visibility-sensor').default
const config = require('../config')

class ThumbnailImage extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.onError = this.onError.bind(this)
    this.state = {
      imageUrl: config.serverUrl({ pathname: this.props.thumbnailUrl }),
      visible: false
    }
  }

  onVisibilityChange (isVisible) {
    // Switch visibility via state change to trigger a render.
    this.setState({
      visible: isVisible
    })
  }

  onError () {
    this.setState({
      imageUrl: 'images/picture-1.svg'
    })
  }

  getImageComponent () {
    const { identifier, onClick } = this.props
    return this.state.visible ? (
      <img
        style={{ 'objectFit': 'cover', 'height': '96px', 'width': '96px' }}
        src={this.state.imageUrl}
        onError={this.onError}
        onClick={() => onClick(identifier)}
      />
    ) : (
      <img
        style={{ 'height': '96px', 'width': '96px' }}
        src='images/picture-1.svg'
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
        'cursor': 'pointer'
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

const ThumbnailColumn = ({ assets, onClick }) => {
  const items = assets.map(asset => (
    <ThumbnailImage key={asset.identifier} onClick={onClick} {...asset} />
  ))
  //
  // Because of the fixed position, the panel must have a width applied to it
  // directly, and for the best effect, it should match the parent value, which
  // is for the entire window width.
  //
  return (
    <div style={{
      'height': '100vh',
      'width': '25%',
      'position': 'fixed',
      'top': 0,
      'left': 0
    }}>
      <Box style={{
        'margin': '1rem',
        'padding': '1rem',
        'display': 'flex',
        'height': '95%',
        'width': '20em'
      }}>
        <div style={{
          'display': 'flex',
          'flexFlow': 'row wrap',
          'overflowY': 'auto',
          'alignContent': 'flex-start'
        }}>
          {items}
        </div>
      </Box>
    </div>
  )
}

ThumbnailColumn.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      datetime: PropTypes.instanceOf(Date).isRequired,
      location: PropTypes.string,
      thumbnailUrl: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onClick: PropTypes.func.isRequired
}

module.exports = {
  ThumbnailColumn
}
