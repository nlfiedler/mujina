//
// Copyright (c) 2018 Nathan Fiedler
//
const _ = require('lodash')
const React = require('react')
const PropTypes = require('prop-types')
const {
  Card,
  CardContent,
  Level,
  LevelItem,
  LevelLeft,
  LevelRight
} = require('bloomer')
const VisibilitySensor = require('react-visibility-sensor')
const config = require('../config')

const imagePlaceholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

class ThumbnailCard extends React.Component {
  constructor (props) {
    super(props)
    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.onImageLoad = this.onImageLoad.bind(this)
    this.imageElement = null
    this.state = {visible: false}
    this.imageDimensions = {width: 240, height: 240}
  }

  onVisibilityChange (isVisible) {
    // Switch visibility via state change to trigger a render.
    this.setState({
      visible: isVisible
    })
  }

  onImageLoad () {
    // Save the dimensions of the actual image so we can replace it with one
    // that is exactly the same size later.
    this.imageDimensions = {
      width: this.imageElement.naturalWidth || this.imageElement.width,
      height: this.imageElement.naturalHeight || this.imageElement.height
    }
  }

  getImageComponent () {
    const {checksum, filename, onClick} = this.props
    // TODO: show video thumbnails using video HTML tag so they can play directly
    // TODO: show selected frames from videos on hover
    // TODO: show placeholder icons for thumbnails that fail to load (use 'onerror' handler)

    // Use figure/img rather than Image for greater style control. In
    // particular, set the width to 'auto' to prevent stretching.

    // Initially the images are assumed to be not visible and a single-pixel
    // transparent image is stretched to fit a 240x240 box. When the component
    // is made visible, the state is changed and the real image is fetched. Once
    // that image has been loaded, its dimensions are saved. Those values are
    // used to replace the image with one that is exactly the same dimensions in
    // the event that the component becomes invisible (due to scrolling). This
    // prevents the container from re-flowing the components due to size change,
    // and changing what is visible.
    return this.state.visible ? (
      <figure className='image'>
        <img
          alt={filename}
          style={{'width': 'auto'}}
          src={config.serverUrl({pathname: '/thumbnail/' + checksum})}
          onClick={() => onClick(checksum)}
          ref={(image) => { this.imageElement = image }}
          onLoad={this.onImageLoad}
        />
      </figure>
    ) : (
      <figure className='image'>
        <img
          style={{
            'objectFit': 'cover',
            'width': `${this.imageDimensions.width}px`,
            'height': `${this.imageDimensions.height}px`
          }}
          src={imagePlaceholder}
        />
      </figure>
    )
  }

  render () {
    const shortName = _.truncate(this.props.filename, {length: 24})
    return (
      <VisibilitySensor onChange={this.onVisibilityChange} partialVisibility>
        <Card style={{'boxShadow': 'none'}}>
          <CardContent>
            {this.getImageComponent()}
            <Level>
              <LevelLeft>
                <LevelItem><small>{shortName}</small></LevelItem>
              </LevelLeft>
              <LevelRight>
                <LevelItem><small>{this.props.datetime.toLocaleDateString()}</small></LevelItem>
              </LevelRight>
            </Level>
          </CardContent>
        </Card>
      </VisibilitySensor>
    )
  }
}

ThumbnailCard.propTypes = {
  checksum: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  datetime: PropTypes.instanceOf(Date).isRequired,
  location: PropTypes.string
}

module.exports = {
  ThumbnailCard
}
