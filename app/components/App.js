//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {Route} = require('react-router')
const {ConnectedRouter} = require('react-router-redux')
const {AssetPage} = require('./AssetPage')
const {AssetEditPage} = require('./AssetEditPage')
const {ErrorPage} = require('./ErrorPage')
const {HomePage} = require('./HomePage')
const {OptionsPage} = require('./OptionsPage')
const {UploadPage} = require('./UploadPage')
const {history} = require('../store')

const App = () => (
  <ConnectedRouter history={history}>
    <div>
      <Route exact path='/' component={HomePage} />
      <Route path='/asset/:id' component={AssetPage} />
      <Route path='/edit/:id' component={AssetEditPage} />
      <Route path='/upload' component={UploadPage} />
      <Route path='/options' component={OptionsPage} />
      <Route path='/error' component={ErrorPage} />
    </div>
  </ConnectedRouter>
)

module.exports = {
  App
}
