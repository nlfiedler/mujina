//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const {
  Button,
  Control,
  Field,
  FieldBody,
  Icon,
  Navbar,
  NavbarEnd,
  NavbarItem,
  NavbarMenu
} = require('bloomer')
const rrf = require('react-redux-form')
const {history} = require('../store')

class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    // Initiate a search if query string non-empty so that the display
    // will be updated to show the previous search.
    if (this.props.search.query) {
      this.props.onSubmit(this.props.search.query)
    }
  }

  handleSubmit (values) {
    this.props.onSubmit(values.query)
  }

  render () {
    // All the style width and flexGrow is to get the input field to
    // stretch to fill the window, without squeezing anything else out.
    return (
      <Navbar style={{
        'boxShadow': '0px 0px 0px 0px',
        'position': 'sticky',
        'top': 0
      }}>
        <NavbarMenu style={{'width': '100%'}}>
          <NavbarEnd style={{'width': '100%'}}>
            <NavbarItem>
              <Button isLink isOutlined onClick={() => history.push('/')}>
                <Icon isSize='medium' className='fa fa-home' />
              </Button>
            </NavbarItem>
            <NavbarItem style={{'flexGrow': 1}}>
              <rrf.Form
                model='search'
                onSubmit={(values) => this.handleSubmit(values)}
                style={{'width': '100%'}}
              >
                <Field isHorizontal>
                  <FieldBody>
                    <Field isGrouped hasAddons='right'>
                      <Control isExpanded hasIcons='left'>
                        <rrf.Control.text
                          model='search.query'
                          id='search.query'
                          className='input is-small'
                          placeholder='Search'
                        />
                        <Icon isSize='small' isAlign='left'>
                          <span className='fa fa-search' />
                        </Icon>
                      </Control>
                      <Control>
                        <Button isActive isColor='light' isSize='small' type='submit'>Search</Button>
                      </Control>
                    </Field>
                  </FieldBody>
                </Field>
              </rrf.Form>
            </NavbarItem>
          </NavbarEnd>
        </NavbarMenu>
      </Navbar>
    )
  }
}

module.exports = {
  SearchBar
}
