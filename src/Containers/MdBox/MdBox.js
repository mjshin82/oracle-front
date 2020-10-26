import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, TransitionablePortal, Modal } from 'semantic-ui-react'
import www from "../../Utils/www.js";
import './MdBox.css';

class MdBox extends Component {
  static instance = null;

  constructor(props) {
    super(props);
    MdBox.instance = this;
    this.state = {
      input: "",
      open: false,
    };
  }

  static show(url) {
    MdBox.instance.display(url);
  }

  static hide() {
    MdBox.instance.close();
  }

  display = async (url) => {
    let input = await www.get(url);
    this.setState({
      input: input,
      open: true
    });
  };

  close = () => {
    this.setState({
      open: false
    });
  };

  defaultAlertOption = (timeout) => {
    return {
      position: 'top-right',
      effect: 'slide',
      beep: false,
      timeout: timeout * 1000
    };
  };

  render() {
    const {
      open,
      input,
    } = this.state;

    return (
        <div>
          <TransitionablePortal open={this.state.open} transition={{ animation:'fade', duration: 200 }}>
            <Modal open={open} onClose={this.close} className="MdBox">
              <Modal.Content scrolling>
                <div>
                  <div>
                    <ReactMarkdown source={input} />
                  </div>
                </div>
              </Modal.Content>
              <Modal.Actions>
                <Button primary onClick={this.close}>
                  Close
                </Button>
              </Modal.Actions>
            </Modal>
          </TransitionablePortal>
        </div>
    );
  }
}

export default MdBox;
