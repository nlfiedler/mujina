//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Container,
  Table
} = require('bloomer')
const config = require('../config')

// TODO: maybe add a ":hover" style to the thumbnails, like with buttons
// TODO: show placeholders for images that fail to load (use 'onerror' handler)
// TODO: if no assets, show a message "No matching assets..."
// TODO: add Carousel style buttons for more obvious horizontal scrolling
const ThumbnailImage = ({checksum, filename, onClick}) => {
  const thumbnailUrl = config.serverUrl({pathname: '/thumbnail/' + checksum})
  // Would like to use Image, but really need the combination of figure and
  // img with the styles applied on the appropriate element, and Image does
  // not offer that level of control.
  return (
    <td style={{'paddingBottom': 0, 'paddingTop': 0}}>
      <figure className='image is-96x96'>
        <img
          style={{'objectFit': 'cover', 'height': '96px', 'width': '96px'}}
          src={thumbnailUrl}
          onClick={() => onClick(checksum)}
        />
      </figure>
    </td>
  )
}

const ThumbnailRow = ({assets, onClick}) => {
  const items = assets.map(asset => (
    <ThumbnailImage key={asset.checksum} onClick={onClick} {...asset} />
  ))
  // Use a Table with a single row to get horizontal scrolling.
  // Overflow property does not work on the Table itself.
  return (
    <Container isFluid isMarginless style={{'overflowX': 'auto'}}>
      <Table isMarginless>
        <tbody>
          <tr>
            {items}
          </tr>
        </tbody>
      </Table>
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
