//
// Copyright (c) 2018 Nathan Fiedler
//
const React = require('react')
const {
  Control,
  Icon
} = require('bloomer')
const rrf = require('react-redux-form')

class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    // Do _not_ stash props on this, otherwise react/redux has no way of
    // knowing if the changing props have any effect on this component.
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (values) {
    this.props.onSubmit(values.query)
  }

  render () {
    return (
      <rrf.Form
        model='search'
        onSubmit={(values) => this.handleSubmit(values)}
      >
        <Control hasIcons='left'>
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
      </rrf.Form>
    )
  }
}

module.exports = {
  SearchBar
}

//
// Something resembling the desired search bar, to be shown above the thumbnail
// grid, sticking to the top of the screen. It sort of worked except that its
// position shifted when images where showing. Also, the search bar was a little
// too wide for the window.
//
// <Navbar style={{
//   'boxShadow': '0px 0px 0px 0px',
//   'position': 'sticky',
//   'top': 0
// }}>
//   <NavbarBrand style={{
//     'paddingRight': '1em',
//     'width': '100%'
//   }}>
//     <NavbarEnd isMarginless style={{'width': '100%'}}>
//       <NavbarItem isPaddingless style={{'width': '100%'}}>
//         <rrf.Form
//           model='search'
//           onSubmit={(values) => this.handleSubmit(values)}
//           style={{'width': '100%'}}
//         >
//           <Field isHorizontal style={{'width': '100%'}}>
//             <FieldBody>
//               <Field isGrouped hasAddons='right'>
//                 <Control isExpanded hasIcons='left'>
//                   <rrf.Control.text
//                     model='search.query'
//                     id='search.query'
//                     className='input is-small'
//                     placeholder='Search'
//                   />
//                   <Icon isSize='small' isAlign='left'>
//                     <span className='fa fa-search' />
//                   </Icon>
//                 </Control>
//                 <Control>
//                   <Button isActive isColor='light' isSize='small' type='submit'>Search</Button>
//                 </Control>
//               </Field>
//             </FieldBody>
//           </Field>
//         </rrf.Form>
//       </NavbarItem>
//     </NavbarEnd>
//   </NavbarBrand>
// </Navbar>
