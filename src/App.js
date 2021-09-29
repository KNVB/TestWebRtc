import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import A from './components/test/A';
import B from './components/test/B';
/*
import TestPureWebRTC from './components/test/TestPureWebRTC';
import TestSimplePeer from './components/testSimplePeer/TestSimplePeer';
import Panel from "./components/share/panel/Panel";
*/
function App() {
  return (
      <Router>
        <Switch>
{/*       <Route exact path='/' component={Panel}/> */}
          <Route exact path='/a' component={A}/>
          <Route exact path='/b' component={B}/>
{/*          
          <Route exact path='/testSimplePeer' component={TestSimplePeer}/>
          <Route exact path='/testPureWebRTC' component={TestPureWebRTC}/>
*/}          
        </Switch>
      </Router>
  );
}
export default App;
