//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardImage,
  Control,
  Delete,
  Field,
  FieldBody,
  FieldLabel,
  Icon,
  Image,
  Navbar,
  NavbarBrand,
  NavbarEnd,
  NavbarItem,
  NavbarMenu,
  NavbarStart
} = require('bloomer')
const rrf = require('react-redux-form')
const config = require('../config')
const {history} = require('../store')

// TODO: have a tooltip on the Save button
// TODO: use Bulma-Extensions TagsInput for the tags field
class AssetEditor extends React.Component {
  constructor (props) {
    super(props)
    this.details = props.details
    this.onSubmit = props.onSubmit
    this.populateForm = props.populateForm
  }

  handleSubmit (details) {
    const updated = Object.assign({}, this.details, details)
    updated.tags = details.tags.split(',').map(t => t.trim())
    this.onSubmit(updated)
  }

  componentWillMount () {
    this.populateForm(Object.assign({}, this.details, {
      tags: this.details.tags.join(', ')
    }))
  }

  render () {
    const {checksum, filename} = this.details
    const previewUrl = config.serverUrl({pathname: '/preview/' + checksum})
    return (
      <Card>
        <CardHeader>
          <Navbar isTransparent style={{'width': '100%'}}>
            <NavbarBrand>
              <NavbarItem>
                {filename}
              </NavbarItem>
            </NavbarBrand>
            <NavbarMenu>
              <NavbarStart>
                <NavbarItem>
                  <Button type='submit' form='editorForm'>
                    <Icon isSize='medium' className='fa fa-save' />
                  </Button>
                </NavbarItem>
              </NavbarStart>
              <NavbarEnd>
                <NavbarItem>
                  <Delete onClick={() => history.push('/asset/' + checksum)} />
                </NavbarItem>
              </NavbarEnd>
            </NavbarMenu>
          </Navbar>
        </CardHeader>
        <CardImage hasTextAlign='centered'>
          <Image alt={checksum} src={previewUrl} />
        </CardImage>
        <CardContent>
          <rrf.Form
            model='editor'
            id='editorForm'
            onSubmit={(details) => this.handleSubmit(details)}
          >
            <Field isHorizontal>
              <FieldLabel isNormal>Caption</FieldLabel>
              <FieldBody>
                <Field>
                  <Control isExpanded hasIcons={['left', 'right']}>
                    <rrf.Control.text
                      model='editor.caption'
                      id='editor.caption'
                      className='input'
                      placeholder='Description with optional #tags and a @location'
                    />
                    <Icon isSize='small' isAlign='left'><span className='fa fa-quote-left' /></Icon>
                    <Icon isSize='small' isAlign='right'><span className='fa fa-quote-right' /></Icon>
                  </Control>
                </Field>
              </FieldBody>
            </Field>
            <Field isHorizontal>
              <FieldLabel isNormal>Location</FieldLabel>
              <FieldBody>
                <Field>
                  <Control isExpanded hasIcons='left'>
                    <rrf.Control.text
                      model='editor.location'
                      id='editor.location'
                      className='input'
                    />
                    <Icon isSize='small' isAlign='left'><span className='fa fa-map-marker' /></Icon>
                  </Control>
                </Field>
              </FieldBody>
            </Field>
            <Field isHorizontal>
              <FieldLabel isNormal>Tags</FieldLabel>
              <FieldBody>
                <Field>
                  <Control isExpanded hasIcons='left'>
                    <rrf.Control.text
                      model='editor.tags'
                      id='editor.tags'
                      className='input'
                      placeholder='Comma-separated keywords'
                    />
                    <Icon isSize='small' isAlign='left'><span className='fa fa-tag' /></Icon>
                  </Control>
                </Field>
              </FieldBody>
            </Field>
          </rrf.Form>
        </CardContent>
      </Card>
    )
  }
}

AssetEditor.propTypes = {
  details: PropTypes.shape({
    checksum: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    filesize: PropTypes.number.isRequired,
    datetime: PropTypes.instanceOf(Date).isRequired,
    mimetype: PropTypes.string.isRequired,
    location: PropTypes.string,
    userdate: PropTypes.instanceOf(Date),
    caption: PropTypes.string,
    duration: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
}

module.exports = {
  AssetEditor
}
