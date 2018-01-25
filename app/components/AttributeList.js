//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {Attribute} = require('./Attribute')
const {MenuList} = require('bloomer')

// TODO: change to show the top 10 by count
//       maybe use a Dropdown for the rest (or accordion)
// TODO: extra filters could be shown via an "accordion"
//       - Bulma-Extensions has an Accordion component
//       - how would this affect the scrolling?

const AttributeList = ({attributes, onAttrClick, iconName}) => {
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
      <Attribute key={attr.label} onClick={onAttrClick} {...attr} iconName={iconName} />
    ))
  }
  return (
    <MenuList>
      {inner}
    </MenuList>
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
