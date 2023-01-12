import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import C from "./components/c/C";
//import D from "./components/d/D";
//import L from './components/L';
import L from './components/testHook/Layout';
import Q from "./components/testHook/QK";
import TestHook from './components/testHook/TestHook';
import TestPureWebRTC from './components/testPureWebRTC/TestPureWebRTC';
import TestSimplePeer from './components/testSimplePeer/TestSimplePeer';
import Panel from "./components/share/panel/Panel";
function App() {
  return (
      <Router>
        <Switch>
          <Route exact path='/' component={Panel}/>
          <Route exact path='/c' component={C}/>
        {/*  <Route exact path='/d' component={D}/> */}
          <Route exact path='/l' component={L}/>
          <Route exact path='/q' component={Q}/>
          <Route exact path='/t' component={TestHook}/>
          <Route exact path='/testSimplePeer' component={TestSimplePeer}/>
          <Route exact path='/testPureWebRTC' component={TestPureWebRTC}/>
        </Switch>
      </Router>
  );
}
export default App;
