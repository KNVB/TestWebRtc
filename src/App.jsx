import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import L from './components/testHook/Layout';
import TestHook from './components/testHook2/TestHook';
import TestSimplePeer from './components/testSimplePeer/TestSimplePeer';
import Panel from "./components/share/panel/Panel";
function App() {
  return (
      <Router>
        <Switch>
          <Route exact path='/' component={Panel}/>
          <Route exact path='/l' component={L}/>
          <Route exact path='/t' component={TestHook}/>
          <Route exact path='/testSimplePeer' component={TestSimplePeer}/>
        </Switch>
      </Router>
  );
}
export default App;
