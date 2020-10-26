import React, {Component} from 'react';
import './MainBody.css';
import {
    Dashboard,
} from "../";

class MainBody extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: "dashboard"
        };
    }

    render() {
        return (
            <div className="MainBody">
                <div className='MainBodyWrapper'>
                    <Dashboard/>
                </div>
            </div>
        );
    }
}

export default MainBody;
