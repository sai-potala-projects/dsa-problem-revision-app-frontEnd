import './App.css';
import * as React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import SignInScreen from './UI/Screens/SignInScreen';
import LandingScreen from './UI/Screens/LandingScreen';

function App() {
  return (
    <BrowserRouter>
      <Route path="/home" component={LandingScreen} />
      <Route path="/" exact={true} component={SignInScreen} />
    </BrowserRouter>
  );
}

export default App;
