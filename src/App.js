import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import C from "./components/c/C";
import TestMeeting from './components/testMeeting_1/TestMeeting';
import TestPureWebRTC from './components/testPureWebRTC/TestPureWebRTC';
import TestSimplePeer from './components/testSimplePeer/TestSimplePeer';
import TestSocket from './components/testSocket/TestSocket';
import Panel from "./components/share/panel/Panel";
function App() {
  return (
      <Router>
        <Switch>
          <Route exact path='/' component={Panel}/>
          <Route exact path='/a' component={TestSocket}/>
          <Route exact path='/c' component={C}/>
          <Route exact path='/testMeeting' component={TestMeeting}/>
          <Route exact path='/testSimplePeer' component={TestSimplePeer}/>
          <Route exact path='/testPureWebRTC' component={TestPureWebRTC}/>
        </Switch>
      </Router>
  );
}
export default App;
