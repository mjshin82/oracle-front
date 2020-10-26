import React, { Component } from 'react';
import './TopNav.css';
import { Button, Dropdown } from "semantic-ui-react";
import authService from "../../Services/AuthService";

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: authService.account,
    };
  }

  componentDidMount() {
    authService.addEventHandler('updated', this.onRefresh);
  }

  componentWillUnmount() {
    authService.removeEventHandler('updated', this.onRefresh);
  }

  onRefresh = () => {
    this.setState({
      account: authService.account
    });
  };

  onClickSignIn = async () => {
  };

  onSelectAccountMenu = (e, data) => {
    if (data.value === 'logout') {
      authService.clearAuth();
    }
  };

  render() {
    const { account } = this.state;
    const options = [
      { key: 'logout', className: 'left', text: 'Logout', value: 'logout' },
    ];

    return (
        <div>
          <div className='TopNavBox'>
            <div className='TopNavBoxWrapper'>
              <div className="TopNavC">

              </div>
              <div className="TopNavR">
                { account == null ?
                    ""
                    :
                    <Dropdown text={account.email}
                              floating labeled className='icon'
                              options={options}
                              onChange={this.onSelectAccountMenu}>
                    </Dropdown>
                }
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default TopNav;