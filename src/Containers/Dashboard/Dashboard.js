import React, {Component} from 'react';
import {Message, Card, Icon} from "semantic-ui-react";
import dashboardService from '../../Services/DashboardService';
import tfService from '../../Services/TensorflowService';
import util from '../../Utils/util'
import updated from '../../Data/LastUpdate.json'

import './Dashboard.css';
import { Line } from 'react-chartjs-2';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ks11: {},
            ks200: {},
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
        let ks200 = dashboardService.output['KS200'];
        this.setState({
            ks11 : ks11,
            ks200 : ks200,
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
            res[i-from][0] = (low[`${i}`]).toFixed(2);
            res[i-from][1] = (high[`${i}`]).toFixed(2);
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

    getDir(dir) {
        if (dir == 1) {
            return "상승";
        }

        return "하락";
    }

    render() {
        let ks11 = dashboardService.output['KS11'];
        let ks200 = dashboardService.output['KS200'];
        let kq11 = dashboardService.output['KQ11'];
        let ks11Data = this.makeData(ks11);
        let ks200Data = this.makeData(ks200);
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

        let report = dashboardService.report;

        return (
            <div id="Dashboard" className="Dashboard">
                <div>
                    최종 갱신 {updated.lastUpdated}
                </div>
                <div>
                    <Card>
                        <Card.Content>
                        <Card.Header>KOSPI</Card.Header>
                        <Card.Meta>
                            <span className='date'>{report['KS11'][0].date}</span>
                        </Card.Meta>
                        <Card.Description>
                            범위 예상: {report['KS11'][0].predLow} - {report['KS11'][0].predHigh}<br/>
                            중간가 예상: {this.getDir(report['KS11'][0].predCenterDir)}<br/>
                            종가 예상: {this.getDir(report['KS11'][0].predCloseDir)}<br/>
                            실제 종가: {report['KS11'][0].close}<br/> 
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                        <Card.Meta>
                            <span className='date'>다음장</span>
                        </Card.Meta>
                        <Card.Description>
                            범위 예상: {report['KS11'][1].predLow} - {report['KS11'][1].predHigh}<br/>
                            중간가 예상: {this.getDir(report['KS11'][1].predCenterDir)}<br/>
                            종가 예상: {this.getDir(report['KS11'][1].predCloseDir)}<br/>
                        </Card.Description>
                        </Card.Content>
                    </Card>

                    {ks11Data ?
                        <Line data={ks11Data} height={250} options={options}/>
                        :
                        ""
                    }
                    <br/>

                    
                    <Card>
                        <Card.Content>
                        <Card.Header>KOSPI 200 예상</Card.Header>
                        <Card.Meta>
                            <span className='date'>{report['KS200'][0].date}</span>
                        </Card.Meta>
                        <Card.Description>
                            범위 예상: {report['KS200'][0].predLow} - {report['KS200'][0].predHigh}<br/>
                            중간가 예상: {this.getDir(report['KS200'][0].predCenterDir)}<br/>
                            종가 예상: {this.getDir(report['KS200'][0].predCloseDir)}<br/>
                            실제 종가: {report['KS200'][0].close}<br/>
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                        <Card.Meta>
                            <span className='date'>다음장</span>
                        </Card.Meta>
                        <Card.Description>
                            범위 예상: {report['KS200'][1].predLow} - {report['KS200'][1].predHigh}<br/>
                            중간가 예상: {this.getDir(report['KS200'][1].predCenterDir)}<br/>
                            종가 예상: {this.getDir(report['KS200'][1].predCloseDir)}<br/>
                        </Card.Description>
                        </Card.Content>
                    </Card>
                    

                    {ks11Data ?
                        <Line data={ks200Data} height={250} options={options}/>
                        :
                        ""
                    }
                    <br/>

                    
                    <Card>
                        <Card.Content>
                        <Card.Header>KOSDAQ 예상</Card.Header>
                        <Card.Meta>
                            <span className='date'>{report['KQ11'][0].date}</span>
                        </Card.Meta>
                        <Card.Description>
                            범위 예상: {report['KQ11'][0].predLow} - {report['KQ11'][0].predHigh}<br/>
                            중간가 예상: {this.getDir(report['KQ11'][0].predCenterDir)}<br/>
                            종가 예상: {this.getDir(report['KQ11'][0].predCloseDir)}<br/>
                            실제 종가: {report['KQ11'][0].close}<br/>
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                        <Card.Meta>
                            <span className='date'>다음장</span>
                        </Card.Meta>
                        <Card.Description>
                            범위 예상: {report['KQ11'][1].predLow} - {report['KQ11'][1].predHigh}<br/>
                            중간가 예상: {this.getDir(report['KQ11'][1].predCenterDir)}<br/>
                            종가 예상: {this.getDir(report['KQ11'][1].predCloseDir)}<br/>
                        </Card.Description>
                        </Card.Content>
                    </Card>
                    

                    {kq11Data ?
                        <Line data={kq11Data} height={250} options={options}/>
                        :
                        ""
                    }
                    <br/>
                    <br/>
                    <Message warn>
                        <h5>이게 대체 뭔가요?</h5>
                        3년치가 학습된 Tensorflow를 이용해서 다음날의 코스피와 코스닥 저가와 고가를 예측합니다.
                        <h5>어떠한 원리에 의해 예측되나요?</h5>
                        코스피와 코스닥은 미국 증시 환율등에 영향을 많이 받습니다. 전날의 지수와 다음날의 코스피/코스닥 지수관의 상관관계를 Tensorflow가 자동으로 찾아줍니다.
                        <h5>얼마나 정확한가요?</h5>
                        이전 주가를 기반으로 하는 기술적 분석입니다. 때문에 당일 시장의 분위기나 이슈에 대처할 수는 없습니다. 차트에서 과거의 노란색 영역으로 대략적인 정확도를 확인하실 수 있습니다.
                        <h5>다음날 예측은 언제 갱신되나요</h5>
                        전날의 한/미/중/유럽장이 미감되야 예측이 완료됩니다. 그전까지는 현재 지수, 아직 장이 열리지 않았으면 전날의 지수를 기반으로 예측합니다. 장 마감 전까지는 예측율이 떨어집니다. 20분마다 갱신됩니다.
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
