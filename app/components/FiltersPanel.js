//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const {
  Button,
  Container,
  Panel,
  PanelBlock,
  PanelTab,
  PanelTabs
} = require('bloomer')
const {LocationList} = require('../containers/LocationList')
const {ResetFilters} = require('../containers/ResetFilters')
const {TagList} = require('../containers/TagList')
const {YearList} = require('../containers/YearList')
const {history} = require('../store')

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

class FiltersPanel extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.state = {
      activeTabIndex: 0
    }
    this.handleTabClick = this.handleTabClick.bind(this)
  }

  componentDidMount () {
    // Ensure the assets are retrieved in the event we switched from another
    // page, such as search.
    this.props.onMount()
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
    // The panel flex grow/shrink and such ensure that the filters content
    // stretches to fill available space, while the other panels do not.
    //
    return (
      <Container isFluid isMarginless style={{
        'height': '100vh',
        'position': 'fixed',
        'top': 0,
        'left': 0
      }}>
        <Panel style={{
          'display': 'flex',
          'flexDirection': 'column',
          'height': '100%'
        }}>
          <PanelBlock style={{'flexShrink': 0}}>
            <Button isSize='small' isLink isOutlined isFullWidth onClick={() => history.push('/search')}>
              Search
            </Button>
          </PanelBlock>
          <PanelTabs style={{'flexShrink': 0}}>
            {filterTabs}
          </PanelTabs>
          <PanelBlock style={{
            'alignItems': 'flex-start',
            'flexGrow': 1,
            'overflowY': 'auto'
          }}>
            {panelContent}
          </PanelBlock>
          <PanelBlock style={{'flexShrink': 0}}>
            <ResetFilters />
          </PanelBlock>
        </Panel>
      </Container>
    )
  }
}

module.exports = {
  FiltersPanel
}
