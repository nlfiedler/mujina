//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Button,
  Column,
  Columns,
  Icon
} = require('bloomer')
const {NewFile} = require('./NewFile')
const {UploadingFiles} = require('../containers/UploadingFiles')
const {Form} = require('react-redux-form')
const {history} = require('../store')

class NewFileList extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReject = this.handleReject.bind(this)
  }

  handleSubmit (drops) {
    // Build a mapping of the keys to the file objects.
    const filesByKey = new Map()
    this.props.uploads.pending.forEach((elem) => {
      // Clone the file objects since we will be modifying them.
      filesByKey.set(elem.checksum, Object.assign({}, elem))
    })
    // The form values are contained in objects within 'drops', keyed by the
    // checksum values, which are properties of the drops object.
    for (const prop in drops) {
      // Not all properties of the drops object are keyed inputs;
      // seems like a $form property is also introduced at some point.
      if (drops.hasOwnProperty(prop) && filesByKey.has(prop)) {
        Object.assign(filesByKey.get(prop), drops[prop])
      }
    }
    // Collect the results and submit to the backend.
    const files = Array.from(filesByKey.values())
    this.props.onSubmit(files)
  }

  handleReject () {
    this.props.onDiscard(new Error('user cancelled'))
    history.push('/')
  }

  render () {
    let message = this.props.uploads.isPending && (
      <p><em>Processing uploads...</em></p>
    )
    let inner = this.props.uploads.pending.map((file) => (
      <NewFile key={file.checksum} {...file} />
    ))
    return (
      <Form
        model='drops'
        onSubmit={(drops) => this.handleSubmit(drops)}
      >
        {message}
        {inner}
        <Columns>
          <Column hasTextAlign='centered' className='is-one-fifth'>
            <Button isActive isColor='primary' type='submit'>Save</Button>
          </Column>
          <Column className='is-three-fifths'>
            <UploadingFiles />
          </Column>
          <Column hasTextAlign='centered' className='is-one-fifth'>
            <Button isOutlined isColor='warning' onClick={() => this.handleReject()}>
              <Icon isSize='medium' className='fa fa-trash' />
            </Button>
          </Column>
        </Columns>
      </Form>
    )
  }
}

NewFileList.propTypes = {
  uploads: PropTypes.shape({
    pending: PropTypes.arrayOf(
      PropTypes.shape({
        checksum: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        mimetype: PropTypes.string.isRequired
      })
    ).isRequired,
    isPending: PropTypes.bool.isRequired,
    error: PropTypes.object
  }),
  onSubmit: PropTypes.func.isRequired
}

module.exports = {
  NewFileList
}
