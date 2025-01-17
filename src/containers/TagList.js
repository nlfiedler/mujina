//
// Copyright (c) 2019 Nathan Fiedler
//
const { connect } = require('react-redux')
const { toggleTag } = require('../actions')
const { AttributeList } = require('../components/AttributeList')

const mapStateToProps = state => {
  return {
    attributes: state.tags
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAttrClick: label => {
      dispatch(toggleTag(label))
    }
  }
}

const TagList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributeList)

module.exports = {
  TagList
}
