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
  Content,
  Icon,
  Image,
  Menu,
  MenuLabel,
  Table,
  Tile
} = require('bloomer')
const {LocationList} = require('../containers/LocationList')
const {TagList} = require('../containers/TagList')
const {YearList} = require('../containers/YearList')

const App = () => (
  <Tile isAncestor style={{margin: 0}}>
    <Tile isSize={2} isVertical isParent>
      <Tile isChild>
        <Menu>
          <MenuLabel>Tags</MenuLabel>
          <TagList />
          <MenuLabel>Locations</MenuLabel>
          <LocationList />
          <MenuLabel>Years</MenuLabel>
          <YearList />
        </Menu>
      </Tile>
    </Tile>
    <Tile isSize={8} isParent>
      <Tile isChild>
        <Table>
          <tbody>
            <tr>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
            </tr>
            <tr>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
            </tr>
            <tr>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
              <td>
                <Card>
                  <CardContent>
                    <Image src='images/240x240.png' />
                    <Content>
                      <small>IMG_1234.JPG - 2016-05-13</small>
                    </Content>
                  </CardContent>
                </Card>
              </td>
            </tr>
          </tbody>
        </Table>
      </Tile>
    </Tile>
    <Tile isSize={2} isParent>
      <Tile isChild>
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
      </Tile>
    </Tile>
  </Tile>
)

module.exports = {
  App
}
