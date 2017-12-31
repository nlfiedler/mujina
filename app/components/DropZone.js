//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Card,
  CardContent,
  CardHeader,
  CardHeaderIcon,
  CardHeaderTitle,
  CardImage,
  Icon,
  Image
} = require('bloomer')

const DropZone = () => (
  <Card>
    <CardHeader>
      <CardHeaderTitle>
        Drop Zone
      </CardHeaderTitle>
      <CardHeaderIcon>
        <Icon isSize='large' icon='cloud-upload' />
      </CardHeaderIcon>
    </CardHeader>
    <CardImage id='drop'>
      <Image isRatio='1:1' src='images/128x128.png' />
    </CardImage>
    <CardContent>
      <div id='status'>&nbsp;</div>
    </CardContent>
  </Card>
)

module.exports = {
  DropZone
}
