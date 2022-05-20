import './LoginButton.css';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";

function LoginButton() {
  return (
    // <Link to="/dashboard" className="btn-login">Login with Spotify</Link>
    // Redirect to backend login service
    <btn onClick={() => window.location="http://localhost:8888/login"} className="btn-login">Login with Spotify</btn>
  );
}

export default LoginButton;
