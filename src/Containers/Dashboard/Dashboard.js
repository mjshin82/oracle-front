import React, {Component} from 'react';
import {Message, Menu, Table} from "semantic-ui-react";
import accountService from '../../Services/AccountService';
import dashboardService from '../../Services/DashboardService';
import './Dashboard.css';
import {Line} from 'react-chartjs-2';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            totalAccount: 0,
            duration: 14,
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = async () => {
        await dashboardService.getAllIapLogs();

        let res = await accountService.getCount();
        if (res != null) {
            this.setState({
                totalAccount: res
            });
        }
    };

    handleItemClick = (e, {value}) => {
        this.setState({duration: value})
    };

    render() {
        const {totalAccount, duration} = this.state;

        let store = [];
        let product = [];
        let price = dashboardService.price;
        let storeS = dashboardService.storeS;
        let storeR = dashboardService.storeR;
        dashboardService.store.forEach((value, key) => store.push({key, value}));
        dashboardService.product.forEach((value, key) => product.push({key, value}));


        let iapLogs = dashboardService.iapLogs;
        let apple = [];
        let android = [];
        let web = [];
        let tweb = [];
        let sum = [];

        let lastKey = '';
        let lastApple = 0;
        let lastAndroid = 0;
        let lastWeb = 0;
        let lastTWeb = 0;
        let lastYmdt = null;
        let labels = [];

        iapLogs.sort((a, b)=> {
            return a.purchaseYmdt - b.purchaseYmdt;
        });

        iapLogs.forEach(e => {
            let ymdt = new Date(e.purchaseYmdt * 1000 - 3600 * 9 * 1000);
            let key = ymdt.getFullYear() + "-" + (ymdt.getMonth() + 1) + "-" + ymdt.getDate();
            let price = dashboardService.price.get(e.productId);
            if (e.no >= this.v2No && this.price.get(e.productId + "-v2") !== null) {
                price = this.price.get(e.productId + "-v2");
            }

            if (lastKey !== key) {
                if (lastYmdt != null) {
                    //var date = new Date(lastYmdt.getFullYear(), lastYmdt.getMonth(), lastYmdt.getDate());
                    var date = (1 + lastYmdt.getMonth()) + "-" + lastYmdt.getDate();
                    apple.push({x: date, y: parseInt(lastApple)});
                    android.push({x: date, y: parseInt(lastAndroid)});
                    web.push({x: date, y: parseInt(lastWeb)});
                    tweb.push({x: date, y: parseInt(lastTWeb)});
                    sum.push({x: date, y: parseInt(lastApple + lastAndroid + lastWeb + lastTWeb)});
                    labels.push(date);
                }

                lastApple = 0;
                lastAndroid = 0;
                lastWeb = 0;
                lastTWeb = 0;
                lastKey = key;
            }

            if (e.store === 'ios') {
                lastApple += price;
            } else if (e.store === 'android') {
                lastAndroid += price;
            } else if (e.store === 'WEB') {
                lastWeb += price;
            } else if (e.store === 'TWEB') {
                lastTWeb += price;
            }

            lastYmdt = ymdt;
        });

        if (lastYmdt != null) {
            var date = (1 + lastYmdt.getMonth()) + "-" + lastYmdt.getDate();
            apple.push({x: date, y: parseInt(lastApple)});
            android.push({x: date, y: parseInt(lastAndroid)});
            web.push({x: date, y: parseInt(lastWeb)});
            tweb.push({x: date, y: parseInt(lastTWeb)});
            sum.push({x: date, y: parseInt(lastApple + lastAndroid + lastWeb + lastTWeb)});
            labels.push(date);
        }

        if (duration > 0) {
            apple = apple.splice(apple.length - duration);
            android = android.splice(android.length - duration);
            web = web.splice(web.length - duration);
            tweb = tweb.splice(tweb.length - duration);
            sum = sum.splice(sum.length - duration);
            labels = labels.splice(labels.length - duration);
        }

        let maxValue = 0;
        sum.forEach(e => {
            maxValue = Math.max(e.y, maxValue);
        });

        maxValue = parseInt(Math.ceil(maxValue / 400.0) * 400);

        let pointSize = 8;
        if (duration == 0 || duration > 14) {
            pointSize = 0;
        }

        let data = {
            labels: labels,
            datasets: [{
                label: 'Android',
                backgroundColor: 'rgb(217, 83, 79)',
                borderColor: 'rgba(217, 83, 79, 0.1)',
                data: android,
                fill: true,
                pointRadius: 0.2,
                yAxisID: 'y-axis-1',
            }, {
                label: 'iOS',
                backgroundColor: 'rgb(92, 184, 92)',
                borderColor: 'rgba(92, 184, 92, 0.1)',
                data: apple,
                fill: true,
                pointRadius: 0.2,
                yAxisID: 'y-axis-1',
            }, {
                label: 'Web',
                backgroundColor: 'rgb(2, 117, 216)',
                borderColor: 'rgba(2, 117, 216, 0.1)',
                data: web,
                fill: true,
                pointRadius: 0.2,
                yAxisID: 'y-axis-1',
            }, {
                label: 'TWeb',
                backgroundColor: 'rgb(245, 233, 66)',
                borderColor: 'rgba(245, 233, 66, 0.1)',
                data: tweb,
                fill: true,
                pointRadius: 0.2,
                yAxisID: 'y-axis-1',
            }, {
                label: 'Sum',
                backgroundColor: 'rgb(0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 1)',
                data: sum,
                fill: false,
                pointRadius: pointSize,
                pointHoverRadius: pointSize,
                yAxisID: 'y-axis-2',
            }]
        };

        let options = {
            responsive: true,
            tooltips: {
                mode: 'index',
            },
            hover: {
                mode: 'index'
            },
            elements: {
                point: {
                    pointStyle: 'rect'
                }
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    stacked: true,
                    position: 'left',
                    id: 'y-axis-1',
                    ticks: {
                        min: 0,
                        max: maxValue
                    }
                }, {
                    type: 'linear',
                    display: false,
                    position: 'left',
                    id: 'y-axis-2',
                    ticks: {
                        min: 0,
                        max: maxValue
                    }
                }]
            }
        };


        return (
            <div id="Dashboard" className="Dashboard">
                <h1>Dashboard</h1>
                <div className="DashboardDescBox">
                    <Message info>
                        <Message.Header>Total Account</Message.Header>
                        <Message.Content>
                            {totalAccount} Account
                        </Message.Content>
                    </Message>

                    <div>
                    </div>

                    <h3>Purchase Logs (Store)</h3>
                    <Menu>
                        <Menu.Item
                            name='7 Days'
                            value={7}
                            active={duration === 7}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='14 Days'
                            value={14}
                            active={duration === 14}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='30 Days'
                            value={30}
                            active={duration === 30}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='All'
                            value={0}
                            active={duration === 0}
                            onClick={this.handleItemClick}
                        />
                    </Menu>
                    <Line data={data} height={250} options={options}/>

                    <Table size='small'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Store</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>Count</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>Sales($)</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>Revenue($)</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {store.map((e) => {
                                return (
                                    <Table.Row key={e.key}>
                                        <Table.Cell>{e.key}</Table.Cell>
                                        <Table.Cell textAlign='right'>{e.value}</Table.Cell>
                                        <Table.Cell
                                            textAlign='right'>{parseInt(storeS.get(e.key)).toLocaleString()}</Table.Cell>
                                        <Table.Cell
                                            textAlign='right'>{parseInt(storeR.get(e.key)).toLocaleString()}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>

                    <h3>Purchase Logs (Product)</h3>
                    <Table size='small'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Product Id</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>Count</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>Sales($)</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {product.map((e) => {
                                return (
                                    <Table.Row key={e.key}>
                                        <Table.Cell>{e.key}</Table.Cell>
                                        <Table.Cell textAlign='right'>{e.value}</Table.Cell>
                                        <Table.Cell
                                            textAlign='right'>{parseInt(e.value * price.get(e.key)).toLocaleString()}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>

                    <div>
                        <a href='https://etherscan.io/address/0x9702a479115788294232c384a5c1f42c881789fe'>OWNER</a><br/>
                        <a href='https://etherscan.io/address/0x3113Bf50Ee2773cD7EecBb48d1F6a197e01C294b'>SHOP</a><br/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
