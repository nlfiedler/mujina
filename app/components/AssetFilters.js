//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
  Button,
  Container,
  Control,
  Icon,
  Input,
  Panel,
  PanelBlock,
  PanelTab,
  PanelTabs
} = require('bloomer')
const {LocationList} = require('../containers/LocationList')
const {TagList} = require('../containers/TagList')
const {YearList} = require('../containers/YearList')

const tabLabels = [
  'Tags',
  'Locations',
  'Years'
]
// Keep the order for tabLabels and panelContents synchronized.
const panelContents = [
  <TagList />,
  <LocationList />,
  <YearList />
]

const FilterTab = (props) => (
  <PanelTab tag='a' isActive={props.isActive} onClick={(event) => {
    event.preventDefault()
    props.onClick(props.tabIndex)
  }}>{props.tabLabel}</PanelTab>
)

class AssetFilters extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTabIndex: 0
    }
    this.handleTabClick = this.handleTabClick.bind(this)
  }

  handleTabClick (tabIndex) {
    this.setState({
      activeTabIndex: tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
    })
  }

  render () {
    const filterTabs = tabLabels.map((label, index) => (
      <FilterTab
        key={index}
        isActive={this.state.activeTabIndex === index}
        tabIndex={index}
        tabLabel={label}
        onClick={this.handleTabClick} />
    ))
    const panelContent = panelContents[this.state.activeTabIndex]
    //
    // The Container is needed to ensure the components only grow to the
    // height of the viewport at maximum.
    //
    // TODO: make the Panel width fixed so it doesn't change when switching
    //       to a tab that has wider or narrower menu items
    // TODO: need to somehow set the height of the panelContent Block
    //       flex-basis: NNNpx|auto did nothing
    //       flex-grow: 1,2,10 did nothing
    // - maybe set min-height: 100vh on the body
    //   (https://philipwalton.github.io/solved-by-flexbox/demos/sticky-footer/)
    // - https://codepen.io/stephenbunch/pen/KWBNVo
    //   - doesn't help
    // - https://www.bitovi.com/blog/use-flexbox-to-create-a-sticky-header-and-sidebar-with-flexible-content
    // - https://codepen.io/sulfurious/pen/eWPBjY
    // - https://codepen.io/anon/pen/doyVxj
    //
    return (
      <Container isFluid isMarginless style={{
        'height': '100vh',
        'position': 'fixed',
        'top': 0,
        'left': 0
      }}>
        <Panel>
          <PanelBlock>
            <Control hasIcons='left'>
              <Input isSize='small' placeholder='Search' />
              <Icon isSize='small' isAlign='left'>
                <span className='fa fa-search' />
              </Icon>
            </Control>
          </PanelBlock>
          <PanelTabs>
            {filterTabs}
          </PanelTabs>
          <PanelBlock style={{
            'height': '85vh',
            'overflowY': 'auto'
          }}>
            {panelContent}
          </PanelBlock>
          <PanelBlock>
            <Button isLink isOutlined isFullWidth>reset all filters</Button>
          </PanelBlock>
        </Panel>
      </Container>
    )
  }
}

module.exports = {
  AssetFilters
}
