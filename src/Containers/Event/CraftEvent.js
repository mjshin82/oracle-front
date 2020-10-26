import React, {Component} from 'react';
import {Form, Select, Segment, Button, Table} from "semantic-ui-react";
import eventService from "../../Services/EventService";

const craftEventTargetOps = [
    {key: 'ALL', value: 'ALL', text: 'ALL'},
    {key: 'ETH', value: 'ETH', text: 'ETH'},
    {key: 'TRON', value: 'TRON', text: 'TRON'},
    {key: 'KLAYTN', value: 'KLAYTN', text: 'KLAYTN'}
];

const craftEventRewardOps = [
    {key: 'MAGIC_WATER', value: 'MAGIC_WATER', text: 'MAGIC_WATER'},
    {key: 'MAGIC_BEAN', value: 'MAGIC_BEAN', text: 'MAGIC_BEAN'},
    {key: 'ETH', value: 'ETH', text: 'ETH'},
    {key: 'TRON', value: 'TRON', text: 'TRON'},
];

const emptyNewCraftEvent = {
    eventName: '제작이벤트_MMDD',
    startTime: Math.floor(new Date().getTime() / 1000) + 86400,
    submitLimitTime: Math.floor(new Date().getTime() / 1000) + 86400 * 2,
    endTime: Math.floor(new Date().getTime() / 1000) + 86400 * 6,
    eventTargetType: 'ALL',
    maxUserLimit: 50,
    maximumScore: '',
    minLevel: 5,
    minimumScore: '',
    rewardType: 'MAGIC_WATER',
    rewardAmount: '',
    targetItemCode: '',
    targetItemLevel: ''
};

class CraftEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAddFormToggleOn: false,
            remainCraftEvents: [],
            newCraftEvent: JSON.parse(JSON.stringify(emptyNewCraftEvent))
        };

        // This binding is necessary to make `this` work in the callback
        this.toggleAddForm = this.toggleAddForm.bind(this);
        this.handleNewCraftEventInputChange = this.handleNewCraftEventInputChange.bind(this);
        this.handleNewCraftEventSelectChange = this.handleNewCraftEventSelectChange.bind(this);
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
        this.handleSummit = this.handleSummit.bind(this);
    }

    async componentDidMount() {
        await this.getRemainCraftEvents();
    }

    toggleAddForm() {
        if (this.state.isAddFormToggleOn) {
            this.setState({
                newCraftEvent: JSON.parse(JSON.stringify(emptyNewCraftEvent))
            });
        }

        this.setState(prevState => ({
            isAddFormToggleOn: !prevState.isAddFormToggleOn
        }));
    }

    handleNewCraftEventInputChange(event) {
        const target = event.target;
        console.log(target);

        let fieldName = target.name;
        let fieldValue = target.value;

        if (fieldName) {
            console.log(`state name : ${fieldName}`);
            console.log(`state value : ${fieldValue}`);

            const newCraftEvent = this.state.newCraftEvent;
            newCraftEvent[fieldName] = fieldValue;

            this.setState({
                newCraftEvent
            });
        }
    }

    handleNewCraftEventSelectChange(event, data) {

        console.log(data);

        const fieldName = data.name;
        const fieldValue = data.value;

        if (fieldName) {
            console.log(`state name : ${fieldName}`);
            console.log(`state value : ${fieldValue}`);

            const newCraftEvent = this.state.newCraftEvent;
            newCraftEvent[fieldName] = fieldValue;

            this.setState({
                newCraftEvent
            });
        }
    }

    async handleSummit() {
        await eventService.saveCraftEvent(this.state.newCraftEvent);
        this.setState({
            newCraftEvent: JSON.parse(JSON.stringify(emptyNewCraftEvent))
        });

        this.toggleAddForm();

        await this.getRemainCraftEvents();
    }

    async getRemainCraftEvents() {
        const remainEvents = await eventService.getRemainCraftEvents();

        console.log(`remainEvents : ${JSON.stringify(remainEvents)}`);
        this.setState({
            remainCraftEvents: remainEvents
        });
    }

    async handleDeleteEvent(eventSeq) {
        console.log(`delete ${eventSeq}`);
        await eventService.deleteCraftEvent(eventSeq);
        await this.getRemainCraftEvents();
    }

    render() {
        return (
            <div>
                <div>
                    <Segment>
                        진행중 / 진행 예정인 제작이벤트
                        <Table color={'green'} key={'green'}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>이벤트 번호</Table.HeaderCell>
                                    <Table.HeaderCell>이벤트 이름</Table.HeaderCell>
                                    <Table.HeaderCell>시작시간</Table.HeaderCell>
                                    <Table.HeaderCell>제출시간</Table.HeaderCell>
                                    <Table.HeaderCell>종료시간</Table.HeaderCell>
                                    <Table.HeaderCell>삭제</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    this.state.remainCraftEvents.map(remainEvent => {
                                        return (<Table.Row key={remainEvent.eventSeq}>
                                            <Table.Cell>{remainEvent.eventSeq}</Table.Cell>
                                            <Table.Cell>{remainEvent.eventName}</Table.Cell>
                                            <Table.Cell>{new Date(remainEvent.startTime * 1000).toLocaleString()}</Table.Cell>
                                            <Table.Cell>{new Date(remainEvent.submitLimitTime * 1000).toLocaleString()}</Table.Cell>
                                            <Table.Cell>{new Date(remainEvent.endTime * 1000).toLocaleString()}</Table.Cell>
                                            <Table.Cell>
                                                <button
                                                    onClick={event => this.handleDeleteEvent(remainEvent.eventSeq, event)}>Delete
                                                </button>
                                            </Table.Cell>
                                        </Table.Row>)
                                    })
                                }
                            </Table.Body>
                        </Table>
                    </Segment>
                    <Button onClick={this.toggleAddForm}> {this.state.isAddFormToggleOn ? '닫기' : '제작 이벤트 추가'}</Button>
                </div>
                <div>
                    {
                        this.state.isAddFormToggleOn ? (
                            <Segment>
                                <Form onSubmit={this.handleSummit}>
                                    <Form.Field>
                                        <label>이벤트 이름</label>
                                        <input type="text" name={'eventName'} value={this.state.newCraftEvent.eventName}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>시작 시간</label>
                                        <input type="number" name={'startTime'}
                                               value={this.state.newCraftEvent.startTime}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>

                                    </Form.Field>
                                    <Form.Field>
                                        <label>제출 마감 시간</label>
                                        <input type="number" name={'submitLimitTime'}
                                               value={this.state.newCraftEvent.submitLimitTime}
                                               onChange={this.handleNewCraftEventInputChange}
                                               required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>종료 시간</label>
                                        <input type="number" name={'endTime'} value={this.state.newCraftEvent.endTime}
                                               onChange={this.handleNewCraftEventInputChange}
                                               required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>이벤트 대상</label>
                                        <Select
                                            name={'eventTargetType'}
                                            value={this.state.newCraftEvent.eventTargetType}
                                            onChange={this.handleNewCraftEventSelectChange}
                                            options={craftEventTargetOps}
                                            required={true}/>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>제출 가능 인원</label>
                                        <input type="number" name={'maxUserLimit'}
                                               value={this.state.newCraftEvent.maxUserLimit}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>타겟 아이템 코드</label>
                                        <input type="number" name={'targetItemCode'}
                                               value={this.state.newCraftEvent.targetItemCode}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>타겟 아이템 레벨</label>
                                        <input type="number" name={'targetItemLevel'}
                                               value={this.state.newCraftEvent.targetItemLevel}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>최소 스코어</label>
                                        <input type="number" name={'minimumScore'}
                                               value={this.state.newCraftEvent.minimumScore}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>최대 스코어</label>
                                        <input type="number" name={'maximumScore'}
                                               value={this.state.newCraftEvent.maximumScore}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>참여 가능한 최소 레벨</label>
                                        <input type="number" name={'minLevel'} value={this.state.newCraftEvent.minLevel}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>보상</label>
                                        <Select name={'rewardType'} value={this.state.newCraftEvent.rewardType}
                                                onChange={this.handleNewCraftEventSelectChange}
                                                options={craftEventRewardOps}
                                                required={true}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <label>보상 수량 </label>
                                        <input type="number" name={'rewardAmount'}
                                               value={this.state.newCraftEvent.rewardAmount}
                                               onChange={this.handleNewCraftEventInputChange} required={true}/>
                                    </Form.Field>
                                    <Form.Button type='submit'>Submit</Form.Button>
                                </Form></Segment>) : null
                    }
                </div>
            </div>
        )

    }

}

export default CraftEvent;
