import React, { Component } from 'react';
import { Message, Table, Icon } from "semantic-ui-react";
import AlertBox from '../../Utils/AlertBox';
import chainTxService from '../../Services/ChainTxService';
import './ChainTxMonitor.css';

class ChainTxMonitor extends Component {
  constructor(props) {
    super(props);

    // it's for test
    this.state = {
      result: [{"seq":8, "priority":1, "uid":176, "txType":"SEND_ETH", "txDetail":"{\"toAddress\":\"0x1Bb7f4a85Da117b3ea919c2c1065B3A25D6f29d5\",\"wei\":\"500000000000000\"}", "nonce":1347, "gasPrice":25000000000, "txHash":"0x0e5e99ee7f89c147b4d9e30c6b76c9d62e9d96ce3c92640e7117091f6934fe16", "txStatus":"confirmation"},
        {"seq":9, "priority":1, "uid":176, "txType":"SEND_ETH", "txDetail":"{\"toAddress\":\"0x1Bb7f4a85Da117b3ea919c2c1065B3A25D6f29d5\",\"wei\":\"500000000000000\"}", "nonce":1348, "gasPrice":25000000000, "txHash":"0xa66598cedec756868bc190c11f520c940a46315a48367f6d2a406c954d6e540f", "txStatus":"confirmation"},
        {"seq":10, "priority":1, "uid":176, "txType":"SEND_ETH", "txDetail":"{\"toAddress\":\"0x1Bb7f4a85Da117b3ea919c2c1065B3A25D6f29d5\",\"wei\":\"500000000000000\"}", "nonce":1349, "gasPrice":25000000000, "txHash":"0x4db65cb529c88200d05938feb7cd5252e89dd6eeab50fa90b5f1c3dcc46bfda2", "txStatus":"confirmation"},
        {"seq":11, "priority":1, "uid":176, "txType":"SEND_ETH", "txDetail":"{\"toAddress\":\"0x1Bb7f4a85Da117b3ea919c2c1065B3A25D6f29d5\",\"wei\":\"500000000000000\"}", "nonce":1350, "gasPrice":25000000000, "txHash":"0x8ae608eba16640b1c3d5fc7d458bd231071173a8823acf6392e98afb98b0dd01", "txStatus":"confirmation"},
        {"seq":12, "priority":1, "uid":176, "txType":"SEND_ETH", "txDetail":"{\"toAddress\":\"0x1Bb7f4a85Da117b3ea919c2c1065B3A25D6f29d5\",\"wei\":\"500000000000000\"}", "nonce":1351, "gasPrice":25000000000, "txHash":"0xf41eef59abffe739f3ff184cde7dfd607f4882c4143b1b5f18db40906c6a4c29", "txStatus":"confirmation"}],
    };
  }

  onClickTx = async () => {
  };

  render() {
    const { result } = this.state;

    return (
        <div id="ChainTxMonitor" className="ChainTxMonitor">
          <h1>Chain Tx Monitor</h1>
          <div className="ChainTxMonitorDescBox">
            <div>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>seq</Table.HeaderCell>
                    <Table.HeaderCell>priority</Table.HeaderCell>
                    <Table.HeaderCell>uid</Table.HeaderCell>
                    <Table.HeaderCell>txType</Table.HeaderCell>
                    <Table.HeaderCell>txDetail</Table.HeaderCell>
                    <Table.HeaderCell>nonce</Table.HeaderCell>
                    <Table.HeaderCell>gasPrice</Table.HeaderCell>
                    <Table.HeaderCell>txHash</Table.HeaderCell>
                    <Table.HeaderCell>txStatus</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  { result.map((e) => {
                    let txHash = e.txHash;
                    if (txHash !== null && txHash !== '') {
                      txHash = txHash.substr(0, 8) + "...";
                    }

                    return (
                      <Table.Row>
                        <Table.Cell>{e.seq}</Table.Cell>
                        <Table.Cell>{e.priority}</Table.Cell>
                        <Table.Cell>{e.uid}</Table.Cell>
                        <Table.Cell>{e.txType}</Table.Cell>
                        <Table.Cell><Icon name='search plus'/></Table.Cell>
                        <Table.Cell>{e.nonce}</Table.Cell>
                        <Table.Cell>{(e.gasPrice/1000000000.0).toFixed(1)}</Table.Cell>
                        <Table.Cell>{txHash}</Table.Cell>
                        <Table.Cell>{e.txStatus}</Table.Cell>
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

export default ChainTxMonitor;
