import React, { Component } from 'react';
import { Message, Table, Form } from "semantic-ui-react";
import AlertBox from '../../Utils/AlertBox';
import accountService from '../../Services/AccountService';
import './AccountSearch.css';

class AccountSearch extends Component {
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

  onClickAccountSearch = async () => {
    const { name } = this.state;
    if (!name || name.length === 0) {
      AlertBox.error('No Target');
      return;
    }

    this.setState({
      result: null
    });


    let res = null;
    if (name.length > 30) {
      res = await accountService.getAccountByAddress(name);
    } else {
      res = await accountService.getAccount(name);
    }
    if (res == null) {
      AlertBox.error('Gift failed');
      return;
    }

    console.error(res);

    this.setState({
      result: res
    });
  };

  render() {
    const { result } = this.state;

    return (
        <div id="AccountSearch" className="AccountSearch">
          <h1>Account Search</h1>
          <div className="AccountSearchDescBox">
            <Form onSubmit={this.onClickAccountSearch}>
              <Form.Group widths='equal'>
                <Form.Input fluid label='Target to Search' placeholder='UID or ETH ADDRESS' onChange={this.onChangeName}/>
              </Form.Group>
              <Form.Button primary>Search</Form.Button>
            </Form>
            <br/>
            { result ?
              <div>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>UID</Table.HeaderCell>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>RubyF</Table.HeaderCell>
                      <Table.HeaderCell>RubyP</Table.HeaderCell>
                      <Table.HeaderCell>MyKI Ticket</Table.HeaderCell>
                      <Table.HeaderCell>Stste</Table.HeaderCell>
                      <Table.HeaderCell>Eth Address</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                  <Table.Row>
                    <Table.Cell>{result.uid}</Table.Cell>
                    <Table.Cell>{result.name}</Table.Cell>
                    <Table.Cell>{result.rubyF}</Table.Cell>
                    <Table.Cell>{result.rubyP}</Table.Cell>
                    <Table.Cell>{result.blackBean}</Table.Cell>
                    <Table.Cell>{result.state}</Table.Cell>
                    <Table.Cell>{result.address}</Table.Cell>
                  </Table.Row>
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

export default AccountSearch;
