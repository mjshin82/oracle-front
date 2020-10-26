import React, { Component } from 'react';
import { Button, Modal, Message } from 'semantic-ui-react'
import './RewardReceiveBox.css';
import sb from "../../Services/StringBundleService";
import AlertBox from "../../Utils/AlertBox";
import authService from "../../Services/AuthService";

class RewardReceiveBox extends Component {
  static instance = null;

  constructor(props) {
    super(props);
    RewardReceiveBox.instance = this;
    this.state = {
      open: false,
      account: {},
      email: null
    };
  }

  static show(account, email) {
    RewardReceiveBox.instance.display(account, email);
  }

  static hide() {
    RewardReceiveBox.instance.close();
  }

  display = async (account, email) => {
    this.setState({
      open: true,
      account: account,
      email: email
    });
  };

  close = () => {
    if (this.intervalId > 0) {
      clearInterval(this.intervalId);
    }

    this.setState({
      open: false
    });
  };

  onClickGetReward = async() => {
    const { account, email } = this.state;
    if (await authService.receivePreRegistrationReward(email, account.uid) != null) {
      AlertBox.success(sb.get('receive.success'), 10);
      this.close();
    } else {
      AlertBox.error(sb.get('receive.fail'), 10);
    }
  };

  render() {
    const { open, account } = this.state;

    return (
        <div>
          <Modal open={open} onClose={this.close} className="RewardReceiveBox">
            <Modal.Content>
              <div className="GiftBody">
                <Message info size="small" className='RemainBox'>
                  <Message.Header>{account.name}</Message.Header>
                  <Message.Content>
                    <div>
                      {sb.get('receive.confirm')}
                    </div>
                  </Message.Content>
                </Message>
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.close}>
                {sb.get('btn.cancel')}
              </Button>
              <Button primary onClick={this.onClickGetReward}>
                {sb.get('btn.receive')}
              </Button>
            </Modal.Actions>
          </Modal>
        </div>
    );
  }
}

export default RewardReceiveBox;