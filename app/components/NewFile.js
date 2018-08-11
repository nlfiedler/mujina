//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Box,
  Column,
  Columns,
  Control,
  Field,
  FieldBody,
  Icon,
  Input,
  Label
} = require('bloomer')
const rrf = require('react-redux-form')
const preview = require('../preview')

const NewFile = (entry) => {
  const thumbnail = preview.createThumbnailElement(entry.image, entry.mimetype)
  // If identifier is provided, we assume other properties are defined, too.
  return 'identifier' in entry ? (
    <Box>
      <Columns>
        <Column className='is-one-fifth'>
          {thumbnail}
          <Label isSize='small' style={{'wordWrap': 'break-word'}}>{entry.name}</Label>
        </Column>
        <Column className='is-four-fifths'>
          <Field isHorizontal>
            <FieldBody>
              <Field isGrouped>
                <Control isExpanded hasIcons='left'>
                  <Input type='text' disabled value={entry.tags || ''} placeholder='Tags' />
                  <Icon isSize='small' isAlign='left'><span className='fa fa-tag' /></Icon>
                </Control>
              </Field>
              <Field>
                <Control isExpanded hasIcons='left'>
                  <Input type='text' disabled value={entry.location || ''} placeholder='Location' />
                  <Icon isSize='small' isAlign='left'><span className='fa fa-map-marker' /></Icon>
                </Control>
              </Field>
            </FieldBody>
          </Field>
          <Field isHorizontal>
            <FieldBody>
              <Field>
                <Control isExpanded hasIcons={['left', 'right']}>
                  <Input type='text' disabled value={entry.caption || ''} placeholder='Caption' />
                  <Icon isSize='small' isAlign='left'><span className='fa fa-quote-left' /></Icon>
                  <Icon isSize='small' isAlign='right'><span className='fa fa-quote-right' /></Icon>
                </Control>
                <p className='help'>This asset was saved previously</p>
              </Field>
            </FieldBody>
          </Field>
        </Column>
      </Columns>
    </Box>
  ) : (
    <Box>
      <Columns>
        <Column className='is-one-fifth'>
          {thumbnail}
        </Column>
        <Column className='is-four-fifths'>
          <Field>
            <Label style={{'wordWrap': 'break-word'}}>{entry.name}</Label>
            <Control isExpanded hasIcons={['left', 'right']}>
              <rrf.Control.text
                model={`drops[${entry.checksum}].caption`}
                id={`drops[${entry.checksum}].caption`}
                className='input'
                placeholder='Caption with #tags and @location or @"some location"'
              />
              <Icon isSize='small' isAlign='left'><span className='fa fa-quote-left' /></Icon>
              <Icon isSize='small' isAlign='right'><span className='fa fa-quote-right' /></Icon>
              <p className='help'>Enter a description, including #tags and @location</p>
            </Control>
          </Field>
        </Column>
      </Columns>
    </Box>
  )
}

NewFile.propTypes = {
  checksum: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  mimetype: PropTypes.string.isRequired,
  identifier: PropTypes.string,
  image: PropTypes.string,
  location: PropTypes.string,
  caption: PropTypes.string,
  tags: PropTypes.arrayOf(
    PropTypes.string
  )
}

module.exports = {
  NewFile
}
