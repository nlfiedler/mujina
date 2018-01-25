//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const PropTypes = require('prop-types')
const {
  Button,
  Icon,
  LevelItem,
  LevelLeft,
  Tile
} = require('bloomer')
const {Asset} = require('../containers/Asset')
const {AssetSidebar} = require('../containers/AssetSidebar')
const {history} = require('../store')

const AssetPage = () => {
  //
  // TODO: another layout idea
  //       1. selectors on left
  //       2. sidebar next to selectors
  //       3. detail tile next to sidebar
  //       4. detail tile has close button
  //          (returns to thumbnail grid)
  //
  // TODO: maybe use Navbar instead of Level for the Home button
  // TODO: should the home button be above the sidebar?
  // TODO: ensure the right tile remains at the top of the window (does not scroll away)
  //       (need lots more assets to test with)
  // TODO: allow dragging out images (and videos?) as a form of export
  //       (likely need a "File > Export" option with Save dialog for larger files)
  return (
    <Tile isAncestor style={{margin: 0}}>
      <Tile isSize={2} isVertical isParent>
        <Tile isChild>
          <AssetSidebar />
        </Tile>
      </Tile>
      <Tile isSize={10} isVertical isParent>
        <Tile isChild>
          <LevelLeft>
            <LevelItem>
              <Button isLink isOutlined onClick={() => history.push('/')}>
                <Icon isSize='medium' className='fa fa-home' />
              </Button>
            </LevelItem>
          </LevelLeft>
        </Tile>
        <Tile isChild>
          <Asset />
        </Tile>
      </Tile>
    </Tile>
  )
}

AssetPage.propTypes = {
  // match is provided by react-router
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
}

module.exports = {
  AssetPage
}
