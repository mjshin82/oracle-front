import React, { Component } from 'react';
import { Message, Table, Form } from "semantic-ui-react";
import AlertBox from '../../Utils/AlertBox';
import giftService from '../../Services/GiftService';
import './CheckGift.css';

class CheckGift extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      result: null,
    };
  }

  onChangeName = (e, data) => {
    this.setState({
      name: data.value.trim()
    });
  };

  onClickCheckGift = async () => {
    const { name } = this.state;
    if (!name || name.length === 0) {
      AlertBox.error('No Event Name');
      return;
    }

    this.setState({
      result: null
    });

    console.error(name);

    let res = await giftService.checkGift(name);
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
        <div id="CheckGift" className="CheckGift">
          <h1>Check Gift</h1>
          <div className="CheckGiftDescBox">
            <Form onSubmit={this.onClickCheckGift}>
              <Form.Group widths='equal'>
                <Form.Input fluid label='Event Name' placeholder='Event Name' onChange={this.onChangeName}/>
              </Form.Group>
              <Form.Button primary>Check Received List</Form.Button>
            </Form>
            <br/>
            { result ?
              <div>
                <Message info>
                  <Message.Header>
                    TARGET USER COUNT: {result.length}
                  </Message.Header>
                </Message>

                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>UID</Table.HeaderCell>
                      <Table.HeaderCell>FROM</Table.HeaderCell>
                      <Table.HeaderCell>TO</Table.HeaderCell>
                      <Table.HeaderCell>ADMIN</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                  { result.map((e) => { return (
                    <Table.Row>
                      <Table.Cell>{e.uid}</Table.Cell>
                      <Table.Cell>{e.fromV}</Table.Cell>
                      <Table.Cell>{e.toV}</Table.Cell>
                      <Table.Cell>{e.who}</Table.Cell>
                    </Table.Row>
                  )})}
                  </Table.Body>
                </Table>
              </div>
              : ""
            }
          </div>
        </div>
    );
  }
}

export default CheckGift;
