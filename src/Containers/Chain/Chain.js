import React, {Component} from 'react';
import {Button, Segment, SegmentGroup, Table, Checkbox, Portal, Input} from 'semantic-ui-react'
import ethChainService from '../../Services/EthChainService';
import tronChainService from '../../Services/TronChainService';
import klatynChainService from '../../Services/KlaytnChainService';

class Chain extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ethBalances: {},
            tronBalances: {},
            klaytnBalances : {},
            showEthWithdrawPopup: false,
            withdrawEthAmount: 1,
            showEthTransferPopup: false,
            transferEthAmount: 1,

            showTronWithdrawPopup: false,
            withdrawTronAmount: 1,
            showTronTransferPopup: false,
            transferTronAmount: 1,
            showTronFreezePopup: false,
            freezeTronAmount: 1,

            freezeCheckBoxValue: 'energy'

        };

        this.handleEthWithdraw = this.handleEthWithdraw.bind(this);
        this.handleEthWithdrawComplete = this.handleEthWithdrawComplete.bind(this);
        this.handleEthWithdrawCancel = this.handleEthWithdrawCancel.bind(this);
        this.onChangeWithdrawEthAmount = this.onChangeWithdrawEthAmount.bind(this);

        this.handleEthTransfer = this.handleEthTransfer.bind(this);
        this.handleEthTransferComplete = this.handleEthTransferComplete.bind(this);
        this.handleEthTransferCancel = this.handleEthTransferCancel.bind(this);
        this.onChangeTransferEthAmount = this.onChangeTransferEthAmount.bind(this);

        this.handleTronFreeze = this.handleTronFreeze.bind(this);
        this.handleTronFreezeComplete = this.handleTronFreezeComplete.bind(this);
        this.handleTronFreezeCancel = this.handleTronFreezeCancel.bind(this);
        this.onChangeFreezeTronAmount = this.onChangeFreezeTronAmount.bind(this);
        this.handleFreezeCheckbox = this.handleFreezeCheckbox.bind(this);

        this.handleTronWithdraw = this.handleTronWithdraw.bind(this);
        this.handleTronWithdrawCancel = this.handleTronWithdrawCancel.bind(this);
        this.handleTronWithdrawComplete = this.handleTronWithdrawComplete.bind(this);
        this.onChangeWithdrawTronAmount = this.onChangeWithdrawTronAmount.bind(this);

        this.handleTronTransfer = this.handleTronTransfer.bind(this);
        this.handleTronTransferCancel = this.handleTronTransferCancel.bind(this);
        this.handleTronTransferComplete = this.handleTronTransferComplete.bind(this);
        this.onChangeTransferTronAmount = this.onChangeTransferTronAmount.bind(this);
    }

    async componentDidMount() {
        await this.getEthBalances();
        await this.getTronBalances();
        await this.getKlaytnBalances();
    }

    async getEthBalances() {
        const ethBalances = await ethChainService.getEthBalances();

        console.log(ethBalances);

        this.setState({
            ethBalances: ethBalances
        });
    }

    async getTronBalances() {
        const tronBalances = await tronChainService.getTronBalances();

        console.log(tronBalances);

        this.setState({
            tronBalances: tronBalances
        });
    }

    async getKlaytnBalances(){
        const klaytnBalances = await klatynChainService.getKlaytnBalances();

        this.setState({
            klaytnBalances: klaytnBalances
        });
    }

    async handleEthWithdraw() {
        this.setState({showEthWithdrawPopup: true});
    }

    async handleEthWithdrawComplete() {
        await ethChainService.withdrawEth(this.state.withdrawEthAmount);
        this.setState({showEthWithdrawPopup: false, withdrawEthAmount: 1});
        await this.getEthBalances();
    }

    async handleEthWithdrawCancel() {
        this.setState({showEthWithdrawPopup: false, withdrawEthAmount: 1});
    }

    onChangeWithdrawEthAmount(e, data) {
        this.setState({withdrawEthAmount: data.value});
    }

    async handleEthTransfer() {
        this.setState({showEthTransferPopup: true});
    }

    async handleEthTransferComplete() {
        await ethChainService.transferEth(this.state.transferEthAmount);
        this.setState({showEthTransferPopup: false, transferEthAmount: 1});
        await this.getEthBalances();
    }

    async handleEthTransferCancel() {
        this.setState({showEthTransferPopup: false, transferEthAmount: 1});
    }

    onChangeTransferEthAmount(e, data) {
        this.setState({transferEthAmount: data.value});
    }


    handleTronFreeze() {
        this.setState({showTronFreezePopup: true});
    }

    async handleTronFreezeComplete() {
        await tronChainService.freezeTRX(this.state.freezeTronAmount, this.state.freezeCheckBoxValue);
        this.setState({showTronFreezePopup: false, freezeTronAmount: 1});
        await this.getTronBalances();
    }

    handleTronFreezeCancel() {
        this.setState({showTronFreezePopup: false, freezeTronAmount: 1});
    }

    onChangeFreezeTronAmount(e, data) {
        this.setState({freezeTronAmount: data.value});
    }

    handleFreezeCheckbox(e, data) {
        this.setState({freezeCheckBoxValue: data.value})
    }


    handleTronWithdraw() {
        this.setState({showTronWithdrawPopup: true});
    }

    async handleTronWithdrawComplete() {
        await tronChainService.withdrawMyKBContract(this.state.withdrawTronAmount);
        this.setState({showTronWithdrawPopup: false, withdrawTronAmount: 1});
        await this.getTronBalances();
    }

    handleTronWithdrawCancel() {
        this.setState({showTronWithdrawPopup: false, withdrawTronAmount: 1});
    }

    onChangeWithdrawTronAmount(e, data) {
        this.setState({withdrawTronAmount: data.value});
    }

    handleTronTransfer() {
        this.setState({showTronTransferPopup: true});
    }

    async handleTronTransferComplete() {
        await tronChainService.sendToDailyAttendanceContract(this.state.transferTronAmount);
        this.setState({showTronTransferPopup: false, transferTronAmount: 1});
        await this.getTronBalances();
    }

    handleTronTransferCancel() {
        this.setState({showTronTransferPopup: false, transferTronAmount: 1});
    }

    onChangeTransferTronAmount(e, data) {
        this.setState({transferTronAmount: data.value});
    }
    render() {
        return (
            <SegmentGroup>
                <SegmentGroup>
                    <Segment>
                        ETH
                    </Segment>

                    <Segment>
                        <Table definition>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>ADMIN 잔고</Table.Cell>
                                    <Table.Cell>{this.state.ethBalances.k2AdminBalance} ETH</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>MYKB 잔고</Table.Cell>
                                    <Table.Cell>{this.state.ethBalances.mykbBalance} ETH</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            content='출금'
                                            disabled={this.state.showEthWithdrawPopup}
                                            positive
                                            onClick={this.handleEthWithdraw}
                                        />

                                        <Portal onClose={this.handleEthWithdrawCancel}
                                                open={this.state.showEthWithdrawPopup}>
                                            <Segment
                                                style={{
                                                    left: '40%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                            >
                                                <Input type='number' onChange={this.onChangeWithdrawEthAmount}
                                                       value={this.state.withdrawEthAmount}/>

                                                <Button
                                                    content='출금'
                                                    positive
                                                    onClick={this.handleEthWithdrawComplete}
                                                />
                                            </Segment>
                                        </Portal>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>DailyAttendance 잔고</Table.Cell>
                                    <Table.Cell>{this.state.ethBalances.dailyAttendanceBalance} ETH</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            content='입금'
                                            disabled={this.state.showEthTransferPopup}
                                            positive
                                            onClick={this.handleEthTransfer}
                                        />

                                        <Portal onClose={this.handleEthTransferCancel}
                                                open={this.state.showEthTransferPopup}>
                                            <Segment
                                                style={{
                                                    left: '40%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                            >
                                                <Input type='number' onChange={this.onChangeTransferEthAmount}
                                                       value={this.state.transferEthAmount}/>

                                                <Button
                                                    content='입금'
                                                    positive
                                                    onClick={this.handleEthTransferComplete}
                                                />
                                            </Segment>
                                        </Portal>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Segment>
                </SegmentGroup>

                <SegmentGroup>
                    <Segment>
                        TRON
                    </Segment>
                    <Segment>
                        <Table definition>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>ADMIN 잔고</Table.Cell>
                                    <Table.Cell>{this.state.tronBalances.k2AdminBalance} TRX (FROZEN : {this.state.tronBalances.k2AdminFrozenBalance})</Table.Cell>
                                    <Table.Cell><Button
                                        content='동결'
                                        disabled={this.state.showTronFreezePopup}
                                        positive
                                        onClick={this.handleTronFreeze}/>

                                        <Portal onClose={this.handleTronFreezeCancel}
                                                open={this.state.showTronFreezePopup}>
                                            <Segment
                                                style={{
                                                    left: '40%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                            >
                                                <Input type='number' onChange={this.onChangeFreezeTronAmount}
                                                       value={this.state.freezeTronAmount}/>
                                                {' '}
                                                <Checkbox
                                                    radio
                                                    label='Energy'
                                                    name='checkboxRadioGroup'
                                                    value='energy'
                                                    checked={this.state.freezeCheckBoxValue === 'energy'}
                                                    onChange={this.handleFreezeCheckbox}
                                                />
                                                {' '}

                                                <Checkbox
                                                    radio
                                                    label='Bandwidth'
                                                    name='checkboxRadioGroup'
                                                    value='bp'
                                                    checked={this.state.freezeCheckBoxValue === 'bp'}
                                                    onChange={this.handleFreezeCheckbox}
                                                />
                                                {' '}
                                                <Button
                                                    content='동결'
                                                    positive
                                                    onClick={this.handleTronFreezeComplete}
                                                />
                                            </Segment>
                                        </Portal>
                                    </Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.Cell width={3}>ADMIN Energy</Table.Cell>
                                    <Table.Cell>{this.state.tronBalances.k2AdminEnergy} Energy</Table.Cell>
                                    <Table.Cell/>
                                </Table.Row>

                                <Table.Row>
                                    <Table.Cell width={3}>ADMIN Bandwidth Point</Table.Cell>
                                    <Table.Cell>{this.state.tronBalances.k2AdminBP} BP</Table.Cell>
                                    <Table.Cell/>
                                </Table.Row>

                                <Table.Row>
                                    <Table.Cell>MYKB 잔고</Table.Cell>
                                    <Table.Cell>{this.state.tronBalances.mykbBalance} TRX</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            content='출금'
                                            disabled={this.state.showTronWithdrawPopup}
                                            positive
                                            onClick={this.handleTronWithdraw}
                                        />

                                        <Portal onClose={this.handleTronWithdrawCancel}
                                                open={this.state.showTronWithdrawPopup}>
                                            <Segment
                                                style={{
                                                    left: '40%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                            >
                                                <Input type='number' onChange={this.onChangeWithdrawTronAmount}
                                                       value={this.state.withdrawTronAmount}/>

                                                <Button
                                                    content='출금'
                                                    positive
                                                    onClick={this.handleTronWithdrawComplete}
                                                />
                                            </Segment>
                                        </Portal>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>DailyAttendance 잔고</Table.Cell>
                                    <Table.Cell>{this.state.tronBalances.dailyAttendanceBalance} TRX</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            content='입금'
                                            disabled={this.state.showTronTransferPopup}
                                            positive
                                            onClick={this.handleTronTransfer}
                                        />

                                        <Portal onClose={this.handleTronTransferCancel}
                                                open={this.state.showTronTransferPopup}>
                                            <Segment
                                                style={{
                                                    left: '40%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                            >
                                                <Input type='number' onChange={this.onChangeTransferTronAmount}
                                                       value={this.state.transferTronAmount}/>

                                                <Button
                                                    content='입금'
                                                    positive
                                                    onClick={this.handleTronTransferComplete}
                                                />
                                            </Segment>
                                        </Portal>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Segment>
                </SegmentGroup>

                <SegmentGroup>
                    <Segment>
                        Klaytn
                    </Segment>
                    <Segment>
                        <Table definition>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>ADMIN 잔고</Table.Cell>
                                    <Table.Cell>{this.state.klaytnBalances.k2AdminBalance} KLAY</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Segment>
                </SegmentGroup>
            </SegmentGroup>
        )

    }
}

export default Chain;
