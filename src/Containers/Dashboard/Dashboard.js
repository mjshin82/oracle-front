import React, {Component} from 'react';
import {Message, Menu, Table} from "semantic-ui-react";
import dashboardService from '../../Services/DashboardService';
import tfService from '../../Services/TensorflowService';
import util from '../../Utils/util'

import './Dashboard.css';
import { Line } from 'react-chartjs-2';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ks11: {},
            kq11: {},
            from: util.isMobile() ? 11: 0
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = async () => {
        await tfService.initialize();
        await dashboardService.initialize();

        let ks11 = dashboardService.output['KS11'];
        let kq11 = dashboardService.output['KQ11'];
        this.setState({
            ks11 : ks11,
            kq11 : kq11
        });
    };

    handleItemClick = (e, {value}) => {
        this.setState({duration: value})
    };

    readyData1 = (date) => {
        if (date === undefined || date === null) {
            return null;
        }

        let res = [];
        const from = this.state.from;
        for (let i=from; i<20; i++) {
            res[i-from] = date[`${i}`];
        }

        return res;
    };

    readyData2 = (low, high) => {
        if (low === undefined || low === null) {
            return null;
        }
        if (high === undefined || high === null) {
            return null;
        }

        let res = [];
        const from = this.state.from;
        for (let i=from; i<20; i++) {
            res[i-from] = [];
            res[i-from][0] = parseInt(low[`${i}`]);
            res[i-from][1] = parseInt(high[`${i}`]);
        }

        return res;
    };

    makeData = (output) => {
        if (output.Date === undefined) {
            return null;
        }

        return {
            labels: this.readyData1(output.Date),
            datasets: [{
                label: '종가',
                type: 'line',
                borderColor: 'rgba(0, 0, 0, 0.5)',
                fill: false,
                data: this.readyData1(output.Close),
                pointRadius: 4,
            }, {
                label: 'AI예상',
                type: 'bar',
                backgroundColor: 'rgba(255, 255, 0, 0.5)',
                borderColor: 'rgba(255, 255, 0, 0.5)',
                data: this.readyData2(output.predLow, output.predHigh),
                pointRadius: 0.2,
                barPercentage: 0.8,
                categoryPercentage: 1,
            }, {
                label: '저가',
                type: 'line',
                backgroundColor: 'white',
                borderColor: 'rgba(0, 0, 255,0.5)',
                data: this.readyData1(output.Low),
                pointRadius: 0.2,
                fill: '1'
            }, {
                label: '고가',
                type: 'line',
                backgroundColor: 'rgba(0, 0, 255,0.5)',
                borderColor: 'rgba(0, 255, 0,0.5)',
                data: this.readyData1(output.High),
                pointRadius: 0.2,
                fill: '-1'
            }]
        };
    };

    render() {
        let ks11 = dashboardService.output['KS11'];
        let kq11 = dashboardService.output['KQ11'];
        let ks11Data = this.makeData(ks11);
        let kq11Data = this.makeData(kq11);

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
                    pointStyle: 'circle'
                },
                line: {
                    tension: 0.000001
                }
            },
            scales: {
                xAxes: [{
                    offset: true,
                }],
                yAxes: [{
                    type: 'linear',
                    position: 'left',
                    id: 'y-axis-1',
                }]
            }
        };

        let ks11PredLow = dashboardService.ksLow;
        let ks11PredHigh = dashboardService.ksHigh;
        let kq11PredLow = dashboardService.kqLow;
        let kq11PredHigh = dashboardService.kqHigh;

        return (
            <div id="Dashboard" className="Dashboard">
                <div className="DashboardDescBox">
                    <Message info>
                        <Message.Header>KOSPI 예상</Message.Header>
                        저가: {ks11PredLow}<br/>
                        고가: {ks11PredHigh}
                    </Message>

                    {ks11Data ?
                        <Line data={ks11Data} height={250} options={options}/>
                        :
                        ""
                    }
                    <br/>

                    <Message info>
                        <Message.Header>KOSDAQ 예상</Message.Header>
                        저가: {kq11PredLow}<br/>
                        고가: {kq11PredHigh}
                    </Message>
                    {kq11Data ?
                        <Line data={kq11Data} height={250} options={options}/>
                        :
                        ""
                    }
                </div>
            </div>
        );
    }
}

export default Dashboard;
