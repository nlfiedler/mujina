//
// Copyright (c) 2017 Nathan Fiedler
//
const {connect} = require('react-redux')
const {toggleLocation} = require('../actions')
const {AttributeList} = require('../components/AttributeList')

const mapStateToProps = state => {
  return {
    attributes: state.locations
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAttrClick: label => {
      dispatch(toggleLocation(label))
    }
  }
}

const LocationList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeList)

module.exports = {
  LocationList
}
