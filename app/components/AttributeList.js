//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {Attribute} = require('./Attribute')

// TODO: change to show the top 10 by count
//       maybe use a Dropdown for the rest (or accordion)
// TODO: christina suggests showing the first character of the tags (e.g. 'a' for all 'a' tags)
// TODO: extra filters could be shown via an "accordion"
//       - Bulma-Extensions has an Accordion component
//       - how would this affect the scrolling?

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
