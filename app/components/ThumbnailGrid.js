//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Tile
} = require('bloomer')
const ResizeDetector = require('react-resize-detector').default
const {ThumbnailCard} = require('./ThumbnailCard')

class ThumbnailGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {containerWidth: 0}
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.handleResize = this.handleResize.bind(this)
  }

  handleResize (width, height) {
    // width is a float
    // height is always 0 if handleHeight not specified
    //
    // Using handleHeight prop means this function is called as thumbnails are
    // loaded, so it is of limited usefulness for our purposes.
    this.setState({
      containerWidth: Math.floor(width)
    })
  }

  render () {
    const items = this.state.containerWidth ? (
      this.computeThumbSizes(this.state.containerWidth, this.props.assets).map(asset => (
        <ThumbnailCard key={asset.identifier} imageStyle={{
          'width': asset.scaleWidth,
          'height': asset.scaleHeight,
          'marginBottom': '6px'
        }} {...asset} onClick={this.props.onClick} />
      ))
    ) : (
      this.props.assets.map(asset => (
        <ThumbnailCard key={asset.identifier} imageStyle={{
          'width': 'auto',
          'height': asset.thumbHeight
        }} {...asset} onClick={this.props.onClick} />
      ))
    )
    // Let the Tile use flex to manage the row wrapping of the thumbnails.
    // No need for margins on the images, space-around will do that.
    return (
      <Tile isChild style={{
        'display': 'flex',
        'flexFlow': 'row wrap',
        'justifyContent': 'space-around',
        'alignItems': 'center'
      }}>
        {items}
        <ResizeDetector handleWidth onResize={this.handleResize} />
      </Tile>
    )
  }

  //
  // Preconditions:
  // 1) images are all the same height
  // 2) image height is the desired height for our purposes
  //    (no initial scaling required)
  //
  // Postconditions:
  // 1) images have new scaleWidth/scaleHeight so they fit into neat rows
  // 2) last "row" of images possibly not resized
  //
  computeThumbSizes (containerWidth, assets) {
    // resize the images to fit into neat rows, letting the flex container
    // handle the row wrapping and spacing between them
    let nextOffset = 0
    while (nextOffset < assets.length) {
      nextOffset = this.computeOneRow(containerWidth, assets, nextOffset)
    }
    return assets
  }

  computeOneRow (containerWidth, assets, assetOffset) {
    // find the indices for which the thumbnails exceed the container width
    let offset = assetOffset
    let rowWidth = 0
    const margin = this.props.imageMargin * 2
    do {
      rowWidth += assets[offset].thumbWidth + margin
      offset++
    } while (rowWidth < containerWidth && offset < assets.length)
    if (rowWidth > containerWidth) {
      // resize the images by the ratio that will make them fit the desired width
      const ratio = containerWidth / rowWidth
      for (let idx = assetOffset; idx < offset; idx++) {
        const asset = assets[idx]
        asset.scaleWidth = Math.floor(asset.thumbWidth * ratio)
        asset.scaleHeight = Math.floor(asset.thumbHeight * ratio)
      }
    } else {
      // images that fit within the row retain their original dimensions
      for (let idx = assetOffset; idx < offset; idx++) {
        assets[idx].scaleWidth = assets[idx].thumbWidth
        assets[idx].scaleHeight = assets[idx].thumbHeight
      }
    }
    return offset
  }
}

ThumbnailGrid.defaultProps = {
  imageMargin: 4
}

ThumbnailGrid.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      datetime: PropTypes.instanceOf(Date).isRequired,
      location: PropTypes.string,
      thumbWidth: PropTypes.number.isRequired,
      thumbHeight: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  imageMargin: PropTypes.number,
  onClick: PropTypes.func.isRequired
}

module.exports = {
  ThumbnailGrid
}
