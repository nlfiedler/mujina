//
// Copyright (c) 2017 Nathan Fiedler
//
const {connect} = require('react-redux')
const {toggleYear} = require('../actions')
const {AttributeList} = require('../components/AttributeList')

const mapStateToProps = state => {
  return {
    attributes: state.years
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
