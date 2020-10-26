import React, { Component } from 'react';
import { Button } from "semantic-ui-react";
import './LoginBody.css';
import { EmailSignInBox } from "../index";

class LoginBody extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  onClickLogin = async () => {
    EmailSignInBox.show('signIn');
  };

  onClickSignUp = async () => {
    EmailSignInBox.show('signUp');
  };

  onClean = async () => {
    localStorage.removeItem('iapLogs');
  };

  render() {
    return (
      <div className="LoginBody">
        <div className="LoginBodyWrapper">
          <h1>Knight Story</h1>
          <div>Knight Story Admin. Its Staff Only Page.</div>
          <div className="LoginButtonBox">
            <Button primary size='big' onClick={this.onClickLogin}>SIGN IN</Button>
{/*
            <Button size='big' onClick={this.onClickSignUp}>SIGN UP</Button>
*/}
            <Button size='big' onClick={this.onClean}>CLEAN</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginBody;
