import React, {Component} from 'react';
import {Tab, Table, Modal, Button} from 'semantic-ui-react'
import monitoringService from '../../Services/MonitoringService';
import {Line} from "react-chartjs-2";
import './Monitoring.css';

class Monitoring extends Component {


    constructor(props) {
        super(props);

        this.refreshInterval = null;

        this.state = {
            monitoringData: {
                SESSION: {},
                CHAT: {},
                DEFENSE: {},
                MATCH: {}
            },

            chatRooms: [],
            matchCandidates: [],
            defenseRooms: [],
            connectedUserIds: [],

            chartHeight: 250,
            chartOptions: {
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
                    yAxes: [
                        {
                            type: 'linear',
                            stacked: true,
                            position: 'left',
                            id: 'y-axis-1',
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1
                            }
                        }
                    ]
                }
            }
        }

        this.handleClickChatDetail = this.handleClickChatDetail.bind(this);
        this.handleClickMatchDetail = this.handleClickMatchDetail.bind(this);
        this.handleClickDefenseDetail = this.handleClickDefenseDetail.bind(this);
        this.handleClickSessionDetail = this.handleClickSessionDetail.bind(this);
        this.convertDate2HHMM = this.convertDate2HHMM.bind(this);
        this.handleClickDefenseRoomRemove = this.handleClickDefenseRoomRemove.bind(this);
    }

    async componentDidMount() {
        let self = this;
        await this.getLatestMonitoringData(self);
        this.refreshInterval = setInterval(this.getLatestMonitoringData, 30 * 1000, self);
    }

    async componentWillUnmount() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
        }
    }

    async getLatestMonitoringData(self) {
        const monitoringData = await monitoringService.getMonitoringData();

        if (monitoringData) {
            console.log(monitoringData);
            self.setState({
                monitoringData: monitoringData.data,
            })
        }


    }

    handleClickChatDetail(serverIp, event) {

        let dataSize = this.state.monitoringData.CHAT[serverIp].length;
        console.log(this.state.monitoringData.CHAT[serverIp][dataSize - 1].sendTime + ":" + this.state.monitoringData.CHAT[serverIp][dataSize - 1].details);

        this.setState({
            chatRooms: JSON.parse(this.state.monitoringData.CHAT[serverIp][dataSize - 1].details).sort((e1, e2) => {
                if (e1.chatRoom.roomNumber < e2.chatRoom.roomNumber) {
                    return -1;
                } else {
                    return 1;
                }
            })
        })
    }

    handleClickMatchDetail(matchType, event) {
        let dataSize = this.state.monitoringData.MATCH[matchType].length;
        console.log(this.state.monitoringData.MATCH[matchType][dataSize - 1].details);
        this.setState({
            matchCandidates: JSON.parse(this.state.monitoringData.MATCH[matchType][dataSize - 1].details)
        })
    }

    handleClickDefenseDetail(serverIp, event) {
        let dataSize = this.state.monitoringData.DEFENSE[serverIp].length;
        console.log(this.state.monitoringData.DEFENSE[serverIp][dataSize - 1].details);
        this.setState({
            defenseRooms: JSON.parse(this.state.monitoringData.DEFENSE[serverIp][dataSize - 1].details)
        })
    }

    handleClickSessionDetail(serverIp, event) {

        let dataSize = this.state.monitoringData.SESSION[serverIp].length;
        console.log(this.state.monitoringData.SESSION[serverIp][dataSize - 1].details);
        this.setState({
            connectedUserIds: JSON.parse(this.state.monitoringData.SESSION[serverIp][dataSize - 1].details)
        })
    }

    async handleClickDefenseRoomRemove(defenseRoomId, event) {
        console.log(defenseRoomId);
        await monitoringService.removeDefenseRoom(defenseRoomId);
        await this.getLatestMonitoringData(this);
    }

    convertDate2HHMM(date) {
        let hh = '' + date.getHours();
        let mm = '' + date.getMinutes();

        if (hh.length === 1) {
            hh = '0' + hh;
        }

        if (mm.length === 1) {
            mm = '0' + mm;
        }
        return hh + ":" + mm;
    }

    render() {
        return (
            <Tab menu={{secondary: true, pointing: true}} panes={
                [
                    {
                        menuItem: 'SESSION',
                        render: () => {

                            const {monitoringData} = this.state;
                            const sessionData = {};
                            let sessionLabels = [];

                            Object.keys(monitoringData.SESSION).forEach(serverIp => {
                                sessionLabels = monitoringData.SESSION[serverIp].map(v => {
                                    return this.convertDate2HHMM(new Date(v.sendTime * 1000));
                                });

                                sessionData[serverIp] = {
                                    labels: sessionLabels,
                                    datasets: [{
                                        label: 'Connected user count',
                                        backgroundColor: 'rgb(92, 184, 92)',
                                        borderColor: 'rgba(92, 184, 92, 0.1)',
                                        data: monitoringData.SESSION[serverIp].map(v => {
                                            return {
                                                x: this.convertDate2HHMM(new Date(v.sendTime * 1000)),
                                                y: v.connectionCount
                                            };
                                        }),
                                        fill: true,
                                        pointRadius: 4,
                                        pointBorderColor: 'green',
                                        yAxisID: 'y-axis-1',
                                    }]
                                };
                            });

                            return (
                                <Tab.Pane attached={false}>
                                    <div>
                                        {
                                            Object.keys(sessionData).map(serverIp => {
                                                return (
                                                    <div key={serverIp}>
                                                        <div className="MonitorInfo">
                                                        {serverIp}
                                                        <Modal
                                                            trigger={<Button basic fluid
                                                                             onClick={event => this.handleClickSessionDetail(serverIp, event)}>Details</Button>}
                                                            header='Connected User'
                                                            content={
                                                                <Table>
                                                                    <Table.Header>
                                                                        <Table.Row>
                                                                            <Table.Cell>UserId</Table.Cell>
                                                                        </Table.Row>
                                                                    </Table.Header>
                                                                    <Table.Body>
                                                                        {
                                                                            this.state.connectedUserIds.map(connectedUserId => {
                                                                                return (<Table.Row
                                                                                    key={connectedUserId}>
                                                                                    <Table.Cell>{connectedUserId}</Table.Cell>
                                                                                </Table.Row>)
                                                                            })
                                                                        }
                                                                    </Table.Body>
                                                                </Table>

                                                            }
                                                            actions={[{
                                                                key: 'done',
                                                                content: 'Done',
                                                                positive: true
                                                            }]}
                                                        />
                                                        </div>

                                                        <Line data={sessionData[serverIp]}
                                                              height={this.state.chartHeight}
                                                              options={this.state.chartOptions}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </Tab.Pane>
                            );
                        },
                    },
                    {
                        menuItem: 'CHAT',
                        render: () => {
                            const {monitoringData} = this.state;
                            const chatData = {};
                            let chatLabels = [];

                            Object.keys(monitoringData.CHAT).forEach(serverIp => {
                                chatLabels = monitoringData.CHAT[serverIp].map(v => {
                                    return this.convertDate2HHMM(new Date(v.sendTime * 1000));
                                });

                                chatData[serverIp] = {
                                    labels: chatLabels,
                                    datasets: [{
                                        label: 'ChatRoom Count',
                                        backgroundColor: 'rgb(92, 184, 92)',
                                        borderColor: 'rgba(92, 184, 92, 0.1)',
                                        data: monitoringData.CHAT[serverIp].map(v => {
                                            return {
                                                x: this.convertDate2HHMM(new Date(v.sendTime * 1000)),
                                                y: v.connectionCount
                                            };
                                        }),
                                        fill: true,
                                        pointRadius: 4,
                                        pointBorderColor: 'green',
                                        yAxisID: 'y-axis-1',
                                    }]
                                };
                            });

                            return (
                                <Tab.Pane attached={true}>
                                    <div>
                                        {
                                            Object.keys(chatData).map(serverIp => {
                                                return (
                                                    <div key={serverIp}>
                                                        <div className="MonitorInfo">
                                                        {serverIp}
                                                        <Modal
                                                            trigger={<Button basic fluid
                                                                             onClick={event => this.handleClickChatDetail(serverIp, event)}>Details</Button>}
                                                            header='ChatRooms'
                                                            content={
                                                                <Tab menu={{secondary: true, pointing: true}}
                                                                     panes={[
                                                                         {
                                                                             menuItem: 'PUBLIC',
                                                                             render: () => {
                                                                                 return (
                                                                                     <Table>
                                                                                         <Table.Header>
                                                                                             <Table.Row>
                                                                                                 <Table.Cell>ChainType</Table.Cell>
                                                                                                 <Table.Cell>LanguageType</Table.Cell>
                                                                                                 <Table.Cell>RoomNumber</Table.Cell>
                                                                                                 <Table.Cell>ParticipantCount</Table.Cell>
                                                                                                 <Table.Cell>ChatMessages</Table.Cell>
                                                                                             </Table.Row>
                                                                                         </Table.Header>
                                                                                         <Table.Body>
                                                                                             {
                                                                                                 this.state.chatRooms.map(chatRoomDetail => {
                                                                                                     if (chatRoomDetail.chatRoom.chatRoomType === 'PUBLIC') {
                                                                                                         return (
                                                                                                             <Table.Row
                                                                                                                 key={chatRoomDetail.chatRoom.ip + '_' + chatRoomDetail.chatRoom.roomNumber}>
                                                                                                                 <Table.Cell>{chatRoomDetail.chatRoom.chainType}</Table.Cell>
                                                                                                                 <Table.Cell>{chatRoomDetail.chatRoom.languageType}</Table.Cell>
                                                                                                                 <Table.Cell>{chatRoomDetail.chatRoom.roomNumber}</Table.Cell>
                                                                                                                 <Table.Cell>{chatRoomDetail.chatRoom.participants.length}</Table.Cell>
                                                                                                                 <Table.Cell>
                                                                                                                     <Modal
                                                                                                                         trigger={
                                                                                                                             <Button>view</Button>}
                                                                                                                         header='chatMessages'
                                                                                                                         content={
                                                                                                                             <Table>
                                                                                                                                 <Table.Body>
                                                                                                                                     {
                                                                                                                                         chatRoomDetail.chatMessages.map((v, index) => {
                                                                                                                                             const chatMessage = JSON.parse(v);
                                                                                                                                             return (
                                                                                                                                                 <Table.Row
                                                                                                                                                     key={index}>
                                                                                                                                                     <Table.Cell>{chatMessage.userName}</Table.Cell>
                                                                                                                                                     <Table.Cell>{chatMessage.message}</Table.Cell>
                                                                                                                                                 </Table.Row>
                                                                                                                                             )
                                                                                                                                         })
                                                                                                                                     }
                                                                                                                                 </Table.Body>

                                                                                                                             </Table>
                                                                                                                         }
                                                                                                                         actions={[{
                                                                                                                             key: 'done',
                                                                                                                             content: 'Done',
                                                                                                                             positive: true
                                                                                                                         }]}
                                                                                                                     />
                                                                                                                 </Table.Cell>
                                                                                                             </Table.Row>)
                                                                                                     } else {
                                                                                                         return null;
                                                                                                     }
                                                                                                 })
                                                                                             }
                                                                                         </Table.Body>
                                                                                     </Table>)
                                                                             }
                                                                         },
                                                                         {
                                                                             menuItem: 'GUILD',
                                                                             render: () => {
                                                                                 return (
                                                                                     <Table>
                                                                                         <Table.Header>
                                                                                             <Table.Row>
                                                                                                 <Table.Cell>RoomNumber</Table.Cell>
                                                                                                 <Table.Cell>ParticipantCount</Table.Cell>
                                                                                                 <Table.Cell>ChatMessages</Table.Cell>
                                                                                             </Table.Row>
                                                                                         </Table.Header>
                                                                                         <Table.Body>
                                                                                             {
                                                                                                 this.state.chatRooms.map(chatRoomDetail => {
                                                                                                     if (chatRoomDetail.chatRoom.chatRoomType === 'GUILD') {
                                                                                                         return (
                                                                                                             <Table.Row
                                                                                                                 key={chatRoomDetail.chatRoom.ip + '_' + chatRoomDetail.chatRoom.roomNumber}>
                                                                                                                 <Table.Cell>{chatRoomDetail.chatRoom.roomNumber}</Table.Cell>
                                                                                                                 <Table.Cell>{chatRoomDetail.chatRoom.participants.length}</Table.Cell>
                                                                                                                 <Table.Cell>
                                                                                                                     <Modal
                                                                                                                         trigger={
                                                                                                                             <Button>view</Button>}
                                                                                                                         header='chatMessages'
                                                                                                                         content={
                                                                                                                             <Table>
                                                                                                                                 <Table.Body>
                                                                                                                                     {
                                                                                                                                         chatRoomDetail.chatMessages.map((v, index) => {
                                                                                                                                             const chatMessage = JSON.parse(v);
                                                                                                                                             return (
                                                                                                                                                 <Table.Row
                                                                                                                                                     key={index}>
                                                                                                                                                     <Table.Cell>{chatMessage.userName}</Table.Cell>
                                                                                                                                                     <Table.Cell>{chatMessage.message}</Table.Cell>
                                                                                                                                                 </Table.Row>
                                                                                                                                             )
                                                                                                                                         })
                                                                                                                                     }
                                                                                                                                 </Table.Body>

                                                                                                                             </Table>
                                                                                                                         }
                                                                                                                         actions={[{
                                                                                                                             key: 'done',
                                                                                                                             content: 'Done',
                                                                                                                             positive: true
                                                                                                                         }]}
                                                                                                                     />
                                                                                                                 </Table.Cell>
                                                                                                             </Table.Row>)
                                                                                                     } else {
                                                                                                         return null;
                                                                                                     }
                                                                                                 })
                                                                                             }
                                                                                         </Table.Body>
                                                                                     </Table>)
                                                                             }
                                                                         }
                                                                     ]
                                                                     }/>
                                                            }
                                                            actions={[{
                                                                key: 'done',
                                                                content: 'Done',
                                                                positive: true
                                                            }]}
                                                        />
                                                        </div>
                                                        <Line data={chatData[serverIp]}
                                                              height={this.state.chartHeight}
                                                              options={this.state.chartOptions}/>
                                                    </div>

                                                )
                                            })
                                        }
                                    </div>
                                </Tab.Pane>
                            );
                        }
                    },
                    {
                        menuItem: 'DEFENSE',
                        render: () => {
                            const {monitoringData} = this.state;
                            const defenseData = {};
                            let defenseLabels = [];

                            Object.keys(monitoringData.DEFENSE).forEach(serverIp => {
                                defenseLabels = monitoringData.DEFENSE[serverIp].map(v => {
                                    return this.convertDate2HHMM(new Date(v.sendTime * 1000));
                                });

                                console.log(monitoringData.DEFENSE[serverIp].details);
                                const pvpCounts = monitoringData.DEFENSE[serverIp].map(d => {
                                    const details = JSON.parse(d.details);
                                    return {
                                        x: this.convertDate2HHMM(new Date(d.sendTime * 1000)),
                                        y: details.filter(v => v.matchType === 'DsRtPvP').length
                                    };
                                });

                                console.log(pvpCounts);

                                const pveCounts = monitoringData.DEFENSE[serverIp].map(d => {
                                    const details = JSON.parse(d.details);
                                    return {
                                        x: this.convertDate2HHMM(new Date(d.sendTime * 1000)),
                                        y: details.filter(v => v.matchType === 'DsRtPvE').length
                                    };
                                });

                                defenseData[serverIp] = {
                                    labels: defenseLabels,
                                    datasets: [{
                                        label: 'pvp room count',
                                        backgroundColor: 'rgb(217, 83, 79)',
                                        borderColor: 'rgba(217, 83, 79, 0.1)',
                                        data: pvpCounts,
                                        fill: true,
                                        pointRadius: 4,
                                        pointBorderColor: 'green',
                                        yAxisID: 'y-axis-1',
                                    },
                                        {
                                            label: 'pve room count',

                                            backgroundColor: 'rgb(92, 184, 92)',
                                            borderColor: 'rgba(92, 184, 92, 0.1)',
                                            data: pveCounts,
                                            fill: true,
                                            pointRadius: 4,
                                            pointBorderColor: 'green',
                                            yAxisID: 'y-axis-1',
                                        }
                                    ]
                                };
                            });

                            return (
                                <Tab.Pane attached={false}>
                                    <div>
                                        {
                                            Object.keys(defenseData).map(serverIp => {
                                                return (
                                                    <div key={serverIp}>
                                                        <div className="MonitorInfo">
                                                        {serverIp}

                                                        <Modal
                                                            trigger={<Button basic fluid
                                                                             onClick={event => this.handleClickDefenseDetail(serverIp, event)}>Details</Button>}
                                                            header='DefenseRooms'
                                                            content={
                                                                <Table>
                                                                    <Table.Header>
                                                                        <Table.Row>
                                                                            <Table.Cell>RoomId</Table.Cell>
                                                                            <Table.Cell>UserInfo</Table.Cell>
                                                                            <Table.Cell>RoomState</Table.Cell>
                                                                            <Table.Cell>Delete</Table.Cell>
                                                                        </Table.Row>
                                                                    </Table.Header>
                                                                    <Table.Body>
                                                                        {
                                                                            this.state.defenseRooms.map(defenseRoom => {
                                                                                return (
                                                                                    <Table.Row
                                                                                        key={defenseRoom.roomId}>
                                                                                        <Table.Cell>{defenseRoom.roomId}</Table.Cell>
                                                                                        <Table.Cell>{defenseRoom.userInfo}</Table.Cell>
                                                                                        <Table.Cell>{defenseRoom.state}</Table.Cell>
                                                                                        <Table.Cell><Button
                                                                                            onClick={event => {
                                                                                                this.handleClickDefenseRoomRemove(defenseRoom.roomId, event)
                                                                                            }}>del</Button></Table.Cell>
                                                                                    </Table.Row>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Table.Body>
                                                                </Table>

                                                            }
                                                            actions={[{
                                                                key: 'done',
                                                                content: 'Done',
                                                                positive: true
                                                            }]}
                                                        />

                                                        </div>

                                                        <Line data={defenseData[serverIp]}
                                                              height={this.state.chartHeight}
                                                              options={this.state.chartOptions}/>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </Tab.Pane>
                            );
                        },
                    },
                    {
                        menuItem: 'MATCH',
                        render: () => {
                            const {monitoringData} = this.state;
                            const matchData = {};
                            let matchLabels = [];

                            Object.keys(monitoringData.MATCH).forEach(serverIp => {
                                matchLabels = monitoringData.MATCH[serverIp].map(v => {
                                    return this.convertDate2HHMM(new Date(v.sendTime * 1000));
                                });

                                matchData[serverIp] = {
                                    labels: matchLabels,
                                    datasets: [{
                                        label: 'match candidates count',
                                        backgroundColor: 'rgb(92, 184, 92)',
                                        borderColor: 'rgba(92, 184, 92, 0.1)',
                                        data: monitoringData.MATCH[serverIp].map(v => {
                                            return {
                                                x: this.convertDate2HHMM(new Date(v.sendTime * 1000)),
                                                y: v.connectionCount
                                            };
                                        }),
                                        fill: true,
                                        pointRadius: 4,
                                        pointBorderColor: 'green',
                                        yAxisID: 'y-axis-1',
                                    }]
                                };
                            });

                            return (
                                <Tab.Pane attached={false}>
                                    <div>
                                        {
                                            Object.keys(matchData).map(matchType => {
                                                return (
                                                    <div key={matchType}>
                                                        <div className="MonitorInfo">
                                                        {matchType}

                                                        <Modal
                                                            trigger={<Button basic fluid
                                                                             onClick={event => this.handleClickMatchDetail(matchType, event)}>Details</Button>}
                                                            header='MatchCandidates'
                                                            content={
                                                                <Table>
                                                                    <Table.Header>
                                                                        <Table.Row>
                                                                            <Table.Cell>UserId</Table.Cell>
                                                                            <Table.Cell>ChainCode</Table.Cell>
                                                                            <Table.Cell>Score</Table.Cell>
                                                                            <Table.Cell>RegisterTime</Table.Cell>
                                                                        </Table.Row>
                                                                    </Table.Header>
                                                                    <Table.Body>
                                                                        {
                                                                            this.state.matchCandidates.map(matchCandidate => {
                                                                                return (<Table.Row
                                                                                    key={matchCandidate.userId}>
                                                                                    <Table.Cell>{matchCandidate.userId}</Table.Cell>
                                                                                    <Table.Cell>{matchCandidate.chainCode}</Table.Cell>
                                                                                    <Table.Cell>{matchCandidate.score}</Table.Cell>
                                                                                    <Table.Cell>{new Date(matchCandidate.registerTime * 1000).toLocaleString()}</Table.Cell>
                                                                                </Table.Row>)
                                                                            })
                                                                        }
                                                                    </Table.Body>
                                                                </Table>

                                                            }
                                                            actions={[{
                                                                key: 'done',
                                                                content: 'Done',
                                                                positive: true
                                                            }]}
                                                        />

                                                        </div>

                                                        <Line data={matchData[matchType]}
                                                              height={this.state.chartHeight}
                                                              options={this.state.chartOptions}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </Tab.Pane>
                            );
                        }
                    }
                ]
            }/>
        )
    }
}

export default Monitoring;