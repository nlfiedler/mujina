//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Button
} = require('bloomer')
const {NewFile} = require('./NewFile')
const {Form} = require('react-redux-form')

class NewFileList extends React.Component {
  constructor (props) {
    super(props)
    this.files = props.files
    this.onSubmit = props.onSubmit
  }

  handleSubmit (drops) {
    // Build a mapping of the keys to the file objects.
    const filesByKey = new Map()
    this.files.forEach((elem) => {
      // Clone the file objects since we will be modifying them.
      filesByKey.set(elem.kagi, Object.assign({}, elem))
    })
    // The form values are contained in objects within 'drops', keyed by the
    // kagi values, which are properties of the drops object.
    for (const prop in drops) {
      if (drops.hasOwnProperty(prop)) {
        Object.assign(filesByKey.get(prop), drops[prop])
      }
    }
    // Collect the results and submit to the backend.
    const files = Array.from(filesByKey.values())
    this.onSubmit(files)
  }

  render () {
    let inner = this.files.map((file) => (
      <NewFile key={file.kagi} {...file} />
    ))
    return (
      <Form
        model='drops'
        onSubmit={(drops) => this.handleSubmit(drops)}
      >
        {inner}
        <Button isActive isColor='primary' type='submit'>Save</Button>
      </Form>
    )
  }
}

NewFileList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      kagi: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      mimetype: PropTypes.string.isRequired
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired
}

module.exports = {
  NewFileList
}
