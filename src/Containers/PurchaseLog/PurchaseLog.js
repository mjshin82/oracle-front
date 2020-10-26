import React, { Component } from 'react';
import {Table, Button, Input} from "semantic-ui-react";
import dashboardService from '../../Services/DashboardService';
import './PurchaseLog.css';
import util from '../../Utils/util';

import CanvasJSReact from '../../lib/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PurchaseLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: 0
    };
  }

  componentDidMount() {
    let iapLogs = dashboardService.iapLogs;
    let dayLog = new Map();

    iapLogs.forEach((e) => {
      // todo
    });
  }

  onClickToCsv = () =>{
    let rows = [];
    let iapLogs = dashboardService.iapLogs;
    rows.push("no,uid,store,pid,date");

    iapLogs.forEach((e) => {
      let date = this.getDate(e.purchaseYmdt - 3600 * 9);
      rows.push(`${e.no},${e.uid},${e.store},${e.productId},${date}`);
    });

    let file = "data:text/csv;charset=utf-8," + rows.join("\n");
    let encodedUri = encodeURI(file);
    window.open(encodedUri);
  };

  getDate = (timestamp) => {
    let ymdt = new Date(timestamp * 1000);

    return ymdt.getFullYear() + '-' +
        util.pad(ymdt.getMonth() + 1, 2) + '-' +
        util.pad(ymdt.getDate(), 2) + " " +
        util.pad(ymdt.getHours(), 2) + ":" +
        util.pad(ymdt.getMinutes(), 2);
  };

  onChangeUid = (e, data) => {
    let uid = 0;
    if (data.value !== null && data.value !== '') {
      uid = parseInt(data.value)
    }

    this.setState({
      uid: uid
    });
  };

  render() {
    const { uid } = this.state;
    let iapLogsAll = dashboardService.iapLogs;
    let iapLogs = [];

    iapLogsAll.forEach(e => {
      if (uid === 0 || uid === e.uid) {
        iapLogs.push(e);
      }
    });

    iapLogs = iapLogs.reverse();
    iapLogs = iapLogs.slice(0, 100);

    return (
        <div id="PurchaseLog" className="PurchaseLog">
          <h1>Purchase Logs</h1>
          <div>
            <Button primary onClick={this.onClickToCsv}>Download CSV</Button>
          </div>

          <div className='FilterBox'>
            <Input fluid label='Filter' placeholder='UID' onChange={this.onChangeUid}/>
          </div>

{/*
          <CanvasJSReact.CanvasJSChart options = {options}/>
*/}
          <div>
          </div>
          <div className="PurchaseLogDescBox">
            <div>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>No</Table.HeaderCell>
                    <Table.HeaderCell>UID</Table.HeaderCell>
                    <Table.HeaderCell>Store</Table.HeaderCell>
                    <Table.HeaderCell>PID</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  { iapLogs.map((e) => {
                    let ymdt = new Date(e.purchaseYmdt * 1000 - 3600 * 9 * 1000);
                    console.error(e.purchaseYmdt + ":" + ymdt);

                    let date = ymdt.getFullYear() + '-' +
                        util.pad(ymdt.getMonth() + 1, 2) + '-' +
                        util.pad(ymdt.getDate(), 2) + " " +
                        util.pad(ymdt.getHours(), 2) + ":" +
                        util.pad(ymdt.getMinutes(), 2);
                    return (
                      <Table.Row>
                        <Table.Cell>{e.no}</Table.Cell>
                        <Table.Cell>{e.uid}</Table.Cell>
                        <Table.Cell>{e.store}</Table.Cell>
                        <Table.Cell>{e.productId}</Table.Cell>
                        <Table.Cell>{date}</Table.Cell>
                      </Table.Row>
                    )})}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
    );
  }
}

export default PurchaseLog;
