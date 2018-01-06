//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Message,
  MessageBody,
  MessageHeader
} = require('bloomer')

const ErrorMessage = ({error}) => (
  <Message>
    <MessageHeader>
      <p>Uh oh, something went wrong...</p>
    </MessageHeader>
    <MessageBody>
      {error}
    </MessageBody>
  </Message>
)

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired
}

module.exports = {
  ErrorMessage
}
