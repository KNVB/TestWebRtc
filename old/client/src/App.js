import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { Component } from 'react';
import TestReactPlayer from './TestReactPlayer';
import TestSimplePeer from './TestSimplePeer';
import TestWebRtc from './TestWebRtc';
class App extends Component {
  render() {
	  return (
      <Router>
        <Switch>
        {/*
          <Route exact path='/' component={TestWebRtc} />
          <Route exact path='/' component={TestReactPlayer}/>
        */}  
          <Route exact path='/' component={TestSimplePeer}/>
        </Switch>
      </Router>
    )
  }
}
export default App;	