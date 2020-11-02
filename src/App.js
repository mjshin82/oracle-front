import React, { Component } from "react";
import Alert from 'react-s-alert';
import {
  SimpleLoader,
  MainBody,
  TopNav,
} from "./Containers";
import {
  Footer,
} from "./Components";

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <div className="App">
        <TopNav/>
        <div id="Home">

          <div>
            <MainBody/>
            <SimpleLoader/>
            <Alert stack={{limit: 3}} />
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default App;
