import './App.css';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";

//Pages
import SplashScreen from "./Pages/index"
import DashboardScreen from "./Pages/dashboard"

function App() {

  return <Router>
    <Switch>
      <Route exact path="/">
        <SplashScreen />
      </Route>
      <Route path="/dashboard">
        <DashboardScreen />
      </Route>
    </Switch>
  </Router>
}

export default App;
