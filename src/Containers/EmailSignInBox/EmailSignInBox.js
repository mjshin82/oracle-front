import React, { Component } from 'react';
import { Button, Form, Modal, Input, Label } from 'semantic-ui-react'
import './EmailSignInBox.css';
import authService from "../../Services/AuthService";

class EmailSignInBox extends Component {
  static instance = null;

  constructor(props) {
    super(props);
    EmailSignInBox.instance = this;
    this.state = {
      open: false,
      canSignUp: false,
      email: "",
      password: "",
      label1: null,
      label2: null,
      mode: 'signIn'
    };
  }

  static show(mode) {
    EmailSignInBox.instance.display(mode);
  }

  static hide() {
    EmailSignInBox.instance.close();
  }

  display = (mode) => {
    this.setState({
      mode: mode,
      open: true
    });
  };

  close = () => {
    this.setState({
      open: false
    });
  };

  onTextChanged = (e, data) => {
    let {
      email,
      password } = this.state;

    email.trim();
    password.trim();

    if (data.id === "signUpEmail") {
      email = data.value;
    } else if (data.id === "signUpPassword") {
      password = data.value;
    }

    let label1 = null;
    let label2 = null;

    let canSignUp = true;
    if (email.length > 0) {
      canSignUp = this.validateEmail(email);
      if (!canSignUp) {
        label1 = "Invalid Email Address"
      }
    }

    if (password.length > 0) {
      if (password.length < 8) {
        label2 = "Too short password";
        canSignUp = false;
      }
    } else {
      canSignUp = false;
    }

    this.setState({
      email: email,
      password: password,
      canSignUp: canSignUp,
      label1: label1,
      label2: label2,
    });
  };

  validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  onClickSign = async() => {
    await this.sign('email');
  };

  sign = async() => {
    let authRes = "";
    if (this.state.mode === "signUp") {
      authRes = await authService.signUp(this.state.email, this.state.password);
    } else {
      authRes = await authService.signIn(this.state.email, this.state.password);
    }

    if (authRes === false) {
      return;
    }

    this.setState({
      open: false,
    });
  };

  render() {
    const {
      open,
      email,
      password,
      canSignUp,
      label1,
      label2,
      label3,
    } = this.state;

    return (
        <div>
          <Modal open={open} onClose={this.close} className="EmailSignUpBox">
            <Modal.Content>
              <div>
                <div>
                  <h1>Email</h1>
                  <Form>
                    <Form.Field className="EmailInput">
                      <Input id="signUpEmail"
                             placeholder="Email"
                             fluid
                             value={email}
                             onChange={this.onTextChanged}/>
                      { label1 == null ? "":
                        <Label pointing color='red'>{label1}</Label>
                      }
                    </Form.Field>
                    <Form.Field className="EmailInput">
                      <Input id="signUpPassword"
                             className="EmailInput"
                             placeholder="Password"
                             type="password"
                             fluid
                             value={password}
                             onChange={this.onTextChanged}/>
                      { label2 == null ? "":
                          <Label pointing color='red'>{label2}</Label>
                      }
                    </Form.Field>
                  </Form>
                </div>
                <div className="FooterBox">
                  <Button onClick={this.onClickSign}
                          primary
                          fluid
                          className={canSignUp? "" : "disabled"}>
                    SIGN-IN
                  </Button>
                </div>
              </div>
            </Modal.Content>
          </Modal>
        </div>
    );
  }
}

export default EmailSignInBox;
