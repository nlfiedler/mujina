//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')

const Attribute = ({onClick, label, active}) => {
  return (
    <li className={active ? 'tag-active' : 'tag-plain'}><a
      href=''
      className='tag-link'
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      {label}
    </a></li>
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
