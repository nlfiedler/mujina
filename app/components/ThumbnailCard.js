//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const FadeIn = require('react-lazyload-fadein').default
const config = require('../config')

// Use https://github.com/Swizec/react-lazyload-fadein to lazily load the image
// when the component becomes visible, then fade in the image using CSS.
const ThumbnailCard = (props) => (
  <FadeIn height={props.thumbHeight} duration={300}>
    {(onload) => (
      <figure className='image'>
        <img
          alt={props.filename}
          style={props.imageStyle}
          src={config.serverUrl({pathname: '/widethumb/' + props.identifier})}
          onLoad={onload}
          onClick={() => props.onClick(props.identifier)}
        />
      </figure>
    )}
  </FadeIn>
)

ThumbnailCard.propTypes = {
  identifier: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  datetime: PropTypes.instanceOf(Date).isRequired,
  location: PropTypes.string,
  thumbWidth: PropTypes.number.isRequired,
  thumbHeight: PropTypes.number.isRequired
}

module.exports = {
  ThumbnailCard
}
