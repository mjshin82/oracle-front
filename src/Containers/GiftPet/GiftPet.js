import React, { Component } from 'react';
import { Message, Button, Form } from "semantic-ui-react";
import AlertBox from '../../Utils/AlertBox';
import giftService from '../../Services/GiftService';
import './GiftPet.css';

class GiftPet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      code: 0,
      uids: [],
      result: null,
    };
  }

  onChangeName = (e, data) => {
    this.setState({
      name: data.value.trim()
    });
  };

  onChangeCode = (e, data) => {
    let code = parseInt(data.value.trim());
    if (Number.isNaN(code)) {
      code = 0;
    }

    this.setState({
      code: code
    });
  };

  onChangeUID = (e, data) => {
    let uids = [];
    let hasError = false;
    let candidate = data.value.trim().split('\n');
    candidate.forEach((e) => {
      let value = parseInt(e);
      if (Number.isNaN(value)) {
        hasError = true;
      } else {
        uids.push(value);
      }
    });

    if (!hasError) {
      this.setState({
        uids: uids
      });
    } else {
      this.setState({
        uids: []
      });
    }
  };

  onClickGift = async () => {
    const { name, code, uids } = this.state;
    if (!name || name.length === 0) {
      AlertBox.error('No Event Name');
      return;
    }

    if (code === 0 || code > 100) {
      AlertBox.error('Check Code');
      return;
    }

    if (uids.length === 0) {
      AlertBox.error('Check UIDs');
      return;
    }

    this.setState({
      result: null
    });

    let res = await giftService.giftPet(name, code, uids)
    if (res == null) {
      AlertBox.error('Gift failed');
      return;
    }

    this.setState({
      result: res
    });
  };

  render() {
    const { result } = this.state;

    return (
        <div id="GiftPet" className="GiftPet">
          <h1>Pet Gift</h1>
          <div className="GiftPetDescBox">

            <Form onSubmit={this.onClickGift}>
              <Form.Group widths='equal'>
                <Form.Input fluid label='Event Name' placeholder='Event Name' onChange={this.onChangeName}/>
                <Form.Input fluid label='Code' placeholder='Code' onChange={this.onChangeCode}/>
              </Form.Group>
              <Form.TextArea
                  className='UidBox'
                  label='Target Users'
                  placeholder='List uid here. Maximum size is 100.'
                  rows='10'
                  onChange={this.onChangeUID}/>
              <Form.Button primary>Gift</Form.Button>
            </Form>

            { result ?
              <Message info>
                <Message.Header>
                  DONE: {result.done.length}
                </Message.Header>
                <Message.Content>
                  {result.done.join(", ")}
                </Message.Content>
                <Message.Header>
                  DUPLICATED: {result.duplicated.length}
                </Message.Header>
                <Message.Content>
                  {result.duplicated.join(", ")}
                </Message.Content>
                <Message.Header>
                  FAILED: {result.failed.length}
                </Message.Header>
                <Message.Content>
                  {result.failed.join(", ")}
                </Message.Content>
              </Message>
                : ""
            }
          </div>
        </div>
    );
  }
}

export default GiftPet;
