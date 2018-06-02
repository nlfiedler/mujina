//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Box,
  Control,
  Field,
  FieldBody,
  Icon,
  Input,
  Label,
  Media,
  MediaContent,
  MediaLeft
} = require('bloomer')
const rrf = require('react-redux-form')
const preview = require('../preview')

const NewFile = (entry) => {
  const thumbnail = preview.createThumbnailElement(entry.image, entry.mimetype)
  // If identifier is provided, we assume other properties are defined, too.
  return 'identifier' in entry ? (
    <Box>
      <Media>
        <MediaLeft>
          {thumbnail}
          <Label isSize='small'>{entry.name}</Label>
        </MediaLeft>
        <MediaContent>
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
        </MediaContent>
      </Media>
    </Box>
  ) : (
    <Box>
      <Media>
        <MediaLeft>
          {thumbnail}
        </MediaLeft>
        <MediaContent>
          <Field>
            <Label>{entry.name}</Label>
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
        </MediaContent>
      </Media>
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
