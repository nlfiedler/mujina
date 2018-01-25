//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Icon,
  MenuLink
} = require('bloomer')

const Attribute = ({onClick, label, active, iconName}) => {
  return (
    <li>
      <MenuLink
        isActive={active}
        onClick={e => {
          e.preventDefault()
          onClick(label)
        }}
      >
        <Icon isSize='small' className={iconName} />
        {label}
      </MenuLink>
    </li>
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
