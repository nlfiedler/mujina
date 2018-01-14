//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {Attribute} = require('./Attribute')
const {MenuList} = require('bloomer')

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
