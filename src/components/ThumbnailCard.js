//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const FadeIn = require('react-lazyload-fadein').default
const config = require('../config')

// Use https://github.com/Swizec/react-lazyload-fadein to lazily load the image
// when the component becomes visible, then fade in the image using CSS.
class ThumbnailCard extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.state = {
      imageUrl: config.serverUrl({ pathname: props.widethumbUrl })
    }
    this.onError = this.onError.bind(this)
  }

  onError () {
    this.setState({
      imageUrl: 'images/picture-1.svg'
    })
  }

  render () {
    return (
      <FadeIn height={this.props.thumbHeight} duration={300}>
        {(onload) => (
          <figure className='image' style={{ 'cursor': 'pointer' }}>
            <img
              alt={this.props.filename}
              style={this.props.imageStyle}
              src={this.state.imageUrl}
              onLoad={onload}
              onError={this.onError}
              onClick={() => this.props.onClick(this.props.identifier)}
            />
          </figure>
        )}
      </FadeIn>
    )
  }
}

ThumbnailCard.propTypes = {
  identifier: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  datetime: PropTypes.instanceOf(Date).isRequired,
  location: PropTypes.string,
  thumbWidth: PropTypes.number.isRequired,
  thumbHeight: PropTypes.number.isRequired,
  widethumbUrl: PropTypes.string.isRequired
}

module.exports = {
  ThumbnailCard
}
