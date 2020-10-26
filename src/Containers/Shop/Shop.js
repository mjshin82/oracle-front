import React, {Component} from 'react';
import {Form, Select, Table, Divider, Grid, Menu, Segment, Button, Modal, Input} from "semantic-ui-react";
import shopService from "../../Services/ShopService";
import eventService from "../../Services/EventService";

const additionalRewardOps = [
    {key: 'MAGIC_WATER', value: 'MAGIC_WATER', text: 'MAGIC_WATER'},
    {key: 'MAGIC_BEAN', value: 'MAGIC_BEAN', text: 'MAGIC_BEAN'},
    {key: 'PET', value: 'PET', text: 'PET'},
    {key: 'MATERIAL', value: 'MATERIAL', text: 'MATERIAL'},
    {key: 'ITEM', value: 'ITEM', text: 'ITEM'},
    {key: 'PET_EGG', value: 'PET_EGG', text: 'PET_EGG'},
    {key: 'PET_BOX', value: 'PET_BOX', text: 'PET_BOX'}
];

const emptyAdditionalReward = {
    rewardType: 'PET_BOX',
    rewardId: '',
    rewardAmount: 1,
    rewardDetail: 'PgtType1'
}


class Shop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            specialShopProducts: [],
            additionalRewards: [],
            newAdditionalReward: JSON.parse(JSON.stringify(emptyAdditionalReward)),
        }

        this.handleClickEditAdditional = this.handleClickEditAdditional.bind(this);
        this.handleRemoveAdditionalReward = this.handleRemoveAdditionalReward.bind(this);
        this.handleNewAdditionalRewardTypeChange = this.handleNewAdditionalRewardTypeChange.bind(this);
        this.needRewardId = this.needRewardId.bind(this);
        this.fixed1Reward = this.fixed1Reward.bind(this);
        this.needRewardDetail = this.needRewardDetail.bind(this);
        this.handleNewAdditionalRewardInputChange = this.handleNewAdditionalRewardInputChange.bind(this);
        this.handleAddAdditionalReward = this.handleAddAdditionalReward.bind(this);
    }

    async componentDidMount() {
        await this.getSpecialShopProducts();
    }

    async getSpecialShopProducts() {
        const specialShopProducts = await shopService.getSpecialProducts();

        console.log(`specialShopProducts : ${JSON.stringify(specialShopProducts)}`);
        this.setState({
            specialShopProducts: specialShopProducts
        });
    }

    handleClickEditAdditional(pid) {
        const found = this.state.specialShopProducts.find(e => e.rule.pid === pid);

        console.log(found);

        this.setState({
            additionalRewards: found.additionalRewards
        })
    }

    async handleAddAdditionalReward(pid) {

        const found = this.state.specialShopProducts.find(e => e.rule.pid === pid);

        const currentAdditionalRewards = found.additionalRewards;

        const alreadyExistRewardType = currentAdditionalRewards.find(e => e.rewardType === this.state.newAdditionalReward.rewardType);

        if (alreadyExistRewardType) {
            alert('duplicate rewardType')
            return;
        }

        const after = await shopService.registerAdditionalRewards({
            pid: pid,
            reward: this.state.newAdditionalReward
        });

        if (after) {
            this.setState({
                newAdditionalReward: JSON.parse(JSON.stringify(emptyAdditionalReward)),
                specialShopProducts: after
            });
        }


    }

    async handleRemoveAdditionalReward(pid, rewardType) {

        const after = await shopService.removeAdditionalRewards(pid, rewardType);

        if (after) {
            this.setState({
                specialShopProducts: after
            });
        }
    }

    handleNewAdditionalRewardTypeChange(event, data) {

        console.log(data);

        const fieldName = data.name;
        const rewardTypeValue = data.value;

        if (fieldName) {
            console.log(`state name : ${fieldName}`);
            console.log(`state value : ${rewardTypeValue}`);

            const newAdditionalReward = this.state.newAdditionalReward;
            newAdditionalReward[fieldName] = rewardTypeValue;

            if (!this.needRewardId(rewardTypeValue)) {
                newAdditionalReward['rewardId'] = ''
            }

            if (!this.needRewardDetail(rewardTypeValue)) {
                newAdditionalReward['rewardDetail'] = ''
            } else {
                if (rewardTypeValue === 'PET_BOX') {
                    newAdditionalReward['rewardDetail'] = 'PgtType1'
                } else {
                    newAdditionalReward['rewardDetail'] = ''
                }
            }

            if (this.fixed1Reward(rewardTypeValue)) {
                newAdditionalReward['rewardAmount'] = 1;
            }


            this.setState({
                newAdditionalReward: newAdditionalReward
            });
        }
    }

    fixed1Reward(rewardType) {
        return rewardType === 'PET' || rewardType === 'PET_EGG' || rewardType === 'ITEM';
    }

    needRewardId(rewardType) {
        return rewardType === 'PET' || rewardType === 'MATERIAL' || rewardType === 'PET_EGG' || rewardType === 'ITEM';
    }

    needRewardDetail(rewardType) {
        return rewardType === 'PET_BOX' || rewardType === 'PET' || rewardType === 'PET_EGG' || rewardType === 'ITEM';
    }

    handleNewAdditionalRewardInputChange(event, data) {
        console.log(event);
        console.log(data);
        const target = event.target;

        const fieldName = target.name;
        const fieldValue = target.value;

        if (fieldName) {
            console.log(`state name : ${fieldName}`);
            console.log(`state value : ${fieldValue}`);

            const newAdditionalReward = this.state.newAdditionalReward;
            newAdditionalReward[fieldName] = fieldValue;

            this.setState({
                newAdditionalReward: newAdditionalReward
            });
        }
    }


    render() {
        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>pid</Table.HeaderCell>
                        <Table.HeaderCell>$</Table.HeaderCell>
                        <Table.HeaderCell>bean</Table.HeaderCell>
                        <Table.HeaderCell>group</Table.HeaderCell>
                        <Table.HeaderCell>purchasableCount</Table.HeaderCell>
                        <Table.HeaderCell>additionalReward</Table.HeaderCell>
                        <Table.HeaderCell>edit</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        this.state.specialShopProducts.map(specialShopProduct => {
                            return (<Table.Row key={specialShopProduct.rule.pid}>
                                <Table.Cell>{specialShopProduct.rule.pid}</Table.Cell>
                                <Table.Cell>{specialShopProduct.rule.price / 100}$</Table.Cell>
                                <Table.Cell>{specialShopProduct.rule.ruby}</Table.Cell>
                                <Table.Cell>{specialShopProduct.rule.shopGroup}</Table.Cell>
                                <Table.Cell>{specialShopProduct.rule.purchasableCount}</Table.Cell>

                                <Table.Cell>
                                    <Table attached>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>RewardType</Table.HeaderCell>
                                                <Table.HeaderCell>RewardId</Table.HeaderCell>
                                                <Table.HeaderCell>RewardAmount</Table.HeaderCell>
                                                <Table.HeaderCell>RewardDetail</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                specialShopProduct.additionalRewards.map(additionalReward => {
                                                    return (
                                                        <Table.Row key={additionalReward.rewardType}>
                                                            <Table.Cell>{additionalReward.rewardType}</Table.Cell>
                                                            <Table.Cell>{additionalReward.rewardId}</Table.Cell>
                                                            <Table.Cell>{additionalReward.rewardAmount}</Table.Cell>
                                                            <Table.Cell>{additionalReward.rewardDetail}</Table.Cell>
                                                        </Table.Row>
                                                    )
                                                })
                                            }
                                        </Table.Body>
                                    </Table>
                                </Table.Cell>
                                <Table.Cell>
                                    <Modal

                                        trigger={<Button color={'brown'}
                                                         onClick={event => this.handleClickEditAdditional(specialShopProduct.rule.pid, event)}>Edit</Button>}
                                        header='Additional Rewards'
                                        content={
                                            <Table>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell>RewardType</Table.HeaderCell>
                                                        <Table.HeaderCell>RewardId</Table.HeaderCell>
                                                        <Table.HeaderCell>RewardAmount</Table.HeaderCell>
                                                        <Table.HeaderCell>RewardDetail</Table.HeaderCell>
                                                        <Table.HeaderCell>Delete</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {
                                                        this.state.additionalRewards.map(additionalReward => {
                                                            return (<Table.Row
                                                                key={additionalReward.rewardType}>
                                                                <Table.Cell>{additionalReward.rewardType}</Table.Cell>
                                                                <Table.Cell>{additionalReward.rewardId}</Table.Cell>
                                                                <Table.Cell>{additionalReward.rewardAmount}</Table.Cell>
                                                                <Table.Cell>{additionalReward.rewardDetail}</Table.Cell>
                                                                <Table.Cell>
                                                                    <Button fluid
                                                                            color={'red'}
                                                                            onClick={() => this.handleRemoveAdditionalReward(specialShopProduct.rule.pid, additionalReward.rewardType)}>delete</Button></Table.Cell>
                                                            </Table.Row>)
                                                        })
                                                    }
                                                    <Table.Row>
                                                        <Table.Cell>
                                                            <Select name={'rewardType'}
                                                                    value={this.state.newAdditionalReward.rewardType}
                                                                    onChange={this.handleNewAdditionalRewardTypeChange}
                                                                    options={additionalRewardOps}/>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Input
                                                                type={'number'}
                                                                name={'rewardId'}
                                                                value={this.state.newAdditionalReward.rewardId}
                                                                onChange={this.handleNewAdditionalRewardInputChange}
                                                                disabled={!this.needRewardId(this.state.newAdditionalReward.rewardType)}/>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Input
                                                                type={'number'}
                                                                name={'rewardAmount'}
                                                                value={this.state.newAdditionalReward.rewardAmount}
                                                                onChange={this.handleNewAdditionalRewardInputChange}
                                                                disabled={this.fixed1Reward(this.state.newAdditionalReward.rewardType)}/>
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            <Input
                                                                type={'text'}
                                                                name={'rewardDetail'}
                                                                value={this.state.newAdditionalReward.rewardDetail}
                                                                onChange={this.handleNewAdditionalRewardInputChange}
                                                                disabled={!this.needRewardDetail(this.state.newAdditionalReward.rewardType)}/>
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            <Button fluid
                                                                    color={'teal'}
                                                                    onClick={() => this.handleAddAdditionalReward(specialShopProduct.rule.pid)}>ADD</Button>

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

                            </Table.Row>)
                        })
                    }
                </Table.Body>
            </Table>
        )
    }


}

export default Shop;