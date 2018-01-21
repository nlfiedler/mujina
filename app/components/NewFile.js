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
  Icon,
  Label,
  Media,
  MediaContent,
  MediaLeft
} = require('bloomer')
const rrf = require('react-redux-form')
const preview = require('../preview')

// TODO: write a function to parse the tags and location out of the "caption"
//       1. split on whitespace
//       2. anything starting with '#' is treated as a tag
//       3. first thing started with '@' is treated as location
//       4. use original value as caption
// TODO: replace 'tags' and 'location' fields with one 'caption'
// TODO: include form field for caption and add to api.uploadFiles()
// TODO: try to center the image vertically
const NewFile = ({kagi, name, path, size, mimetype, image}) => {
  const thumbnail = preview.createThumbnailElement(image, mimetype)
  return (
    <Box>
      <Media>
        <MediaLeft>
          {thumbnail}
        </MediaLeft>
        <MediaContent>
          <Field>
            <Label>{name}</Label>
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
        </MediaContent>
      </Media>
    </Box>
  )
}

NewFile.propTypes = {
  kagi: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  mimetype: PropTypes.string.isRequired,
  image: PropTypes.string
}

module.exports = {
  NewFile
}
