//
// Copyright (c) 2017 Nathan Fiedler
//
const React = require('react')
const {Route} = require('react-router')
const {ConnectedRouter} = require('react-router-redux')
const {Home} = require('./Home')
const {AssetPage} = require('./AssetPage')
const {Upload} = require('./Upload')
const {ErrorPage} = require('./ErrorPage')
const {history} = require('../store')

const App = () => (
  <ConnectedRouter history={history}>
    <div>
      <Route exact path='/' component={Home} />
      <Route path='/asset/:id' component={AssetPage} />
      <Route path='/upload' component={Upload} />
      <Route path='/error' component={ErrorPage} />
    </div>
  </ConnectedRouter>
)

module.exports = {
  App
}
