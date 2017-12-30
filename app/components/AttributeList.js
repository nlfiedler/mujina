//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {Attribute} = require('./Attribute')
const {MenuList} = require('bloomer')

const AttributeList = ({attributes, onAttrClick}) => (
  <MenuList>
    {attributes.map((attr) => (
      <Attribute key={attr.label} onClick={() => onAttrClick(attr.label)} {...attr} />
    ))}
  </MenuList>
)

AttributeList.propTypes = {
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
      count: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  onAttrClick: PropTypes.func.isRequired
}

module.exports = {
  AttributeList
}
