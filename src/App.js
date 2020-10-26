import React, { Component } from "react";
import Alert from 'react-s-alert';
import {
  SimpleLoader,
  LoginBody,
  MainBody,
  TopNav,
  EmailSignInBox
} from "./Containers";
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import authService from './Services/AuthService';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: authService.account
    };
  };

  componentDidMount() {
    authService.addEventHandler('updated', this.onAccountUpdated);
  }

  componentWillUnmount() {
    authService.removeEventHandler('updated', this.onAccountUpdated);
  }

  onAccountUpdated = () => {
    this.setState({
      account: authService.account
    });
  };

  onClickSignOut = () => {
    authService.clearAuth();
  };

  render() {
    const {
      account,
    } = this.state;

    return (
      <div className="App">
        <TopNav/>
        <div id="Home">

          <div>
            <MainBody/>
            <SimpleLoader/>
            <EmailSignInBox/>
            <Alert stack={{limit: 3}} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
