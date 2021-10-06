import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import A from './components/testMeeting/A';
import C from './components/testMeeting/C';
import TestMeeting from './components/testMeeting/TestMeeting';
import TestPureWebRTC from './components/testPureWebRTC/TestPureWebRTC';
import TestSimplePeer from './components/testSimplePeer/TestSimplePeer';
import Panel from "./components/share/panel/Panel";
function App() {
  return (
      <Router>
        <Switch>
          <Route exact path='/' component={Panel}/>
          <Route exact path='/a' component={A}/>
          <Route exact path='/c' component={C}/>
          <Route exact path='/testMeeting' component={TestMeeting}/>
          <Route exact path='/testSimplePeer' component={TestSimplePeer}/>
          <Route exact path='/testPureWebRTC' component={TestPureWebRTC}/>
        </Switch>
      </Router>
  );
}
export default App;
