//
// Copyright (c) 2018 Nathan Fiedler
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
const datefmt = require('date-fns/format')

class AssetEditor extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (details) {
    const updated = Object.assign({}, this.props.details, details)
    updated.tags = details.tags.split(',').map(t => t.trim())
    if (details.userdate) {
      // Parse the ISO 8601 formatted input date, if available.
      // Because the input type is datetime-local, we use the
      // local version of Date, and not Date.UTC()
      updated.userdate = new Date(details.userdate)
    } else {
      // do not leave the userdate as a blank string, it must
      // be either a Date or null
      updated.userdate = null
    }
    this.props.onSubmit(updated)
  }

  componentWillMount () {
    const userdate = this.props.details.userdate ? (
      // yes, a date library just so we can format the date, seriously
      datefmt(this.props.details.userdate, 'YYYY-MM-DD[T]HH:mm:ss')
    ) : ''
    this.props.populateForm(Object.assign({}, this.props.details, {
      tags: this.props.details.tags.join(', '),
      userdate
    }))
  }

  render () {
    const {identifier, filename} = this.props.details
    const previewUrl = config.serverUrl({pathname: '/preview/' + identifier})
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
                  <Delete onClick={() => history.push('/asset/' + identifier)} />
                </NavbarItem>
              </NavbarEnd>
            </NavbarMenu>
          </Navbar>
        </CardHeader>
        <CardImage hasTextAlign='centered' style={{
          'paddingTop': '1em'
        }}>
          <figure alt={identifier} className='image'>
            <img src={previewUrl} style={{
              'display': 'inline-block',
              'width': '400px',
              'height': '400px',
              'objectFit': 'cover'
            }} />
          </figure>
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
            <Field isHorizontal>
              <FieldLabel isNormal>Custom Date</FieldLabel>
              <FieldBody>
                <Field>
                  <Control isExpanded hasIcons='left'>
                    <rrf.Control.input
                      type='datetime-local'
                      model='editor.userdate'
                      id='editor.userdate'
                      className='input'
                      placeholder='Optional custom date/time'
                    />
                    <Icon isSize='small' isAlign='left'><span className='fa fa-calendar' /></Icon>
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
  // encapsulate the asset properties in another object for the sake
  // of easy copying using Object.assign()
  details: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    filesize: PropTypes.number.isRequired,
    datetime: PropTypes.instanceOf(Date).isRequired,
    mimetype: PropTypes.string.isRequired,
    location: PropTypes.string,
    userdate: PropTypes.instanceOf(Date),
    caption: PropTypes.string,
    duration: PropTypes.number,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
}

module.exports = {
  AssetEditor
}
