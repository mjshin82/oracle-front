import React, { Component } from 'react';
import {Table, Button, Input, Menu} from "semantic-ui-react";
import dashboardService from '../../Services/DashboardService';
import './PurchaseStat.css';
import util from '../../Utils/util';

import CanvasJSReact from '../../lib/canvasjs.react';
import {Bar} from "react-chartjs-2";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PurchaseStat extends Component {
  constructor(props) {
    super(props);

    let hours = [];
    for (let i = 0; i < 24; i++) {
      hours[i] = 0;
    }

    this.state = {
      duration: 3,
      hours: this.refreshHours(3),
    };
  }

  refreshHours(duration) {
    let iapLogs = dashboardService.iapLogs;
    let hours = [];
    for (let i = 0; i < 24; i++) {
      hours[i] = 0;
    }

    let now = Math.floor(Date.now().valueOf() /1000);
    let width = duration * 3600 * 24;

    iapLogs.forEach((e) => {
      let ymdt = e.purchaseYmdt - 3600 * 9;
      if ((now - ymdt) > width) {
        return;
      }

      let date = new Date(ymdt * 1000);
      let oldCnt = hours[date.getHours()];
      hours[date.getHours()] = oldCnt + 1;
    });

    return hours;
  }


  handleItemClick = (e, {value}) => {
    this.setState({
      duration: value,
      hours: this.refreshHours(value)
    })
  };

  render() {
    const { duration, hours } = this.state;

    let data = {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      datasets: [{
        label: 'Count',
        backgroundColor: 'rgb(217, 83, 79)',
        borderColor: 'rgba(217, 83, 79, 0.1)',
        data: hours,
        fill: true,
        pointRadius: 0.2,
        yAxisID: 'y-axis-1',
      }]
    };

    let options = {
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
        yAxes: [{
          type: 'linear',
          stacked: true,
          position: 'left',
          id: 'y-axis-1'
        }]
      }
    };


    return (
        <div id="PurchaseLog" className="PurchaseLog">
          <h1>Purchase Logs</h1>

          <Menu>
            <Menu.Item
                name='1 Days'
                value={1}
                active={duration === 1}
                onClick={this.handleItemClick}
            />
            <Menu.Item
                name='3 Days'
                value={3}
                active={duration === 3}
                onClick={this.handleItemClick}
            />
            <Menu.Item
                name='7 Days'
                value={7}
                active={duration === 7}
                onClick={this.handleItemClick}
            />
          </Menu>

          <Bar data={data} height={250} options={options}/>

          <div>
          </div>
        </div>
    );
  }
}

export default PurchaseStat;
