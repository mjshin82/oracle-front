import React, { Component } from 'react';
import { Message, Button, Form } from "semantic-ui-react";
import AlertBox from '../../Utils/AlertBox';
import giftService from '../../Services/GiftService';
import './GiftRuby.css';

class GiftRuby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      ruby: 0,
      uids: [],
      result: null,
    };
  }

  onChangeName = (e, data) => {
    this.setState({
      name: data.value.trim()
    });
  };

  onChangeRuby = (e, data) => {
    let ruby = parseInt(data.value.trim());
    if (Number.isNaN(ruby)) {
      ruby = 0;
    }

    this.setState({
      ruby: ruby
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
    const { name, ruby, uids } = this.state;
    if (!name || name.length === 0) {
      AlertBox.error('No Event Name');
      return;
    }

    if (ruby === 0 || ruby > 100) {
      AlertBox.error('Check Ruby');
      return;
    }

    if (uids.length === 0) {
      AlertBox.error('Check UIDs');
      return;
    }

    this.setState({
      result: null
    });

    let res = await giftService.giftRuby(name, ruby, uids)
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
        <div id="GiftRuby" className="GiftRuby">
          <h1>Ruby Gift</h1>
          <div className="GiftRubyDescBox">

            <Form onSubmit={this.onClickGift}>
              <Form.Group widths='equal'>
                <Form.Input fluid label='Event Name' placeholder='Event Name' onChange={this.onChangeName}/>
                <Form.Input fluid label='Ruby' placeholder='Ruby' onChange={this.onChangeRuby}/>
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

export default GiftRuby;
