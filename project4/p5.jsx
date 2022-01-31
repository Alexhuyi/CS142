import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from "react-router-dom";
import './p5.css';

import Header from './components/header/Header';
import States from './components/states/States';
import Example from './components/example/Example';

ReactDOM.render(
  <div>
    <Header />
    <HashRouter>
      <div className="link-button">
        <Link to="/states">States</Link>
      </div>
      <div className="link-button">
        <Link to="/example">Example</Link>
      </div>
        <Route path="/states" component={States} />
        <Route path="/example" component={Example} />
    </HashRouter>
  </div>,
  document.getElementById('reactapp'),
);
