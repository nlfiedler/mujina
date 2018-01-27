//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Box,
  Control,
  Field,
  Icon,
  Label,
  Media,
  MediaContent,
  MediaLeft
} = require('bloomer')
const rrf = require('react-redux-form')
const preview = require('../preview')

// TODO: add a trash icon to remove a single file from the uploads list
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
            <Control isExpanded hasIcons={['left', 'right']}>
              <rrf.Control.text
                model={`drops[${kagi}].caption`}
                id={`drops[${kagi}].caption`}
                className='input'
                placeholder='Description with optional #tags and a @location'
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

//
// old tags/location field combo
//
// <Field isGrouped>
//   <Control isExpanded hasIcons='left'>
//     <rrf.Control.text
//       model={`drops[${kagi}].tags`}
//       id={`drops[${kagi}].tags`}
//       className='input'
//       placeholder='Tags'
//     />
//     <Icon isSize='small' isAlign='left'><span className='fa fa-hashtag' /></Icon>
//     <p className='help'>Enter comma-separated labels</p>
//   </Control>
//   <Control hasIcons='left'>
//     <rrf.Control.text
//       model={`drops[${kagi}].location`}
//       id={`drops[${kagi}].location`}
//       className='input'
//       placeholder='Location'
//     />
//     <Icon isSize='small' isAlign='left'><span className='fa fa-map-marker' /></Icon>
//   </Control>
// </Field>
