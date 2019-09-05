//
// Copyright (c) 2019 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Message,
  MessageBody,
  MessageHeader
} = require('bloomer')

const ErrorMessage = ({ error }) => (
  <Message>
    <MessageHeader>
      <p>Uh oh, something went wrong...</p>
    </MessageHeader>
    <MessageBody>
      {error.stack || error.toString() || 'missing error stack and message!'}
    </MessageBody>
  </Message>
)

ErrorMessage.propTypes = {
  error: PropTypes.object.isRequired
}

module.exports = {
  ErrorMessage
}
