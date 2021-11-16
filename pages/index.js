import { BrowserRouter as Router,History, Switch, Route } from 'react-router-dom';
export default function Index(){
	return(
		<Router>
			<Switch>
				<Route exact path='/a' component={TestSocket}/>
			</Switch>
		</Router>
	)
}