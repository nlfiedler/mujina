//
// Copyright (c) 2019 Nathan Fiedler
//
const { connect } = require('react-redux')
const { toggleYear } = require('../actions')
const { AttributeList } = require('../components/AttributeList')

const mapStateToProps = state => {
  // Sort the years in descending order so the most recent appears first in the
  // list, rather than last.
  const items = state.years.items.sort((a, b) => {
    return Number.parseInt(b.label) - Number.parseInt(a.label)
  })
  return {
    attributes: Object.assign({}, state.years, {items})
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAttrClick: label => {
      dispatch(toggleYear(label))
    }
  }
}

const YearList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeList)

module.exports = {
  YearList
}
