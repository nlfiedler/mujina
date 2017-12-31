//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Card,
  CardContent,
  Content,
  Image,
  Table
} = require('bloomer')

const Thumbnails = () => {
  const card = (
    <Card>
      <CardContent>
        <Image src='images/240x240.png' />
        <Content>
          <small>IMG_1234.JPG - 2016-05-13</small>
        </Content>
      </CardContent>
    </Card>
  )
  const row = (
    <tr>
      <td>{card}</td>
      <td>{card}</td>
      <td>{card}</td>
    </tr>
  )
  return (
    <Table>
      <tbody>
        {row}
        {row}
        {row}
      </tbody>
    </Table>
  )
}

module.exports = {
  Thumbnails
}
