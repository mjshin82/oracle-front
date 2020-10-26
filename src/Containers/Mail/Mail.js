import React, {Component} from 'react';
import {Form, Select, Table, Divider} from "semantic-ui-react";
import mailService from '../../Services/MailService';

const rewardOps = [
    {key: 'NONE', value: 'NONE', text: 'NONE'},
    {key: 'MAGIC_WATER', value: 'MAGIC_WATER', text: 'MAGIC_WATER'},
    {key: 'MAGIC_BEAN', value: 'MAGIC_BEAN', text: 'MAGIC_BEAN'},
    {key: 'PET', value: 'PET', text: 'PET'},
    {key: 'BT_M', value: 'BT_M', text: 'BT_M'},
    {key: 'BT_F', value: 'BT_F', text: 'BT_F'},
    {key: 'MATERIAL', value: 'MATERIAL', text: 'MATERIAL'},
    {key: 'BUILDING', value: 'BUILDING', text: 'BUILDING'},
    {key: 'ETH', value: 'ETH', text: 'ETH'},
    {key: 'TRON', value: 'TRON', text: 'TRON'},
];

const emptyMail = {
    rawUids: '',

    uids: [],
    title: 'post.message.1',
    rewardType: 'NONE',
    rewardId: '',
    rewardAmount: 1,
    rewardDetail: '',
    validDay: 7,
    cause: ''
}


class Mail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newMail: JSON.parse(JSON.stringify(emptyMail)),
            backupRawUids: ''
        }

        this.handleSummit = this.handleSummit.bind(this);
        this.handleMailInputChange = this.handleMailInputChange.bind(this);
        this.handleMailRewardChange = this.handleMailRewardChange.bind(this);
    }

    async handleSummit() {


        await mailService.registerMail(this.state.newMail);

        this.setState({
            newMail: JSON.parse(JSON.stringify(emptyMail))
        });
    }

    handleMailInputChange(event) {
        const target = event.target;

        const fieldName = target.name;
        const fieldValue = target.value;

        if (fieldName) {
            console.log(`state name : ${fieldName}`);
            console.log(`state value : ${fieldValue}`);

            const newMail = this.state.newMail;
            newMail[fieldName] = fieldValue;

            if (fieldName === 'rawUids') {
                const uids = fieldValue.split(',');

                const found = uids.find(element => isNaN(element));

                console.log(found);

                if (found) {
                    alert("Invalid uid format");
                    newMail[fieldName] = this.state.backupRawUids;
                    newMail['uids'] = this.state.backupRawUids.split(',');
                } else {
                    newMail['uids'] = fieldValue.split(',');
                    this.setState({
                        backupRawUids: fieldValue
                    })
                }
            }

            if (fieldName === 'validDay') {
                newMail['expirationTime'] = Math.floor(new Date().getTime() / 1000.0) + fieldValue * 86400;
            }

            this.setState({
                newMail: newMail
            });
        }
    }

    handleMailRewardChange(event, data) {

        console.log(data);

        const fieldName = data.name;
        const fieldValue = data.value;

        if (fieldName) {
            console.log(`state name : ${fieldName}`);
            console.log(`state value : ${fieldValue}`);

            const newMail = this.state.newMail;
            newMail[fieldName] = fieldValue;

            if (this.fixed1Reward(fieldValue)) {
                newMail['rewardAmount'] = 1;
            }


            this.setState({
                newMail: newMail
            });
        }
    }

    needRewardDetail(rewardType) {
        return rewardType === 'BUILDING' || rewardType === 'PET';
    }

    needRewardId(rewardType) {
        return rewardType === 'BUILDING' || rewardType === 'PET' || rewardType === 'MATERIAL';
    }

    fixed1Reward(rewardType) {
        return rewardType === 'PET';
    }

    hasReward(rewardType) {
        return rewardType !== 'NONE';
    }


    render() {
        return (
            <Form onSubmit={this.handleSummit}>
                <Form.Field>
                    <label>Target UserIds</label>
                    <input type="text" name={'rawUids'} value={this.state.newMail.rawUids}
                           onChange={this.handleMailInputChange} required={true}/>
                    <Table color={'purple'} singleLine striped>
                        <Table.Body>
                            {
                                this.state.newMail.uids.map(uid => {
                                    return (
                                        <Table.Row key={uid}>
                                            <Table.Cell>{uid}</Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
                </Form.Field>
                <Divider horizontal>REWARD</Divider>
                <Form.Field>
                    <label>Reward</label>
                    <Select name={'rewardType'} value={this.state.newMail.rewardType}
                            onChange={this.handleMailRewardChange}
                            options={rewardOps}
                            required={true}/>
                </Form.Field>

                <div>
                    {this.hasReward(this.state.newMail.rewardType) ?
                        <Form.Field>
                            <label>보상 수량</label>
                            <input type="number" name={'rewardAmount'}
                                   value={this.state.newMail.rewardAmount}
                                   min={1}
                                   readOnly={this.fixed1Reward(this.state.newMail.rewardType)}
                                   onChange={this.handleMailInputChange} required={true}/>
                        </Form.Field> : null
                    }
                </div>

                <div>
                    {this.hasReward(this.state.newMail.rewardType) && this.needRewardId(this.state.newMail.rewardType) ?
                        <Form.Field>
                            <label>펫 Code OR 빌딩 Code OR 재료 Code</label>
                            <input name={'rewardId'}
                                   value={this.state.newMail.rewardId}
                                   onChange={this.handleMailInputChange}
                                   required={true}
                            />
                        </Form.Field> : null
                    }
                </div>

                <div>
                    {this.hasReward(this.state.newMail.rewardType) && this.needRewardDetail(this.state.newMail.rewardType) ?
                        <Form.Field>
                            <label>펫 최소 % OR 빌딩 레벨</label>
                            <input name={'rewardDetail'}
                                   value={this.state.newMail.rewardDetail}
                                   onChange={this.handleMailInputChange}
                                   required={this.state.newMail.rewardType === 'BUILDING'}
                            />
                        </Form.Field> : null
                    }
                </div>

                <Form.Field>
                    <label>유효 기간</label>
                    <input type="number" name={'validDay'}
                           value={this.state.newMail.validDay}
                           min={1}
                           onChange={this.handleMailInputChange} required={true}/>
                </Form.Field>

                <Form.Field>
                    <label>메일함 문구</label>
                    <input name={'title'}
                           value={this.state.newMail.title}
                           onChange={this.handleMailInputChange}
                           maxLength={28}
                           required={true}/>
                </Form.Field>

                <Form.Field>
                    <label>지급 사유</label>
                    <input name={'cause'}
                           value={this.state.newMail.cause}
                           maxLength={100}
                           onChange={this.handleMailInputChange} required={true}/>
                </Form.Field>

                <Form.Button type='submit'>Submit</Form.Button>
            </Form>

        )

    }
}

export default Mail;