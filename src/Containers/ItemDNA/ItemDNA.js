import React, { Component } from 'react';
import { Message, Image, Search, Form, Grid } from "semantic-ui-react";
import { NftItem } from "../../Components";
import Config from '../../Config/Config';
import './ItemDNA.css';
import itemService from '../../Services/ItemService';
import AlertBox from '../../Utils/AlertBox';
import sb from '../../Services/StringBundleService';
import _ from 'lodash';

class ItemDNA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: null,
      isLoading: false,
      results: [],
      source: [],
      value: '',
      found: false,
      items: [],
      from: 0,
      to: 0,
    };

    this.initialize();
  }

  initialize = async() => {
    if (!await itemService.initialize()) {
      AlertBox.error("Can not load item rules");
      return;
    }

    let source = [];
    let rules = Array.from(itemService.ruleItem.values());
    rules.map((rule) => {
      source.push({
        title: sb.get("item.name." + rule.code),
        image: "/item/image/item_" + rule.code + ".png",
        description: 'CODE ' + rule.code,
        rule: rule,
      })
    });

    this.setState({
      source: source,
    });
  };

  defaultAlertOption = () => {
    return {
      position: 'top-right',
      effect: 'slide',
      beep: false,
      timeout: 3000
    };
  };

  onChangeFrom = (event) => {
    this.setState({
      from: event.target.value
    });
  };

  onChangeTo = (event) => {
    this.setState({
      to: event.target.value
    });
  };

  onSubmit = (event) => {
    const {
      from,
      to,
      rule,
    } = this.state;

    if (rule === null) {
      AlertBox.error("Please select item first", this.defaultAlertOption(1));
      return;
    }

    let scoreFrom = parseInt(from);
    let scoreTo = parseInt(to);
    if (scoreFrom < 0 || scoreFrom > 100 || scoreTo < 0 || scoreTo > 100 || scoreTo < scoreFrom) {
      AlertBox.error("Invalid score", this.defaultAlertOption(1));
      return;
    }

    let resultItem = null;
    for (let index = 0; index < 1; index++) {
      let dna = itemService.generateRandomDna(50, 50);
      let item = {
        code: rule.code,
        dna: dna,
        exp: 1,
        level: 1
      };


      let score = itemService.calculateScore(item);
      if (scoreFrom <= score && score <= scoreTo) {
        resultItem = item;
        break;
      }
    }

    if (resultItem != null) {
      this.setState({
        items: [resultItem]
      })
    }
  };

  handleResultSelect = (e, { result }) => {
    this.setState({
      value: result.title,
      rule: result.rule
    })
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) {
        return this.setState({
          isLoading: false,
          results: [],
          value: ''
        });
      }

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = (result) => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
      })
    }, 300);
  };

  onClickItem = () => {

  };

  render() {
    const {
      isLoading,
      results,
      value,
      rule,
      items,
      found
    } = this.state;

    return (
        <div id="LinkEthBody" className="ItemDNA">
          <div>
            <Message icon info>
              <div>
                { rule !== null ?
                    <Image className="SearchBoxItemIcon" src={'/item/image/item_' + rule.code + ".png"}/>
                    :
                    <Image className="SearchBoxItemIcon" src={'/item/image/item_none.png'}/>
                }
              </div>

              <Message.Content>
                <Search
                    className="SearchBox"
                    fluid
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, {
                      leading: true,
                    })}
                    results={results}
                    value={value}
                    {...this.props}
                />
              </Message.Content>
            </Message>

            <Form onSubmit={this.onSubmit}>
              <Form.Group widths='equal'>
                <Form.Input id="from" fluid label='From Score' placeholder='80' onChange={this.onChangeFrom}/>
                <Form.Input id="to" fluid label='To Score' placeholder='90' onChange={this.onChangeTo}/>
              </Form.Group>
              <Form.Button>Submit</Form.Button>
            </Form>
          </div>
          <div className="ResultBox">

            { items.length === 0 && found ?
                <div>
                  결과를 찾을 수 없습니다. 다시 시도해주세요.
                </div>
                :
                ""
            }

            <Grid columns={1}>
              { items.map((item) => {
                let rule = itemService.ruleItem.get(item.code);
                if (rule == null) {
                  console.error("no rule for:" + item.code);
                  return '';
                }

                let itemImage = Config.itemImageRoot + 'item_' + item.code + ".png";
                let itemName = sb.get('item.name.' + item.code);
                let stats = itemService.getStats(item.code, item.level, item.dna);
                let score = itemService.calculateScore(item);
                let requiredExp = itemService.getRequiredExp(item.level);
                let itemLv = itemService.ruleItemLv.get(item.level);
                let exp = item.exp - itemLv.count;
                let canLvUp = requiredExp === 0 ? false : (exp >= requiredExp);
                let expWidth = "0%";
                if (requiredExp > 0) {
                  expWidth = (exp * 100 / requiredExp) + '%';
                }

                return (
                    <Grid.Column key={item.code}>
                      <NftItem
                          item={item}
                          size="Big"
                          rule={rule}
                          stats={stats}
                          itemName={itemName}
                          itemImage={itemImage}
                          score={score}
                          canLvUp={canLvUp}
                          expWidth={expWidth}
                          onClickItem={()=>this.onClickItem(item)}/>
                      <div>
                        <br/>
                        <pre>
                          {
                            JSON.stringify(item, null, 2)
                          }
                        </pre>
                      </div>
                    </Grid.Column>
                );
              })}
            </Grid>
          </div>
        </div>
    );
  }
}

export default ItemDNA;
