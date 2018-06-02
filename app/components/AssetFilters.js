//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {
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
const {ResetFilters} = require('../containers/ResetFilters')
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
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
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
            <ResetFilters />
          </PanelBlock>
        </Panel>
      </Container>
    )
  }
}

module.exports = {
  AssetFilters
}
