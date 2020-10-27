import React, { Component } from 'react';
import './TopNav.css';
import { Button, Dropdown } from "semantic-ui-react";

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { } = this.state;

    return (
        <div>
          <div className='TopNavBox'>
            <div className='TopNavBoxWrapper'>
              <div className="TopNavC">
                주식예보
              </div>
              <div className="TopNavR">
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default TopNav;