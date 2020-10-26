import React, { Component } from 'react';
import { Message, Button } from "semantic-ui-react";
import ruleService from '../../Services/RuleService';
import AlertBox from '../../Utils/AlertBox';
import Config from '../../Config/Config';
import './RuleBody.css';

class RuleBody extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  onClickDeployRule = async () => {
    let res = await ruleService.deployRule();
    if (res != null) {
      AlertBox.success('Rule deployed!');
    } else {
      AlertBox.error('Failed to rule deploy!');
    }
  };

  onClickDeployLanguage = async () => {
    let res = await ruleService.deployLangs();
    if (res != null) {
      AlertBox.success('Rule deployed!');
    } else {
      AlertBox.error('Failed to rule deploy!');
    }
  };

  render() {
    return (
        <div id="RuleBody" className="RuleBody">
          <h1>Ruleset</h1>
          <div className="RuleBodyDescBox">
            <Message info>
              <Message.Header>Rule Related Documents</Message.Header>
              <Message.Item>
                <a href={Config.ruleDoc} target='_blank'>Rule Origin</a>
              </Message.Item>
              <Message.Item>
                <a href={Config.langDoc} target='_blank'>Language Set</a>
              </Message.Item>
            </Message>

            <div>
              <Button primary onClick={this.onClickDeployRule}>Deploy Game Rule</Button>
              <Button primary onClick={this.onClickDeployLanguage}>Deploy Language Set</Button>
            </div>

          </div>
        </div>
    );
  }
}

export default RuleBody;
