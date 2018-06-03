//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Button,
  Column,
  Columns,
  Control,
  Field,
  Icon,
  Label
} = require('bloomer')
const rrf = require('react-redux-form')
const config = require('../config')
const {history} = require('../store')

class OptionsForm extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (options) {
    this.props.onSubmit(options)
  }

  componentWillMount () {
    this.props.populateForm(config.getOptions())
  }

  render () {
    return (
      <rrf.Form
        model='options'
        onSubmit={(options) => this.handleSubmit(options)}
      >
        <Field>
          <Control>
            <Label>Host</Label>
            <rrf.Control.text
              model='options.backend_host'
              id='options.backend_host'
              className='input'
            />
            <p className='help'>Enter the name or IP address of the backend server</p>
          </Control>
        </Field>
        <Field>
          <Control>
            <Label>Port</Label>
            <rrf.Control.text
              type='number'
              min='1'
              max='65535'
              model='options.backend_port'
              id='options.backend_port'
              className='input'
            />
            <p className='help'>Enter the port number of the backend server</p>
          </Control>
        </Field>
        <Columns>
          <Column>
            <Button isActive isColor='primary' type='submit'>Save</Button>
          </Column>
          <Column hasTextAlign='right'>
            <Button isOutlined isColor='warning' onClick={() => history.push('/')}>
              <Icon isSize='medium' className='fa fa-trash' />
            </Button>
          </Column>
        </Columns>
      </rrf.Form>
    )
  }
}

module.exports = {
  OptionsForm
}
