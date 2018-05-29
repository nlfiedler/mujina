//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {Attribute} = require('./Attribute')

const AttributeList = ({attributes, onAttrClick}) => {
  let inner = null
  if (attributes.isPending) {
    inner = 'loading...'
  } else if (attributes.error) {
    if (attributes.error.message) {
      inner = attributes.error.message
    } else {
      inner = '(error)'
    }
  } else if (attributes.items.length === 0) {
    inner = '(none)'
  } else {
    inner = attributes.items.map((attr) => (
      <Attribute key={attr.label} onClick={onAttrClick} {...attr} />
    ))
  }
  // The div needs a height of 100% or some elements (at the top) will get
  // cut off and the scrolling never reveals them.
  //
  // Need to set the width or it fills the parent. Probably should have used
  // Columns or Tiles with width property.
  //
  // Use block formatting instead of flex, otherwise the elements spread out
  // vertically and there is seemingly no flex way to fix that.
  return (
    <div className='tags' style={{
      'display': 'block',
      'width': '11em',
      'height': '100%'
    }}>
      {inner}
    </div>
  )
}

AttributeList.propTypes = {
  attributes: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
        count: PropTypes.number.isRequired
      }).isRequired
    ).isRequired,
    isPending: PropTypes.bool.isRequired,
    error: PropTypes.object
  }).isRequired,
  onAttrClick: PropTypes.func.isRequired
}

module.exports = {
  AttributeList
}
