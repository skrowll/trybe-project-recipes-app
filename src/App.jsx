import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import Login from './pages/Login';
import Foods from './pages/Foods';
import Profile from './pages/Profile';
import Drinks from './pages/Drinks';
import Recipe from './pages/Recipe';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route exact path="/foods" component={ Foods } />
        <Route exact path="/profile" component={ Profile } />
        <Route exact path="/drinks" component={ Drinks } />
        <Route exact path="/drinks/:id" component={ Recipe } />
        <Route exact path="/foods/:id" component={ Recipe } />
      </Switch>
    </div>
  );
}

export default App;
