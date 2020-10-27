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
            from: util.isMobile() ? 8: 0
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData = () => {
        //await tfService.initialize();
        dashboardService.initialize();

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
                    <br/>
                    <br/>
                    <Message warn>
                        <h5>이게 대체 뭔가요?</h5>
                        5년치가 학습된 Tensorflow를 이용해서 다음날의 코스피와 코스닥 저가와 고가를 예측합니다.
                        <h5>어떠한 원리에 의해 예측되나요?</h5>
                        코스피와 코스닥은 미국/ 중국/ 유럽등의 증시에 영향을 많이 받습니다. 전날의 지수와 다음날의 코스피/코스닥 지수관의 상관관계를 Tensorflow가 자동으로 찾아줍니다.
                        <h5>얼마나 정확한가요?</h5>
                        이전 주가를 기반으로 하는 기술적 분석입니다. 때문에 시장의 돌발적인 상황에 대처할 수는 없습니다. 차트에서 과거의 노란색 영역으로 대략적인 정확도를 확인하실 수 있습니다.
                        <h5>다음날 예측은 언제 갱신되나요</h5>
                        전날의 한/미/중/유럽장이 미감되야 예측이 완료됩니다. 그전까지는 현재 지수, 아직 장이 열리지 않았으면 전날의 지수를 기반으로 예측합니다. 장 마감 전까지는 예측율이 떨어집니다. 1시간마다 한번씩 갱신됩니다.
                        <h5>왜 만들었나요?</h5>
                        개인 적인 Tensorflow 스터디의 일환으로 개발된 페이지입니다. 국가별 지수간에 상관 관계가 있을 거라는 가정하게 개발하게 되었습니다.
                        <h5>투자에 대한 책임을 지지 않습니다.</h5>
                        데이터가 정확하지 않을 수 있습니다. 보조 지표로만 이용해 주세요.
                    </Message>
                </div>
            </div>
        );
    }
}

export default Dashboard;
