import React, { Component } from 'react';
import {Message, Image, Search, Table, Grid} from "semantic-ui-react";
import { NftItem } from "../../Components";
import Config from '../../Config/Config';
import './ItemCraftEvent.css';
import itemService from '../../Services/ItemService';
import AlertBox from '../../Utils/AlertBox';
import sb from '../../Services/StringBundleService';
import _ from 'lodash';

class ItemCraftEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: null,
      isLoading: false,
      results: [],
      source: [],
      value: '',
      scores: []
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

  handleResultSelect = (e, { result }) => {
    let res = this.calculateScore(result.rule);
    let scores = [];
    let sum = 0.0;
    let found = false;
    for (let index = 0; index < res.length; index++) {
      let chance = res[index];
      if (found === false && chance === 0) {
        continue;
      }

      found = true;
      sum += chance;
      scores.push({
        score: index,
        chance: (chance * 100).toFixed(2)
      })
    }

    this.setState({
      value: result.title,
      rule: result.rule,
      scores: scores,
    })
  };

  calculateScore = (rule) => {
    let p = rule.stat2RevealRate * 0.01;
    let q = rule.stat3RevealRate * 0.01;
    console.error(p);
    console.error(q);

    let probs = [
      0.0, (1 - p) * (1 - q),
      0.0, p * (1 - q),
      0.0, (1 - p) * q,
      0.0, p * q];

    for (let index = 0; index < probs.length; index++) {
      probs[index] *= 1.0 / (101 * 101 * 101);
    }

    let res = [];
    for (let index = 0; index <= 100; index++) {
      res[index] = 0.0;
    }

    for (let stat1 = 0; stat1 <= 100; stat1++) {
      for (let stat2 = 0; stat2 <= 100; stat2++) {
        for (let stat3 = 0; stat3 <= 100; stat3++) {
          for (let reveal2 = 0; reveal2 <= 1; reveal2++) {
            for (let reveal3 = 0; reveal3 <= 1; reveal3++) {
              this.add(stat1, stat2, stat3, reveal2, reveal3, rule, res, probs);
            }
          }
        }
      }
    }

    return res;
  };

  add = (stat1, stat2, stat3, reveal2, reveal3, rule, res, probs) => {
    let reveal1 = 1;
    let reveal = (reveal3 << 2) | (reveal2 << 1) | reveal1;
    let dna = (reveal << 24) | (stat3 << 16) | (stat2 << 8) | stat1;
    let cur = itemService.calculateScoreWithDna(rule, dna);
    res[cur] += probs[reveal];
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

  render() {
    const {
      isLoading,
      results,
      value,
      rule,
      scores,
    } = this.state;

    let product0 = {
      pid: "presalebox0"
    };

    return (
        <div id="LinkEthBody" className="ItemCE">
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

          </div>
          <div className="ResultBox">
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Score</Table.HeaderCell>
                  <Table.HeaderCell>%</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { scores.map((item) => {

                  return (
                      <Table.Row>
                        <Table.Cell>{item.score}</Table.Cell>
                        <Table.Cell>{item.chance}</Table.Cell>
                      </Table.Row>
                  )})
                }
              </Table.Body>
            </Table>

          </div>
        </div>
    );
  }
}

export default ItemCraftEvent;
