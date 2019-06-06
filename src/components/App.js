//
// Copyright (c) 2019 Nathan Fiedler
//
const React = require('react')
const { Route, Router } = require('react-router')
const { AssetPage } = require('./AssetPage')
const { AssetEditPage } = require('./AssetEditPage')
const { ErrorPage } = require('./ErrorPage')
const { HomePage } = require('./HomePage')
const { OptionsPage } = require('./OptionsPage')
const { SearchPage } = require('./SearchPage')
const { UploadPage } = require('./UploadPage')
const { history } = require('../store')

// Using Router since our application is not really a browser, running entirely
// off of local files (not URLs), and we have a custom history, so we are not
// using HashRouter.
const App = () => (
  <Router history={history}>
    <div>
      <Route exact path='/' component={HomePage} />
      <Route path='/asset/:id' component={AssetPage} />
      <Route path='/edit/:id' component={AssetEditPage} />
      <Route path='/search' component={SearchPage} />
      <Route path='/upload' component={UploadPage} />
      <Route path='/options' component={OptionsPage} />
      <Route path='/error' component={ErrorPage} />
    </div>
  </Router>
)

module.exports = {
  App
}
