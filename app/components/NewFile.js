//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Box,
  Control,
  Field,
  FieldBody,
  FieldLabel,
  Icon,
  Label
} = require('bloomer')
const rrf = require('react-redux-form')

const NewFile = ({kagi, name, path, size, mimetype}) => {
  return (
    <Box>
      <Field isHorizontal>
        <FieldLabel isNormal>
          <Label>{name}</Label>
        </FieldLabel>
        <FieldBody>
          <Field isGrouped>
            <Control isExpanded hasIcons='left'>
              <rrf.Control.text
                model={`drops[${kagi}].tags`}
                id={`drops[${kagi}].tags`}
                className='input'
                placeholder='Tags'
              />
              <Icon isSize='small' isAlign='left'><span className='fa fa-hashtag' /></Icon>
              <p className='help'>Enter comma-separated labels</p>
            </Control>
            <Control hasIcons='left'>
              <rrf.Control.text
                model={`drops[${kagi}].location`}
                id={`drops[${kagi}].location`}
                className='input'
                placeholder='Location'
              />
              <Icon isSize='small' isAlign='left'><span className='fa fa-map-marker' /></Icon>
            </Control>
          </Field>
        </FieldBody>
      </Field>
    </Box>
  )
}

NewFile.propTypes = {
  kagi: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  mimetype: PropTypes.string.isRequired
}

module.exports = {
  NewFile
}
