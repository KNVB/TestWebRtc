import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
//import TestSimplePeer from './components/testSimplePeer/TestSimplePeer';
import Panel from "./components/share/panel/Panel";
function App() {
  return (
      <Router>
        <Switch>
          <Route exact path='/' component={Panel}/>
        </Switch>
      </Router>
  );
}

export default App;
