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
    return (
      <Container isFluid isMarginless style={{'overflow': 'auto', 'height': '100vh'}}>
        <Panel>
          <PanelBlock>
            <Control hasIcons='left'>
              <Input isSize='small' placeholder='Search' />
              <Icon isSize='small' isAlign='left'>
                <span className='fa fa-search' aria-hidden='true' />
              </Icon>
            </Control>
          </PanelBlock>
          <PanelTabs>
            {filterTabs}
          </PanelTabs>
          <PanelBlock>
            {panelContent}
          </PanelBlock>
        </Panel>
      </Container>
    )
  }
}

module.exports = {
  AssetFilters
}
