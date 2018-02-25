//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Tile
} = require('bloomer')
const {AssetFilters} = require('./AssetFilters')
const {Thumbnails} = require('../containers/Thumbnails')

// The default padding on the parent tile causes the asset filters to be too
// large by that same amount, so remove all padding from the left tile.
const Home = () => (
  <Tile isAncestor isMarginless>
    <Tile isSize={2} isVertical isParent isPaddingless>
      <Tile isChild>
        <AssetFilters />
      </Tile>
    </Tile>
    <Tile isSize={10} isParent>
      <Thumbnails />
    </Tile>
  </Tile>
)

module.exports = {
  Home
}

//
// TODO: use https://wikiki.github.io for bulma extensions
//       (Tooltip, Tags input, Accordion, Carousel, QuickView, Timeline)
//
// TODO: ways to improve the interface
//
// 1. Use full viewport width/height
//     * Bootstrap calls this "fluid", as in .container-fluid
//     * In CSS, use "height: 100vh;" to make a div be full window height
//     * Bulma has "fluid" containers as well
//         - See Bloomer Container isFluid
//         - Add isMarginless or isPaddingless as necessary
//         - Maybe add isPulled='left'
// 1. Thumbnail grid scrolling
//     * Make it's container fluid
//     * Use "overflow: auto" for scrolling
// 1. Making text not selectable
//     * Bloomer has isUnselectable
// 1. Carousel!
//     * Bulma extensions has a Carousel component (so does Bootstrap)
//     * Good for swiping through a bunch of assets!
//     * Need to make clicking the arrows fire a fetchAsset action
// 1. Search!
//     * A general search that checks caption, tags, locations, dates
// 1. Timeline!
//     * Use the Bulma-Extensions Timeline component to show assets sorted by date
// 1. Better tags input
//     * Use Bulma-Extensions TagsInput on the asset edit screen
// 1. Horizontally scrollable thumbnails at top
//     * Use Container with isFluid
//     * Add style={{'overflow': 'auto'}} to the thumbnail container
//         - This adds a scrollbar if necessary
