import React, {Component} from 'react';
import {Form, Button, Table, Divider, Modal, List, Input, Icon, Segment, Select} from "semantic-ui-react";
import eventService from '../../Services/EventService';


const referrerEventTargetOps = [
    {key: 'ETH', value: 'ETH', text: 'ETH'},
    {key: 'TRON', value: 'TRON', text: 'TRON'},
    {key: 'KLAYTN', value: 'KLAYTN', text: 'KLAYTN'}
];

const emptyNewReferrerEvent = {
    eventName: '레퍼러이벤트_',
    startTime: Math.floor(new Date().getTime() / 1000) + 86400,
    endTime: Math.floor(new Date().getTime() / 1000) + 86400 * 30,
    eventTargetType: 'ETH',
    registeredSince: Math.floor(new Date().getTime() / 1000),
    referrerCodes: [],
    minLevel: 1,
    mailTitle: 'post.message.referral.reward'
};

class ReferrerEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            remainReferrerEvents: [],
            referrerRates: [],
            newReferrerEvent: JSON.parse(JSON.stringify(emptyNewReferrerEvent)),
            referrerCodes: [],
            referrerCodeFormat: "",
            modalReferrerCodeFormat: ""

        };

        this.handleClickReferrerCodeButton = this.handleClickReferrerCodeButton.bind(this);
        this.handleNewReferrerEventInputChange = this.handleNewReferrerEventInputChange.bind(this);
        this.handleAddReferrerCode = this.handleAddReferrerCode.bind(this);
        this.handleRemoveReferrerCode = this.handleRemoveReferrerCode.bind(this);
        this.handleRemoveReferrerEvent = this.handleRemoveReferrerEvent.bind(this);
        this.handleSummit = this.handleSummit.bind(this);
        this.getReferrerRates = this.getReferrerRates.bind(this);
        this.handleNewReferrerEventSelectChange = this.handleNewReferrerEventSelectChange.bind(this);
    }

    async componentDidMount() {
        await this.getRemainReferrerEvents();
        await this.getReferrerRates();
    }

    async getRemainReferrerEvents() {
        const remainReferrerEvents = await eventService.getRemainReferrerEvents();

        if (remainReferrerEvents) {
            this.setState({
                remainReferrerEvents: remainReferrerEvents
            })
        }
    }

    async getReferrerRates() {
        const referrerRates = await eventService.getReferrerRates();

        if (referrerRates) {
            this.setState({
                referrerRates: referrerRates
            })
        }
    }

    handleClickReferrerCodeButton(eventSeq, event) {
        const found = this.state.remainReferrerEvents.find(e => e.eventSeq === eventSeq);

        console.log(found);

        this.setState({
            referrerCodes: found.referrerCodes
        })
    }

    handleNewReferrerEventInputChange(event) {
        const target = event.target;

        let fieldName = target.name;
        let fieldValue = target.value;

        if (fieldName) {
            console.log(`state name : ${fieldName}`);
            console.log(`state value : ${fieldValue}`);

            if (fieldName === 'referrerCodeFormat') {
                this.setState({
                    referrerCodeFormat: fieldValue
                });
            } else if (fieldName === 'modalReferrerCodeFormat') {
                this.setState({
                    modalReferrerCodeFormat: fieldValue
                });
            } else {
                const newReferrerEvent = this.state.newReferrerEvent;
                newReferrerEvent[fieldName] = fieldValue;

                this.setState({
                    newReferrerEvent: newReferrerEvent
                });
            }
        }
    }


    async handleAddReferrerCode(eventSeq) {

        if (!this.state.referrerCodeFormat && !this.state.modalReferrerCodeFormat) {
            return;
        }

        const split = eventSeq ? this.state.modalReferrerCodeFormat.split(',') : this.state.referrerCodeFormat.split(',');

        if (split.length !== 2) {
            alert('invalid referrerCode input format')
            return;
        }

        const referrerCode = split[0].trim();
        const address = split[1].trim();

        console.log(eventSeq)
        console.log(referrerCode)
        console.log(address)

        if (eventSeq) {

            const referrerEvent = this.state.remainReferrerEvents.find(e => e.eventSeq === eventSeq);

            if (this.isValidAddress(referrerEvent.eventTargetType, address) === false) {
                alert('invalid address format')
                return;
            }

            const currentReferrerCodes = referrerEvent.referrerCodes;

            const codeFound = currentReferrerCodes.find(e => e.code === referrerCode);

            if (codeFound) {
                alert('duplicate referrerCode')
                return;
            }

            const addressFound = currentReferrerCodes.find(e => e.address === address);
            if (addressFound) {
                alert('duplicate ethAddress')
                return;
            }

            await eventService.addReferrerCode(eventSeq, referrerCode, address);
            this.setState({
                modalReferrerCodeFormat: "",
            });
            await this.getRemainReferrerEvents();

            this.handleClickReferrerCodeButton(eventSeq);
        } else {

            const newReferrerEvent = this.state.newReferrerEvent;

            if (this.isValidAddress(newReferrerEvent.eventTargetType, address) === false) {
                alert('invalid address format')
                return;
            }

            const currentReferrerCodes = newReferrerEvent.referrerCodes;

            const codeFound = currentReferrerCodes.find(e => e.code === referrerCode);

            if (codeFound) {
                alert('duplicate referrerCode')
                return;
            }

            const addressFound = currentReferrerCodes.find(e => e.address === address);
            if (addressFound) {
                alert('duplicate ethAddress')
                return;
            }

            currentReferrerCodes.push({code: referrerCode, address: address});
            newReferrerEvent['referrerCodes'] = currentReferrerCodes

            this.setState({
                newReferrerEvent: newReferrerEvent,
                referrerCodeFormat: ""
            });

        }
    }

    isValidAddress(eventTargetType, address) {
        if (eventTargetType === 'ETH') {
            return address.startsWith("0x") && address.length === 42
        } else if (eventTargetType === 'TRON') {
            return address.startsWith("T") && address.length === 34
        } else {
            return false;
        }
    }

    async handleRemoveReferrerCode(referrerCode, eventSeq, event) {

        console.log(`referrerCode : ${referrerCode}`);
        console.log(`eventSeq : ${eventSeq}`);

        if (eventSeq) {
            await eventService.deleteReferrerCode(eventSeq, referrerCode);
            await this.getRemainReferrerEvents();
            this.handleClickReferrerCodeButton(eventSeq);
        } else {
            const newReferrerEvent = this.state.newReferrerEvent;
            const currentReferrerCodes = newReferrerEvent.referrerCodes;

            newReferrerEvent['referrerCodes'] = currentReferrerCodes.filter(e => e.code !== referrerCode);

            this.setState({
                newReferrerEvent: newReferrerEvent
            });
        }
    }

    async handleRemoveReferrerEvent(eventSeq) {
        await eventService.deleteReferrerEvent(eventSeq);
        await this.getRemainReferrerEvents();
    }

    handleNewReferrerEventSelectChange(event, data) {

        console.log(data);

        const fieldName = data.name;
        const fieldValue = data.value;

        if (fieldName) {
            console.log(`state name : ${fieldName}`);
            console.log(`state value : ${fieldValue}`);

            const newReferrerEvent = this.state.newReferrerEvent;
            newReferrerEvent[fieldName] = fieldValue;

            this.setState({
                newReferrerEvent: newReferrerEvent
            });
        }
    }

    async handleSummit() {
        console.log('onSummit');
        await eventService.saveReferrerEvent(this.state.newReferrerEvent);
        this.setState({
            newReferrerEvent: JSON.parse(JSON.stringify(emptyNewReferrerEvent))
        });

        await this.getRemainReferrerEvents();
    }

    render() {
        return (
            <div>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>추천 받은 수</Table.HeaderCell>
                            <Table.HeaderCell>GiveBack 비율</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            this.state.referrerRates.map(referrerRate => {
                                return (
                                    <Table.Row key={referrerRate.threshold}>
                                        <Table.Cell>>= {referrerRate.threshold}</Table.Cell>
                                        <Table.Cell>{referrerRate.rate}%</Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }

                    </Table.Body>
                </Table>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>이벤트 이름</Table.HeaderCell>
                            <Table.HeaderCell>타겟 체인</Table.HeaderCell>
                            <Table.HeaderCell>시작 시간</Table.HeaderCell>
                            <Table.HeaderCell>종료 시간</Table.HeaderCell>
                            <Table.HeaderCell>이후에 가입한</Table.HeaderCell>
                            <Table.HeaderCell>등록된 코드</Table.HeaderCell>
                            <Table.HeaderCell>삭제</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            this.state.remainReferrerEvents.map(remainEvent => {
                                return (
                                    <Table.Row key={remainEvent.eventSeq}>
                                        <Table.Cell>{remainEvent.eventName}</Table.Cell>
                                        <Table.Cell>{remainEvent.eventTargetType}</Table.Cell>
                                        <Table.Cell>{new Date(remainEvent.startTime * 1000).toLocaleString()}</Table.Cell>
                                        <Table.Cell>{new Date(remainEvent.endTime * 1000).toLocaleString()}</Table.Cell>
                                        <Table.Cell>{new Date(remainEvent.registeredSince * 1000).toLocaleString()}</Table.Cell>
                                        <Table.Cell>
                                            <Modal

                                                trigger={<Button color={'brown'}
                                                                 onClick={event => this.handleClickReferrerCodeButton(remainEvent.eventSeq, event)}>View</Button>}
                                                header='ReferrerCodes'
                                                content={
                                                    <Table>
                                                        <Table.Header>
                                                            <Table.Row>
                                                                <Table.Cell>referrerCode</Table.Cell>
                                                                <Table.Cell>eth address</Table.Cell>
                                                                <Table.Cell>count</Table.Cell>
                                                                <Table.Cell>Delete</Table.Cell>
                                                            </Table.Row>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {
                                                                this.state.referrerCodes.map(referrerCode => {
                                                                    return (<Table.Row
                                                                        key={referrerCode.address}>
                                                                        <Table.Cell>{referrerCode.code}</Table.Cell>
                                                                        <Table.Cell>{referrerCode.address}</Table.Cell>
                                                                        <Table.Cell>{referrerCode.count}</Table.Cell>
                                                                        <Table.Cell><Button fluid
                                                                                            color={'red'}
                                                                                            onClick={() => this.handleRemoveReferrerCode(referrerCode.code, remainEvent.eventSeq)}>delete</Button></Table.Cell>
                                                                    </Table.Row>)
                                                                })
                                                            }
                                                            <Table.Row>
                                                                <Table.Cell colSpan={4} textAlign={'center'}>
                                                                    <Input fluid type={"text"}
                                                                           name={'modalReferrerCodeFormat'}
                                                                           value={this.state.modalReferrerCodeFormat}
                                                                           onChange={this.handleNewReferrerEventInputChange}
                                                                           action={{
                                                                               color: 'teal',
                                                                               icon: 'plus square',
                                                                               content: 'Add',
                                                                               onClick: () => this.handleAddReferrerCode(remainEvent.eventSeq)
                                                                           }}
                                                                           placeholder='referrerCode,ethAddress'
                                                                    />
                                                                </Table.Cell>
                                                            </Table.Row>
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
                                        <Table.Cell>
                                            <Button color={'red'}
                                                    onClick={() => this.handleRemoveReferrerEvent(remainEvent.eventSeq)}>DEL</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }

                    </Table.Body>
                </Table>
                <Divider horizontal>NEW</Divider>
                <Form widths='equal'>
                    <Form.Field>
                        <label>이벤트 이름</label>
                        <input type="text" name={'eventName'} value={this.state.newReferrerEvent.eventName}
                               onChange={this.handleNewReferrerEventInputChange} required={true}/>
                    </Form.Field>

                    <Form.Field>
                        <label>이벤트 대상</label>
                        <Select
                            name={'eventTargetType'}
                            value={this.state.newReferrerEvent.eventTargetType}
                            onChange={this.handleNewReferrerEventSelectChange}
                            options={referrerEventTargetOps}
                            required={true}/>
                    </Form.Field>

                    <Form.Field>
                        <label>최소 레벨</label>
                        <input type="number" name={'minLevel'} value={this.state.newReferrerEvent.minLevel}
                               min={1}
                               onChange={this.handleNewReferrerEventInputChange} required={true}/>
                    </Form.Field>

                    <Form.Group>
                        <Form.Field>
                            <label>시작 시간</label>
                            <input type="number" name={'startTime'}
                                   value={this.state.newReferrerEvent.startTime}
                                   onChange={this.handleNewReferrerEventInputChange} required={true}/>

                        </Form.Field>

                        <Form.Field>
                            <label>converted localTime</label>
                            <input value={new Date(this.state.newReferrerEvent.startTime * 1000).toLocaleString()}
                                   readOnly={true}/>
                        </Form.Field>
                    </Form.Group>

                    <Form.Group>
                        <Form.Field>
                            <label>이후에 가입한</label>
                            <input type="number" name={'registeredSince'}
                                   value={this.state.newReferrerEvent.registeredSince}
                                   onChange={this.handleNewReferrerEventInputChange}
                                   required={true}/>
                        </Form.Field>
                        <Form.Field>
                            <label>converted localTime</label>
                            <input value={new Date(this.state.newReferrerEvent.registeredSince * 1000).toLocaleString()}
                                   readOnly={true}/>
                        </Form.Field>

                    </Form.Group>


                    <Form.Group>
                        <Form.Field>
                            <label>종료 시간</label>
                            <input type="number" name={'endTime'} value={this.state.newReferrerEvent.endTime}
                                   onChange={this.handleNewReferrerEventInputChange}
                                   required={true}/>
                        </Form.Field>
                        <Form.Field>
                            <label>converted localTime</label>
                            <input value={new Date(this.state.newReferrerEvent.endTime * 1000).toLocaleString()}
                                   readOnly={true}/>
                        </Form.Field>
                    </Form.Group>


                    <Form.Field>
                        <label>레퍼러 코드</label>
                        <Input type={"text"} name={'referrerCodeFormat'} value={this.state.referrerCodeFormat}
                               onChange={this.handleNewReferrerEventInputChange}
                               action={{
                                   color: 'teal',
                                   icon: 'plus square',
                                   content: 'Add',
                                   onClick: () => this.handleAddReferrerCode()
                               }}
                               placeholder='referrerCode,ethAddress'
                        />
                        <List divided verticalAlign='middle'>
                            {
                                this.state.newReferrerEvent.referrerCodes.map(referrerCode => {
                                    return (
                                        <List.Item key={referrerCode.code}>
                                            <List.Content>
                                                {referrerCode.code},{referrerCode.address}
                                                <Icon color={'red'} name={'remove'} link
                                                      onClick={() => this.handleRemoveReferrerCode(referrerCode.code)}/>
                                            </List.Content>
                                        </List.Item>
                                    )
                                })
                            }
                        </List>
                    </Form.Field>
                </Form>
                <Segment basic textAlign='center'><Button color='green' onClick={() => this.handleSummit()}>등록</Button></Segment>
            </div>

        )
    }
}

export default ReferrerEvent;