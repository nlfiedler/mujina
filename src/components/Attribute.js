//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Tag
} = require('bloomer')

const Attribute = ({onClick, label, active}) => {
  const color = active ? 'dark' : 'light'
  return (
    <Tag tag='a'
      isColor={color}
      onClick={e => {
        e.preventDefault()
        onClick(label)
      }}
    >
      {label}
    </Tag>
  )
}

Attribute.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired
}

module.exports = {
  Attribute
}
